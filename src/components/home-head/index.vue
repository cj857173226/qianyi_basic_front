<template>
  <header class="header">
    <div class="left">
      <div class="logo">
        <img
          class="logo-img"
          :src="logo"
          alt=""
        />{{title}}}
      </div>
    </div>
    <div class="right">
      <div class="no-login" v-if="false">
        <div class="avatar">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="btn-wrap">
          <div class="btn-item login" @click="$router.push('/login')">登录</div>
          <div class="btn-item register">注册</div>
        </div>
      </div>
      <div
        class="back-home"
        v-if="$route.path == '/reset'"
        @click="$router.replace('/login')"
      >
        返回首页
      </div>
      <div
        class="has-user"
        v-if="
          $route.path == '/personRegister' || $route.path == '/legalRegister'
        "
      >
        已有账号？
        <span class="toLogin" @click="$router.replace('/login')">去登录</span>
      </div>
    </div>
  </header>
</template>

<script>
import logo from "../../../public/img/logo.png";
import webiste from "@/const/website";
export default {
  data() {
    return {
      logo: logo,
      title: webiste.title,
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.header {
  padding: 0 45px;
  width: 100%;
  height: $top-nav-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  .left {
    display: flex;
    align-items: center;
    .logo {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 25px;
      color: #333333;
      .logo-img {
        margin-right: 20px;
        width: 55px;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    color: #333333;
    .no-login {
      display: flex;
      align-items: center;
      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        width: 34px;
        height: 34px;
        border: 2px solid #ffffff;
        user-select: none;
        border-radius: 50%;
      }
      .btn-wrap {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        border: 2px solid #ffffff;
        border-radius: 17px;
        .btn-item {
          user-select: none;
          cursor: pointer;
          padding: 0 6px;
          border-right: 1px solid #ffffff;
          &:last-child {
            border-right: 0;
          }
        }
      }
    }
    .back-home {
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      height: 26px;
      line-height: 24px;
      padding: 0 12px;
      border-radius: 13px;
      border: 1px solid #ffffff;
    }
    .has-user {
      .toLogin {
        color: #02a8f0;
        font-weight: 800;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>