import { serialize } from "@/util/util";
import { getStore } from "../util/store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";
import Vue from "vue";
import errorCode from "@/const/errorCode";
import router from "@/router/router";
import { Message } from "element-ui";
const version = window.globalConfig.VERSION;
import qs from "qs";
import store from "../store";
const is_Dev = process.env.NODE_ENV == "development" ? true : false;
let baseUrl = is_Dev ? window.globalConfig.DEV_BASE_API : window.globalConfig.PRO_BASE_API;
axios.defaults.timeout = 50000;
axios.defaults.baseURL = baseUrl;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false,
});

// HTTPrequest拦截
axios.interceptors.request.use(
  (config) => {
    NProgress.start(); // start progress bar
    const TENANT_ID = getStore({ name: "tenantId" });
    const isToken = (config.headers || {}).isToken === false;
    const token = store.getters.access_token;
    if (token && !isToken) {
      config.headers["Authorization"] = "Bearer " + token; // token
    }
    if (TENANT_ID) {
      config.headers["TENANT-ID"] = TENANT_ID; // 租户ID
    }
    config.headers["VERSION"] = version;
    // headers中配置serialize为true开启序列化
    if (config.method === "post" && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }

    if (config.method === "get") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// HTTPresponse拦截
axios.interceptors.response.use(
  (res) => {
    NProgress.done();

    return res;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(new Error(error));
  }
);

export default axios;
