<template>
  <div class="login-container">
    <div class="center-wrap">
      <div class="login-block  animated bounceInLeft" >
        <img style="width: 771px; height: 681px" :src="loginBlock" alt="" />
      </div>
      <div class="login-wrapper " >
        <userLogin></userLogin>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchList } from "@/api/admin/tenant";
import { mapGetters } from "vuex";
import { getStore, setStore } from "@/util/store";
import loginBlock from "@/../public/img/login-block.png";
import userLogin from "./userlogin";
export default {
  name: "Login",
  components: { userLogin },
  data() {
    return {
      loginBlock: loginBlock,
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["website", "tagWel"]),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background: url("../../../public/img/login-bg.png");
  background-size: 100% 100%;
  background-attachment: fixed;
  .center-wrap {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .login-block{
      margin-right: 192px;
    }
    .login-wrapper {
      animation-delay:0.3s;
      width: 400px;
      height: min-content;
    }
  }
}
@media screen and (max-width: 1200px) {
  .login-block {
    display: none;
  }
}
</style>
