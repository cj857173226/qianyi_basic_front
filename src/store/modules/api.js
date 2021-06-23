import $ from "jquery";
import { Message } from "element-ui";
import store from "../index";
const development = process.env.NODE_ENV == "development" ? true : false;
const API = window.sessionStorage.getItem("BASE_API")
  ? JSON.parse(window.sessionStorage.getItem("BASE_API"))
  : { FILE_URL: "" };
const url = development ? "/config.json" : "./config.json";
if (!API.FILE_URL || development) {
  $.get(url)
    .then((res) => store.dispatch("GetApi", res))
    .catch((err) => Message.error("缺少地址文件！"));
}

const api = {
  state: {
    PRO_BASE_API: API.PRO_BASE_API,
    DEV_BASE_API: API.DEV_BASE_API,
    VERSION: API.VERSION,
    FILE_URL: API.FILE_URL,
    IS_FLOCAL_ROUTING: API.IS_FLOCAL_ROUTING,
    LOGIN_LINK_URL: API.LOGIN_LINK_URL,
  },
  mutations: {
    GetApi(state, data) {
      if (development) {
        //测试环境下保存在sessionStorage，便于本地开发时修改代码不用刷新页面来重新获取api
        window.sessionStorage.setItem("BASE_API", JSON.stringify(data));
      } else {
        if (!window.location.origin) {
          //兼容ie，ie不支持location.origin
          window.location.origin =
            window.location.protocol +
            "//" +
            window.location.hostname +
            (window.location.port ? ":" + window.location.port : "");
        }
        data["PRO_BASE_API"] =
          window.location.origin.replace(/\/$/, "") + data["PRO_BASE_API"];
      }
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
  actions: {
    GetApi({ commit }, data) {
      commit("GetApi", data);
    },
  },
};

export default api;
