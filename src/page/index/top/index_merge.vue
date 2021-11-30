<template>
  <div class="avue-top">
    <div class="top-right">
      <div class="top-bar__left">
        <img class="logo" :src="logo" alt="" /> {{ title }}
      </div>
      <div class="top-bar__title">
        <div v-if="showMenu" class="top-bar__item top-bar__item--show">
          <top-menu />
        </div>
      </div>
      <div class="top-bar__right">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo.nickname }}
            <div class="user-avatar">
              <i class="el-icon-s-custom"></i>
            </div>
            <span class="el-dropdown-username">{{ userInfo.username }}</span>
            <i class="el-icon-caret-bottom el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/">首页</router-link>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, handleImg, listenfullscreen } from "@/util/util";
import logo from "@/../public/img/logo.png";
import webiste from "@/const/website";
import topMenu from "./top-menu";
export default {
  name: "Top",
  components: {
    topMenu,
  },
  filters: {},
  data() {
    return {
      logo: logo,
      title: webiste.title,
    };
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScreen: (state) => state.common.showFullScreen,
      showCollapse: (state) => state.common.showCollapse,
      showMenu: (state) => state.common.showMenu,
      showColor: (state) => state.common.showColor,
    }),
    ...mapGetters([
      "userInfo",
      "isFullScreen",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
    ]),
  },
  created() {
    // handleImg(this.userInfo.avatar, "thumbnail");
  },
  mounted() {
    listenfullscreen(this.setScreen);
    // this.getCenterInfo();
      console.log(this.showMenu)
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREEN");
    },
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut", this.userInfo.id).then((res) => {
          this.$router.push({ path: "/login" });
        });
      });
    },
    async getCenterInfo() {
      try {
        const res = await this.$api.getToken(`/qss/user/personCenterInfo`);
        if (res.success && res.code === 0) {
          this.$store.commit("SET_USER_SEAL", res.data.esignUser);
          this.$store.commit("SET_CENTER_INFO", res.data.sysUser);
        }
      } catch (err) {}
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
