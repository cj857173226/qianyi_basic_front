<template>
  <div class="login-wrap">
    <div class="login-title">中联大禹小区水厂物联网 管控平台</div>
    <div class="login-box">
      <div class="login-form">
        <!-- 账号登录 表单 -->
        <el-form
          ref="loginForm"
          :rules="loginRules"
          :model="loginForm"
          class="loginForm"
          size="super"
          label-width="36px"
          v-if="!codeLogin"
        >
          <el-form-item prop="username">
            <img slot="label" :src="usernameIcon" />
            <el-input
              v-model.trim="loginForm.username"
              auto-complete="off"
              placeholder="请输入账号"
              @keyup.enter.native="handleLogin"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <img slot="label" :src="passwordIcon" />
            <el-input
              :type="passwordType"
              v-model.trim="loginForm.password"
              auto-complete="off"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
            >
              <i
                slot="suffix"
                class="el-icon-view el-input__icon"
                @click="showPassword"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" class="code-line">
            <img slot="label" :src="checkCodeIcon" />
            <el-input
              v-model.trim="loginForm.code"
              auto-complete="off"
              placeholder="请输入验证码"
              @keyup.enter.native="handleLogin"
            >
            </el-input>
            <img @click="getCode" class="codeImg" :src="codeImg" alt />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button
              :loading="tf"
              class="login-submit"
              @click.native.prevent="handleLogin"
              >登&nbsp;录</el-button
            >
          </el-form-item>
          <!-- <div class="form-tools">
            <div class="item" @click="linkTo()">立即注册</div>
            <div class="item" @click="linkTo()">忘记密码</div>
          </div> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { randomLenNum } from "@/util/util";
import { mapGetters } from "vuex";
import usernameIcon from "@/../public/img/username-icon.png";
import passwordIcon from "@/../public/img/password-icon.png";
import checkCodeIcon from "@/../public/img/check-code-icon.png";

import $ from "jquery";
export default {
  name: "Userlogin",
  data() {
    return {
      codeLogin: false,
      usernameIcon: usernameIcon,
      passwordIcon: passwordIcon,
      checkCodeIcon: checkCodeIcon,
      socialForm: {
        code: "",
        state: "",
      },
      loginForm: {
        username: "",
        password: "",
        location: "backend",
        grant_type: "password",
        code: "",
      },
      checked: false,
      code: {
        src: undefined,
        len: 4,
      },
      codeImg: "",
      tf: false,
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { min: 6, message: "密码长度最少为6位", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      sendbtnTxt: "发送验证码",
      sendTimer: null,
      sendTime: 60,
      passwordType: "password",
      randomStr: Date.now(),
    };
  },
  created() {},
  mounted() {
    this.getCode();
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  props: [],
  methods: {
    async verifyCode(el) {
      try {
        const res = await this.$httpRequest({
          url: "/code/check",
          method: "get",
          data: {
            code: this.loginForm.code,
            randomStr: this.randomStr,
          },
        });
        if (res.code === 0) {
          this.login();
        } else {
          this.getCode();
        }
      } catch (err) {}
    },
    async getCode() {
      try {
        this.randomStr = Date.now();
        const res = await this.$httpRequest({
          url: "/code?randomStr=" + this.randomStr,
          method: "get",
        });
        if (res.code===0) {
          this.codeImg = res.data;
        } else {
          this.$message.error("验证码获取失败");
        }
      } catch (err) {}
    },
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.login();
        }
      });
      // this.$router.push('/index')
    },
    async login() {
      try {
        this.tf = true;
        let data = Object.assign(this.loginForm, {
          randomStr: this.randomStr,
        });
        this.$store
          .dispatch("LoginByUsername", data)
          .then((res) => {
            if (res.code === 0) {
              this.tf = false;
              this.$message({
                message: "登录成功",
                type: "success",
              });
              this.$router.push({ path: this.tagWel.value });
            } else {
              this.getCode();
            }
          })
          .catch((err) => {
            this.tf = false;
            this.getCode();
            this.$message.error(err.msg || "服务器异常");
          });
      } catch (err) {
        this.tf = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrap {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 2px 38px 0px rgba(0, 157, 207, 0.4);
  border-radius: 12px;
  padding: 68px 44px 47px;
  .login-title {
    font-size: 24px;
    text-align: center;
    margin: 0 auto 50px;
    font-weight: bold;
    width: 286px;
    line-height: 31px;
  }
}
.login-box {
  .login-form {
    width: 100%;
    .form-head {
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #0092e5;
      font-size: 20px;
      letter-spacing: 2px;
    }
    .loginForm {
      /deep/.el-form-item__label {
        display: flex;
        align-items: center;
        justify-content: center;
        &:before {
          display: none;
        }
        img {
          width: 24px;
          height: 24px;
        }
      }
      .ipt-icon {
        font-size: 18px;
      }
      .el-form-item {
        margin-bottom: 26px;
        /deep/.el-input__inner {
          border: 1px solid #f0f0f0;
          border-radius: 4px;
        }
      }
      .login-submit {
        width: 100%;
        height: 48px;
        background: linear-gradient(90deg, #00efff 0%, #00c2ff 100%);
        border-radius: 24px;
        border: 0;
        color: #ffffff;
        font-weight: 800;
        margin-top: 7px;
        &:hover {
          opacity: 0.9;
        }
        &:active {
          opacity: 0.95;
        }
      }

      .code-line {
        .el-input {
          width: calc(100% - 130px);
        }
        /deep/.el-form-item__content {
          display: flex;
          align-items: center;
        }
        // /deep/.el-input--prefix .el-input__inner {
        //   padding-right: 120px;
        // }
        .codeImg {
          margin-left: 30px;
          height: 48px;
          line-height: 48px;
          width: 100px;
          background: #ffffff;
          text-align: center;
          border-radius: 4px;
        }
      }
      .form-tools {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
          cursor: pointer;
          font-size: 14px;
          color: #016dff;
          transition: all 0.12s ease;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
