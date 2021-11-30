//正式环境
//var BASE_URL = (window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.host) + '/gateway' //
//测试环境
var BASE_URL = (window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.host) + '/wm' //
window.globalConfig = {
    PRO_BASE_API: BASE_URL,

    DEV_BASE_API: '/api',
    // DEV_BASE_API: 'http://192.168.0.103:49999',

    VERSION: "wpg",

    FILE_URL: '/admin/sys-file/',

}