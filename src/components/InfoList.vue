<template>
  <div>
    <div align="center" style="margin-bottom: 30px;" class="menu">
      <el-dropdown>
        <el-button type="success">
          {{serviceInput}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="selectServiceType(item.itemValue,item.itemName)"
                            command="item.itemValue"
                            v-for="(item,index) in serviceType">
            <img :src=item.logo style="height: 30px; vertical-align: middle;width:40px;border:0;"/> {{item.itemName}}

          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <el-button type="success">
          {{regionInput}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="selectRegion(item.itemValue,item.itemName)"
                            command="item.itemValue"
                            v-for="(item,index) in regionList">
             <img :src=item.logo style="height: 30px; vertical-align: middle;width:40px;border:0;"/> {{item.itemName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="reloadTable()" circle icon="el-icon-refresh-right"
                 style="margin-left:10px;margin-right:10px"
                 type="success"
                 ></el-button>
    </div>
    <div align="center" style="width: 100%">
      <el-radio-group @change="getList(infoType,serviceTypeInfo,regionInfo)" size="medium"
                      v-model="infoType" style="width: 100%">
        <el-radio-button label="1" style="width: 50%">我要开车</el-radio-button>
        <el-radio-button label="0" style="width: 50%">我要上车</el-radio-button>
      </el-radio-group>
    </div>
    <div :key="item.itemValue" v-for="item in tableData">
      <div @click="selectDetails(item)">
        <el-card class="box-card" style="line-height: 10px">
          <div align="center" slot="header">
            <b>{{item.serviceType}} {{item.region}}</b>
          </div>
          <div align="center">
            <span>至少订阅 {{item.subscriptionDate}} 个月.{{item.description}}</span><br><br><br><br>
            <span> {{item.price}} RMB/月</span> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <span>{{item.outTime}}</span>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
        :center="true"
        :title=title+region
        :visible.sync="centerDialogVisible"
        width="70%"
    >
      <h3 align="center">以每月 {{price}} 的价格,至少订阅 {{subscriptionDate}} 个月.{{description}}</h3>
      <div v-if="isNaN(info)">
        <h3 :key="key" align="center" v-for="(value, key) in info">
          <div v-if="value">
            <el-link :href="'mailto:' + value" icon="el-icon-message"
                     style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" type="success"
                     v-if="key==='email'"> {{key}}
              : {{value}}
            </el-link>
            <el-link :href="'https:////t.me/'+value" icon="el-icon-s-promotion"
                     style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" type="success"
                     v-if="key==='tg'">
              Telegram : {{value}}
            </el-link>
            <el-link icon="el-icon-chat-dot-square" type="success" v-if="key==='weChat'"> 微信 :
              {{value}}
            </el-link>
          </div>
        </h3>
      </div>
      <div v-else>
        <p style="text-align: center;color: #C0C4CC"> 该用户希望自己的联系方式保密. 请通过留言的方式联系他.</p>
      </div>
      <div style="margin: 0 auto;width: 70%" v-if="this.isLogin === '给他留言'">
        <el-input
            :placeholder=this.textarea
            maxlength="20"
            show-word-limit
            type="text"
            v-model="text"
        />
        <span style="text-align: center;color: #C0C4CC">您的 Telegram ID 将会通过加密通道推送给他, 不需要再次填写</span>
      </div>
      <span class="dialog-footer" slot="footer">
         <el-button @click="submit" type="primary">
      {{isLogin}}
    </el-button>
    <el-button @click="centerDialogVisible = false">取 消</el-button>

  </span>
    </el-dialog>
    <el-dialog
        title="登录"
        style="text-align:center;"
        :visible.sync="dialogVisible"
        width="55%">
      <vue-telegram-login
          class=" el-link--success is-underline"
          style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;"
          @callback="login"
          mode="callback"
          telegram-login="qupinche_bot"></vue-telegram-login>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {vueTelegramLogin} from 'vue-telegram-login'

  export default {
    name: 'app',
    components: {vueTelegramLogin},
    data() {
      // eslint-disable-next-line no-unused-vars
      var serviceInput = "所有服务";
      var regionInput = "所有区域";
      var tableData = [];
      var serviceType = [];
      var regionList = [];
      var serviceTypeInfo;
      var regionInfo;
      var title = '';
      var price;
      var subscriptionDate;
      var description;
      var region;
      var info;
      var isLogin = '通过Telegram留言';
      var taxiID;
      return {
        infoType: '1',
        tableData,
        serviceType,
        regionList,
        serviceTypeInfo,
        regionInfo,
        serviceInput,
        regionInput,
        centerDialogVisible: false,
        dialogVisible: false,
        title,
        price,
        subscriptionDate,
        description,
        region,
        info,
        isLogin,
        text: '',
        textarea: '我想上车，请问还有位置吗？',
        taxiID
      }
    },
    return: {},
    methods: {
      submit() {
        if (this.isLogin === '给他留言') {
          var data = this.$qs.stringify({
            "message": this.text,
            "sender": this.$storage.get('username'),
            "taxiID": this.taxiID
          });
          this.axios
          .post('/api/bot/sendMsg', data)
          .then(response => {
            if (response.data.code === 200) {
              this.$message({
                message: "留言成功!",
                type: 'success'
              });
              this.centerDialogVisible = false
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch()
        } else {
          this.dialogVisible = true
        }
      },

      login(user) {
        // gets user as an input
        // id, first_name, last_name, username,
        // photo_url, auth_date and hash
        if (user == null) {
          this.$message({
            message: "登录失败",
            type: 'error'
          });
        } else {
          var data = this.$qs.stringify({
            "id": user.id,
            "authDate": user.auth_date,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "hash": user.hash,
            "photoUrl": user.photo_url,
            "userName": user.username
          });
          //存储用户信息
          this.axios
          .post('/api/auth/login', data)
          .then(response => {
            if (response.data.code === 200) {
              this.$message({
                message: "登录成功",
                type: 'success'
              });
              this.$storage.set('token', user.hash, {ttl: user.auth_date})
              this.$storage.set('username', user.username, {ttl: user.auth_date})
              this.loginLabel = this.$storage.get('username')
              this.isLogin = '给他留言'
              location.reload();
            } else {
              this.$message.error(response.data.msg);
            }
          }).catch()
        }
      },
      getList(type, serviceType, region) {
        var data = this.$qs.stringify({
          "type": type,
          "serviceType": serviceType,
          "region": region
        });
        this.axios
        .post('/api/taxiInfo/selectList', data)
        .then(response => (this.tableData = response.data.data)).catch()
      },
      selectDetails(row) {
        this.centerDialogVisible = true;
        this.title = row.serviceType;
        this.price = row.price;
        this.subscriptionDate = row.subscriptionDate;
        this.description = row.description;
        this.region = row.region;
        this.info = row.info
        this.taxiID = row.id;
      },
      selectServiceType(serviceType, itemName) {
        this.serviceInput = itemName;
        this.serviceTypeInfo = serviceType;
        this.getList(this.infoType, this.serviceTypeInfo, this.regionInfo)
      },
      selectRegion(region, itemName) {
        this.regionInput = itemName;
        this.regionInfo = region;
        this.getList(this.infoType, this.serviceTypeInfo, this.regionInfo)
      },
      reloadTable() {
        this.getList(1);
        this.serviceInput = "所有服务";
        this.regionInput = "所有区域";
        this.serviceTypeInfo = '';
        this.regionInfo = ''
      }
    },
    created() {
      this.getList('1');
      this.axios
      .get('/api/common/dictionary')
      .then(response => {
        (this.serviceType = response.data.data.serviceType);
        (this.regionList = response.data.data.region)
      }).catch();
      var hasToken = this.$storage.has('token');
      if (hasToken) {
        this.isLogin = '给他留言'
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      "$route": "getList(1)"
    }
  }
</script>

<style>
  span, b {
    line-height: 22px
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);

  }

  .el-dialog__body {
     overflow: auto;
     color: #666666;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-left: 1px solid #DCDFE6;
    border-radius: 4px 0 0 4px;
    -webkit-box-shadow: none!important;
    box-shadow: none!important;
    width: 100%;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 4px 4px 0;
    width: 100%;
  }
  .menu {
    position: absolute;
    right: 0px;
    top: 6px;
  }
</style>
