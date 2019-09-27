<template>
  <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px"
           ref="ruleForm">
    <div style="margin: 30px;">
      <el-radio-group size="medium" v-model="infoType">
        <el-radio-button label="1" >我要开车</el-radio-button>
        <el-radio-button label="0" >我要上车</el-radio-button>
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
    <el-form-item label="微信号">
      <el-input type="text" v-model="ruleForm.wechat"></el-input>
    </el-form-item>
    <el-form-item label="联系邮箱">
      <el-input type="text" v-model="ruleForm.email"></el-input>
    </el-form-item>
    <el-form-item label="描述">
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
      var serviceType;
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
          serverType: ''
        },
        rules: {
          serviceType: [
            {required: true, message: '请选择服务类型', trigger: 'change'}
          ],
          region: [
            {required: true, message: '请选择服务区域', trigger: 'change'}
          ], price: [
            {required: true, message: '请输入价格', trigger: 'change'}
          ], subscriptionDate: [
            {required: true, message: '请输入至少订阅时间', trigger: 'change'}
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
              "email": this.ruleForm.email
            });
            this.axios
            .post('/api/taxiInfo/insert', data)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      this.axios
      .get('/api/common/dictionary')
      .then(response => {
        (this.serviceType = response.data.data.serviceType)
        (this.region = response.data.data.region)
      })

    }
  }
</script>
