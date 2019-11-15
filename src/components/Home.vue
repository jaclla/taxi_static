<template>
  <div id="app">
    <el-container class="con_section">
      <el-header class="blueheader">
        <div style="float:left;">
          <el-button @click="changeStatus" circle icon="el-icon-s-unfold" size="medium"
                     type="success"></el-button>
        </div>
        <h2 class="headlogo">
          <span>欢迎使用 去拼车</span></h2>
      </el-header>
      <el-container>
        <el-menu :collapse="isCollapse"
                 @select="handleSelect" class="el-menu-vertical-demo" default-active="1">
          <el-menu-item index="#">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">{{loginLabel}}</span>
          </el-menu-item>
          <el-menu-item index="1">
            <i class="el-icon-s-order"></i>
            <span slot="title">信息列表</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-edit"></i>
            <span slot="title">发布信息</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-service"></i>
            <span slot="title">官方群组</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-user"></i>
            <span slot="title">官方Bot</span>
          </el-menu-item>
        </el-menu>
        <!-- Callback mode -->
        <el-main class="home_main">
          <el-col :span="24" class="breadcrumb-container">
          </el-col>
          <el-col :span="24">
            <div style="margin-top:10px">
              <router-view></router-view>
            </div>
          </el-col>
        </el-main>
      </el-container>
    </el-container>
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
    <el-dialog
        title="群组"
        :visible.sync="dialogVisible2"
        style="text-align:center;"
        width="55%">
      <a href="https:////t.me/gotaxi_tg " class="el-link el-link--success is-underline"
         style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;">
        <div class="el-link--inner" style="text-align: center;">
          <i class="el-icon-s-promotion"></i>
          <p>点击跳转到官方群组</p>
        </div>
      </a>
    </el-dialog>
    <el-dialog
        title="机器人"
        :visible.sync="dialogVisible3"
        style="text-align:center;"
        width="55%">
      <a href="https:////t.me/qupinche_bot" class="el-link el-link--success is-underline"
         style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;">
        <div class="el-link--inner" style="text-align: center">
          <i class="el-icon-s-promotion"></i>
          <p>点击跳转到官方Bot</p>
        </div>
      </a>
    </el-dialog>
  </div>
</template>

<script>
  import {vueTelegramLogin} from 'vue-telegram-login'
  import ElLink from "element-ui/packages/link/src/main";

  export default {
    name: 'app',
    components: {ElLink, vueTelegramLogin},
    data() {
      var loginLabel = ''
      return {
        collapseBtnClick: false,
        isCollapse: true,
        loginLabel,
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false
      }
    },
    methods: {
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
              this.loginItem = '给他留言'
              location.reload();
            } else {
              this.$message.error(response.data.msg);
            }
          })
        }
      },
      handleSelect(key) {
        switch (key) {
          case '1':
            this.$router.push('/InfoList')
            break
          case '2':
            this.$router.push('/InfoRelease')
            break
          case '#':
            this.dialogVisible = true
            break
          case '3':
            this.dialogVisible2 = true
            break
          case '4':
            this.dialogVisible3 = true
            break
        }
      },
      changeStatus() {
        this.isCollapse = !this.isCollapse;
      },
      _isMobile() {
        let flag = navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return flag;
      }
    }, created() {
      this.handleSelect('1')
      this.loginLabel = this.$storage.get('username', '请先登录')
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-link, .el-transfer-panel__filter .el-icon-circle-close .el-link--success is-underline {
    /* cursor: pointer; */
    width: 70%;
    margin: 0;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;
    min-height: 400px;
  }

  .el-menu {
    width: 65px;
  }

  .con_section {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
  }

  .blueheader {
    height: 60px;
    line-height: 60px;
    background: #67c23a;
    color: #fff;
  }

  .el-menu-item.is-active {
    color: #67c23a;
  }

  .headlogo {
    float: left;
    height: 60px;
    margin: 0 20px;
    width: 300px;
  }

  ul.el-menu {
    background: #e4e8f1;
  }

  .userinfo {
    position: absolute;
    right: 0;
  }

  .el-submenu__title {
    background: #eef1f6;
  }

  .el_main {
    padding: 0px;
  }

  .home_main {
    padding: 10px;
    width: 0;
  }

  .breadcrumb-container .title {
    width: 200px;
    float: left;
    color: #475669;
    font-size: 13px;
  }

  .breadcrumb-inner {
    float: right;
    font-size: 13px;
  }

  .el-breadcrumb__inner, .el-breadcrumb__inner a {
    font-weight: 400;
  }
</style>
