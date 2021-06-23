<template>
  <div class="avue-contail">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top />
    </div>
    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar />
      </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <tags :style="!menu || menu.length === 0 ? 'display:none' : ''" />
        <!-- 主体视图层 -->
        <div
          class="avue-view-main"
          :style="{ paddingTop: showTag ? '50px' : '20px' }"
        >
          <keep-alive>
            <router-view v-if="$route.meta.$keepAlive" class="avue-view" />
          </keep-alive>
          <router-view v-if="!$route.meta.$keepAlive" class="avue-view" />
        </div>
      </div>
    </div>
    <div class="avue-shade" @click="showCollapse" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
import Breadcrumb from "@/components/breadcrumb/index";
import { getStore } from "@/util/store.js";
import * as SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import store from "@/store";
import { SystemSettings } from "@/const/website";
export default {
  name: "Index",
  provide() {
    return {
      Index: this,
    };
  },
  components: {
    top,
    tags,
    sidebar,
    Breadcrumb,
  },
  data() {
    return {
      // 刷新token锁
      refreshLock: false,
      // 刷新token的时间
      refreshTime: "",
      // 计时器
      timer: "",
      showTag: SystemSettings.IS_NAV_TAGS,
    };
  },
  created() {},
  destroyed() {
    clearInterval(this.refreshTime);
    clearInterval(this.timer);
    /*
     * 默认关闭websocket，如需工作流通知，则开启
     * this.disconnect()
     */
  },
  mounted() {
    this.init();
    // 实时检测刷新token
    // this.refreshToken();
    /*
     * 默认关闭websocket，如需工作流通知，则开启
     * this.initWebSocket()
     */
  },
  computed: mapGetters([
    "userInfo",
    "isLock",
    "isCollapse",
    "website",
    "expires_in",
    "menu",
  ]),
  methods: {
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    openMenu(item = {}) {
      this.$store.dispatch("GetMenu").then((data) => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true);
        }
      });
    },
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "access_token",
          debug: true,
        });
        if (this.validatenull(token)) {
          return;
        }
        if (this.expires_in <= 500000 && !this.refreshLock) {
          this.refreshLock = true;
          this.$store
            .dispatch("RefreshToken")
            .then((res) => {
              if (res.code !== 0) {
                clearInterval(this.refreshTime);
                this.refreshTime = null;
                this.$store.dispatch("FedLogOut");
                this.$router.replace("/login");
              }
            })
            .catch((err) => {
              clearInterval(this.refreshTime);
              this.refreshTime = null;
              this.$store.dispatch("FedLogOut");
              this.$router.replace("/login");
            });
          this.refreshLock = false;
        }
        this.$store.commit("SET_EXPIRES_IN", this.expires_in - 10);
      }, 50000);
    },
    initWebSocket() {
      this.connection();
      const self = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send("test");
        } catch (err) {
          // console.log("断线了: " + err);
          self.connection();
        }
      }, 5000);
    },
    connection() {
      const token = store.getters.access_token;
      const TENANT_ID = getStore({ name: "tenantId" })
        ? getStore({ name: "tenantId" })
        : "1";
      const headers = {
        Authorization: "Bearer " + token,
      };
      // 建立连接对象
      this.socket = new SockJS("/act/ws"); // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        () => {
          this.stompClient.subscribe(
            "/task/" + this.userInfo.username + "-" + TENANT_ID + "/remind",
            (msg) => {
              // 订阅服务端提供的某个topic;
              this.$notify({
                title: "协同提醒",
                type: "warning",
                dangerouslyUseHTMLString: true,
                message: msg.body + "任务，请及时处理",
                offset: 60,
              });
            }
          );
        },
        (err) => {}
      );
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        // console.log("Disconnected");
      }
    },
    setCollapse(p) {
      // if (p && this.isCollapse === false) return;
      this.$store.commit("SET_COLLAPSE");
    },
  },
};
</script>

 <style lang="scss" scoped>
.sider-switch {
  padding: 0 20px;
  background: #fff;
  height: 56px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: default;
  .prefix-icon {
    color: $menu-icon-color;
    font-size: 20px;
    margin-right: 5px;
    text-align: center;
  }
  .text {
    font-size: 16px;
    overflow: hidden;
    width: 80px;
    white-space: nowrap;
    transition: width 0.3s ease-in;
  }
  .hide-text {
    width: 0;
  }
  .suffix-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -7px;
    cursor: pointer;
  }
}
</style>


