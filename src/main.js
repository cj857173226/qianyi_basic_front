import "babel-polyfill";
import "classlist-polyfill";
import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
// import "./error"; // 日志
import router from "./router/router";
import "./permission"; // 权限
import "@/icons";
import validate from "./util/validatetor.js";
import store from "./store";
import { loadStyle } from "./util/util";
import * as urls from "@/config/env";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import * as filters from "./filters"; // 全局filter
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/my-theme/theme/index.css'
import "./styles/common.scss";
import avueFormDesign from "avue-plugin-formdesign";
import basicContainer from "./components/basic-container/main";
import powerBy from "./components/power-by/index"; // 技术支持
import oPagination from "./components/o-pagination/index"; // 自定义分页
import { httpRequest, upLoadFile, baseUrl, upLoadFile1 } from "./util/http";
import { encryption } from "@/util/util";
import { dateForm } from "@/util/dateForm";
import echarts from 'echarts'
import operator from './components/operator/index'//经办人组件
import { deepClone } from "./util/deepClones";
import VueQuillEditor from 'vue-quill-editor'// 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$httpRequest = httpRequest;
Vue.prototype.$upLoadFile = upLoadFile;
Vue.prototype.$upLoadFile1 = upLoadFile1;
Vue.prototype.$baseUrl = baseUrl;
Vue.prototype.$encryption = encryption;
Vue.prototype.$dateForm = dateForm;
Vue.prototype.$echarts = echarts
Vue.prototype.$bus = new Vue();
Vue.prototype.$permissions = store.state.user.permissions;
Vue.prototype.$deepClone = deepClone;
// 插件 json 展示
Vue.use(router);
Vue.use(validate);
Vue.use(avueFormDesign);
Vue.use(VueAxios, axios);
Vue.use(VueQuillEditor);

Vue.use(ElementUI, {
  size: "medium",
  menuType: "text",
});

Vue.use(window.AVUE, {
  size: "medium",
  menuType: "text",
});

// 注册全局容器
Vue.component("basicContainer", basicContainer);
Vue.component("powerBy", powerBy);
Vue.component("oPagination", oPagination);
Vue.component("operatorContainer", operator);

// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key];
});

// 加载过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

Vue.config.productionTip = false;

new Vue({
  router: router,
  store,
  render: (h) => h(App),
}).$mount("#app");

window.$store = store;
