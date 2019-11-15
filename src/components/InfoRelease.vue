<template>
  <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px"
           ref="ruleForm">
    <div align="center" style="margin: 30px;">
      <el-radio-group size="medium" v-model="infoType">
        <el-radio-button label="1">我要开车</el-radio-button>
        <el-radio-button label="0">我要上车</el-radio-button>
      </el-radio-group>
    </div>
    <el-form-item label="选择服务" prop="serviceType">
      <el-select placeholder="请选择服务" v-model="ruleForm.serviceType">
        <el-option
            :key="item.itemName"
            :label="item.itemName"
            :value="item.itemValue"
            v-for="item in serviceType">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择区域" prop="region">
      <el-select placeholder="请选择区域" v-model="ruleForm.region">
        <el-option
            :key="item.itemName"
            :label="item.itemName"
            :value="item.itemValue"
            v-for="item in region">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input v-model="ruleForm.price"></el-input>
    </el-form-item>
    <el-form-item label="订阅时间" prop="subscriptionDate">
      <el-input v-model="ruleForm.subscriptionDate"></el-input>
    </el-form-item>
    <el-form-item label="联系方式保密" prop="secrecyLabel">
      <el-switch v-model="ruleForm.secrecyLabel"></el-switch>
    </el-form-item>
    <el-form-item label="微信号" prop="asdfasd">
      <el-input type="text" v-model="ruleForm.wechat"></el-input>
    </el-form-item>
    <el-form-item label="联系邮箱" prop="email">
      <el-input type="text" v-model="ruleForm.email"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="ruleForm.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="submitForm('ruleForm')" type="primary">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>

</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      var price = (rule, value, callback) => {
        var reg = /^[1-9]\d*$/;
        if (!value) {
          callback(new Error('不能为空'));
        }
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error('请输入正整数'));
          } else {
            callback();
          }
        }, 100);
      };
      var serviceType = [];
      var region = [];
      return {
        serviceType,
        region,
        infoType: '1',
        ruleForm: {
          region: '',
          secrecyLabel: true,
          email: '',
          description: '',
          wechat: '',
          serverType: '',
        },
        rules: {
          serviceType: [
            {required: true, message: '请选择服务类型', trigger: 'change'}
          ],
          region: [
            {required: true, message: '请选择服务区域', trigger: 'change'}
          ],
          price: [
            {required: true, validator: price, trigger: 'blur'}],
          subscriptionDate: [
            {required: true, validator: price, trigger: 'blur'}
          ]
          , description: [
            {max: 50, message: '请将留言控制在 50 字以内', trigger: 'blur'}
          ]
          , wechat: [
            {max: 20, message: '请将留言控制在 20 字以内', trigger: 'blur'}
          ]
          , email: [
            {type: 'email', max: 20, message: '请输入正确的邮箱', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = this.$qs.stringify({
              "type": this.infoType,
              "serviceType": this.ruleForm.serviceType,
              "region": this.ruleForm.region,
              "price": this.ruleForm.price,
              "subscriptionDate": this.ruleForm.subscriptionDate,
              "secrecyLabel": this.ruleForm.secrecyLabel,
              "description": this.ruleForm.description,
              "wechat": this.ruleForm.wechat,
              "email": this.ruleForm.email,
              "token": this.$storage.get('token'),
              "username":this.$storage.get('username')
            });
            this.axios
            .post('/api/taxiInfo/insert', data).then(response => {
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '发布成功!'
                });
                this.lookDetail();
              }else {
                this.$message.error(response.data.msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      lookDetail() {
        this.$router.push({
          name: "信息列表" // 要跳转的路径的 name,可在 router 文件夹下的 index.js 文件内找
        })
      }
    },
    created() {
      this.axios
      .get('/api/common/dictionary')
      .then(response => {
        (this.serviceType = response.data.data.serviceType);
        (this.region = response.data.data.region)
      })
    }
  }
</script>
