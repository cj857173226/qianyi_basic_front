<template>
  <div class="avue-top">
    <div
      class="top-left"
      :class="{ 'logo-fold': isCollapse }"
      @click="$router.push('/')"
    >
      <img :src="isCollapse ? menuTop : menuTopText" alt="" />
    </div>
    <div class="top-right">
      <div class="top-bar__left">
        <div class="collapse-btn" @click="setCollapse">
          <i class="el-icon-s-fold" :class="{ isOpen: isCollapse }"></i>
        </div>
        <div class="page-name">
          {{ $route.name }}
        </div>
      </div>
      <!-- <div class="top-bar__title">
        <div v-if="showMenu" class="top-bar__item top-bar__item--show">
          <top-menu />
        </div>
      </div> -->
      <div class="top-bar__right">
        <el-dropdown>
          <span class="el-dropdown-link">
            <!-- <img class="avatar-img" v-if="userInfo.avatar" :src="$baseUrl+'/'+userInfo.avatar" alt=""> -->
            <div class="user-avatar">
              <i class="el-icon-s-custom"></i>
            </div>

            <span class="el-dropdown-username">{{ userInfo.username }}</span>
            <i class="el-icon-caret-bottom el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided>
              <router-link to="/">首页</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <router-link to="/personal">个人中心</router-link>
            </el-dropdown-item>
            <!-- <el-dropdown-item divided @click.native="$refs.seting.open()">界面设置</el-dropdown-item> -->
            <el-dropdown-item divided @click.native="logout"
              >退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, handleImg, listenfullscreen } from "@/util/util";
import { SystemSettings } from "@/const/website";
export default {
  name: "Top",
  components: {},
  filters: {},
  data() {
    return {
      menuTop: SystemSettings.MENU_TOP_LOGO,
      menuTopText: SystemSettings.MENU_TOP_TEXT_LOGO,
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
.el-dropdown-link {
  color: #333333;
}
.collapse-btn {
  color: #333333;
  user-select: none;
  cursor: pointer;
  .el-icon-s-fold {
    transition: all 0.3s linear;
    &.isOpen {
      transform: rotate(90deg);
    }
  }
}
</style>
