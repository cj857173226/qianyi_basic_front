import axios from 'axios'
let baseUrl = is_Dev ? window.globalConfig.DEV_BASE_API : window.globalConfig.PRO_BASE_API;
// 创建axios实例
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 60000, // 请求超时时间
  // headers: {'Content-Type':'application/json;charset=UTF-8'},
  transformRequest: [function (data) {
    if (data instanceof FormData) {
      return data;
    }
    data = JSON.stringify(data)

    return data
  }]
})


export default service
