/*
 *    Copyright (c) 2018-2025, qycloud All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: qycloud
 */
import request from "@/router/axios";
import qs from "qs";
const scope = "server";
const is_Dev = process.env.NODE_ENV == "development" ? true : false;
let baseUrl = is_Dev ? window.globalConfig.DEV_BASE_API : window.globalConfig.PRO_BASE_API;
let version = window.globalConfig.VERSION;
export const loginByUsername = (username, password, location, code, randomStr) => {
  const grant_type = "password";
  let dataObj = qs.stringify({ username, password, location, grant_type });
  return request({
    url: `${baseUrl}/auth/oauth/token?randomStr=${randomStr}&code=${code} `,
    headers: {
      isToken: false,
      "TENANT-ID": "1",
      Authorization: "Basic cGlnOnBpZw==",
      VERSION: version,
    },
    method: "post",
    data: dataObj,
  });
};
export const refreshToken = (refresh_token) => {
  const grant_type = "refresh_token";
  return request({
    url: baseUrl + "/auth/oauth/token",
    headers: {
      isToken: false,
      "TENANT-ID": "1",
      VERSION: version,
      Authorization: "Basic cGlnOnBpZw==",
    },
    method: "post",
    params: { refresh_token, grant_type },
  });
};

export const loginByMobile = (mobile, code) => {
  const grant_type = "mobile";
  return request({
    url: baseUrl + "/mobile/token/sms",
    headers: {
      "TENANT-ID": "1",
      Authorization: "Basic cGlnOnBpZw==",
      VERSION: version,
    },
    method: "post",
    params: { mobile: "SMS@" + mobile, code: code, grant_type },
  });
};

export const loginBySocial = (state, code) => {
  const grant_type = "mobile";
  return request({
    url: baseUrl + "/mobile/token/social",
    headers: {
      "TENANT-ID": "1",
      Authorization: "Basic cGlnOnBpZw==",
      VERSION: version,
    },
    method: "post",
    params: { mobile: state + "@" + code, grant_type },
  });
};
export const getUserInfo = () => {
  return request({
    url: baseUrl + '/admin/user/info',
    method: 'get'
  })
}
export const logout = (token, id) => {
  return request({
    url: baseUrl + '/auth/token/logout',
    method: "delete",
    headers: {
      VERSION: version,
      Authorization: "Bearer " + token,
    },
  });
};
