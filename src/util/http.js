import $ from "jquery";
import { Message } from "element-ui";
import { numberFilter } from "./number";
import store from "../store";
import router from "../router/router";
import { returnBtn } from "./util";
const is_Dev = process.env.NODE_ENV == "development" ? true : false;
const Timeout = 0;
let tf = false;
let name = window.globalConfig.VERSION;
let imgUrl = window.globalConfig.FILE_URL;
let baseUrl = is_Dev ? window.globalConfig.DEV_BASE_API : window.globalConfig.PRO_BASE_API;

/**
 * http请求方法
 * @param {*} config  请求配置对象
 */
function httpRequest(config) {
    // 默认配置
    let defaultConfg = {
        url: "", //请求地址
        method: 'post', //请求方式
        eTarget: null, //事件句柄 针对el-button做loding
        token: store.state.user.access_token ? store.state.user.access_token : null,
        isThrow: true,//是抛出异常
        data: {}, //请求参数
        isForm: false, //是否为表单请求
        timeout: Timeout,
        export: false,

    }
    config = Object.assign(defaultConfg, config);
    config.method = config.method.toUpperCase();
    let btn = config.eTarget && config.eTarget !== "form" ? returnBtn(config.eTarget.path) : null;
    let contentType = '';

    if (btn) {
        $(btn).addClass("is-loading");
        $(btn).prop("disabled", true);
        $(btn).prepend($('<i class="el-icon-loading"></i>'));
        $(btn).blur();
    }
    if (config.isForm || config.method === 'GET' || config.method === 'DELETE') {
        contentType = 'application/x-www-form-urlencoded;'
    } else {
        contentType = 'application/json;'
        config.data = JSON.stringify(config.data);
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            url: baseUrl + config.url,
            method: config.method,
            data: config.data,
            timeout: config.timeout,
            cache: !config.export,
            xhrFields: config.export ? {
                responseType: 'blob'
            } : {},
            headers: {
                Authorization: config.url.startsWith("/oauth/token")
                    ? "Basic " + config.token
                    : "Bearer " + config.token,
                "Content-Type": contentType,
                VERSION: name,
            }
        })
            .then((res) => {
                dealThen(res, config, btn, resolve)
            })
            .catch((err) => {
                dealError(err, config, btn, reject)
            });
    });
}

/**
 * 上传文件方法
 * @param {*} file //上传的文件
 * @param {*} url //上传的服务器地址
 */

function urlStr(obj) {
    return obj
        ? Object.keys(obj)
            .sort()
            .map(function (key) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    return val
                        .sort()
                        .map(function (val2) {
                            return (
                                encodeURIComponent(key) + "=" + encodeURIComponent(val2)
                            );
                        })
                        .join("&");
                }
                return encodeURIComponent(key) + "=" + encodeURIComponent(val);
            })
            .join("&")
        : "";
}


function upLoadFile(file, config = {}, url = "/admin/sys-file/upload") {
    if (file) {
        let _file = new Object();
        _file = file.file ? file.file : file;
        let _para = new FormData();
        _para.append("file", _file);
        return new Promise((resolve, reject) => {
            let options = {
                url: baseUrl + url,
                method: "POST",
                data: _para,
                timeout: Timeout,
                contentType: false,
                processData: false,
                headers: {
                    Authorization: "Bearer " + store.state.user.access_token,
                    VERSION: name,
                },
            }
            if(config.uploadProgress){
                options.xhr = config.uploadProgress
            }
            $.ajax(options)
                .then((res) => {
                    dealThen(res, { isThrow: true }, null, resolve)
                })
                .catch((err) => {
                    console.log(err);
                    dealError(err, { isThrow: true }, null, reject)
                });
        });
    } else {
        throw "no have file";
    }
}

/**
 * 批量导入方法
 * @param {*} file //上传的文件
 * @param {*} url  //接口名
 * @param {*} para //拼接的参数
 * 
 */

function upLoadFile1(file, url, para) {
    if (file) {
        let _file = new Object();
        _file = file.file ? file.file : file;
        let _para = new FormData();
        _para.append("file", _file);
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl + url + '?' + urlStr(para),
                method: "POST",
                data: _para,
                timeout: Timeout,
                contentType: false,
                processData: false,
                headers: {
                    Authorization: "Bearer " + store.state.user.access_token,
                    VERSION: name,
                },
            })
                .then((res) => {
                    dealThen(res, { isThrow: true }, null, resolve)
                })
                .catch((err) => {
                    dealError(err, { isThrow: true }, null, reject)
                });
        });
    } else {
        throw "no have file";
    }
}



/**
 * 处理成功回调
 * @param {*} res  成功返回的信息  
 * @param {*} config 请求配置
 * @param {*} btn  句柄
 */
function dealThen(res, config, btn, resolve) {
    tf = false;
    if (btn) {
        $(btn).prop("disabled", false);
        $(btn).removeClass("is-loading");
        $(btn)
            .find(".el-icon-loading")
            .remove();
    }
    if (typeof res === "string" && !config.export) {
        res = JSON.parse(res);
    }
    if (typeof res === 'object') {
        res.success = true;
    }
    if (config.isThrow && !config.export) {
        let result = numberFilter(res);
        if (result.code !== 0) {
            Message({
                message: result.msg,
                type: "error",
            });
        }
    }
    resolve(res);
}

/**
 * 
 * @param {*} err 请求失败返回的信息
 * @param {*} config  请求配置
 * @param {*} btn 句柄
 */
function dealError(err, config, btn, reject) {
    if (err.status === 401 && !tf) {
        tf = true;
        Message({
            message: "登录过期，请重新登录",
            type: "error",
        });
        store.dispatch("FedLogOut");
        router.push("/login");
        setTimeout(() => {
            tf = false;
        }, 2000);
    }
    if (btn) {
        $(btn).prop("disabled", false);
        $(btn).removeClass("is-loading");
        $(btn)
            .find(".el-icon-loading")
            .remove();
    }
    if (!tf) {
        if (config.isThrow && !config.export) {
            if (err.statusText === "timeout") {
                Message({
                    message: `请求超时！`,
                    type: "error",
                });
                err.abort();
            } else if (err.status === 401) {
                Message({
                    message: "登录身份过期！",
                    type: "error",
                });
                store.dispatch("FedLogOut");
                router.push("/login");
            } else if (err.responseJSON && err.responseJSON.msg) {
                Message({
                    message: err.responseJSON.msg,
                    type: "error",
                });
            } else {
                Message({
                    message: "网络异常!",
                    type: "error",
                });
            }
        }
        reject(err);
    }
}

export {
    httpRequest,
    upLoadFile,
    baseUrl,
    upLoadFile1,
}