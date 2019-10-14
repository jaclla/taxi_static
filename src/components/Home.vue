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
        :visible.sync="dialogVisible"
        width="20%" center>
         <vue-telegram-login
             @callback="login"
             mode="callback"
             telegram-login="qupinche_bot"></vue-telegram-login>
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
        dialogVisible: false
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
          .post('/auth/login', data)
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
            if (!this._isMobile()) {
              this.$router.push('/Pc_InfoList')
            } else {
              this.$router.push('/M_InfoList')
            }
            break
          case '2':
            if (!this._isMobile()) {
              this.$router.push('/Pc_InfoRelease')
            } else {
              this.$router.push('/M_InfoRelease')
            }
            break
          case '#':
            this.dialogVisible=true
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
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
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
