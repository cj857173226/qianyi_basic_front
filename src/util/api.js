import Vue from "vue";

export function getApi(data) {
  const name = process.env.NODE_ENV == "development" ? data.VERSION : "";
  const imgUrl = data.FILE_URL;
  const baseUrl =
    process.env.NODE_ENV == "development"
      ? data.DEV_BASE_API
      : data.PRO_BASE_API;
  Vue.prototype.$baseUrl = baseUrl;
  Vue.prototype.$version = name;
  Vue.prototype.$imgUrl = imgUrl;
  return {baseUrl,name}
}
