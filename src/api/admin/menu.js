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
const is_Dev = process.env.NODE_ENV == "development" ? true : false;
let baseUrl = is_Dev ? window.globalConfig.DEV_BASE_API : window.globalConfig.PRO_BASE_API;
let version = window.globalConfig.VERSION;

export function getMenu(token) {
  return request({
    url: baseUrl + "/admin/menu",
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

export function getTopMenu() {
  return request({
    url: baseUrl + "/admin/menu",
    params: { type: "top" },
    method: "get",
    headers: {
      VERSION: version,
    },
  });
}

export function fetchMenuTree(lazy, parentId) {
  return request({
    url: baseUrl + "/admin/menu/tree",
    method: "get",
    params: { lazy: lazy, parentId: parentId },
    headers: {
      VERSION: version,
    },
  });
}

export function addObj(obj) {
  return request({
    url: baseUrl + "/admin/menu",
    method: "post",
    data: obj,
    headers: {
      VERSION: version,
    },
  });
}

export function getObj(id) {
  return request({
    url: baseUrl + "/admin/menu/" + id,
    method: "get",
    headers: {
      VERSION: version,
    },
  });
}

export function delObj(id) {
  return request({
    url: baseUrl + "/admin/menu/" + id,
    method: "delete",
    headers: {
      VERSION: versions,
    },
  });
}

export function putObj(obj) {
  return request({
    url: baseUrl + "/admin/menu",
    method: "put",
    data: obj,
    headers: {
      VERSION: versions,
    },
  });
}
