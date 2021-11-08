/*
 * @Descripttion:
 * @version:
 * @Author: 小六
 * @Date: 2020-09-24 16:37:41
 * @LastEditors: 小六
 * @LastEditTime: 2020-10-20 15:11:00
 */
/**
 * 全站权限配置
 *
 */

import router from "./router/router";
import store from "@/store";
import { validatenull } from "@/util/validate";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import webSite ,{ SystemSettings }from "../src/const/website";
const IS_INTERCEPT = SystemSettings.IS_INTERCEPT;
NProgress.configure({ showSpinner: false });
if(IS_INTERCEPT){
  router.beforeEach((to, from, next) => {
    // 缓冲设置
    if (
      to.meta.keepAlive === true &&
      store.state.tags.tagList.some((ele) => {
        return ele.value === to.fullPath;
      })
    ) {
      to.meta.$keepAlive = true;
    } else {
      NProgress.start();
      if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
        to.meta.$keepAlive = true;
      } else {
        to.meta.$keepAlive = false;
      }
    }
    const meta = to.meta || {};
  
    const value = to.query.src || to.fullPath;
    const label = to.query.name || to.name;
    if (
      meta.isTab !== false &&
      !validatenull(value) &&
      !validatenull(label)
    ) {
      store.commit("ADD_TAG", {
        label: label,
        value: value,
        params: to.params,
        query: to.query,
        group: router.$avueRouter.group || [],
      });
    }
    if (!store.getters.access_token) {
      NProgress.done();
      if (webSite.whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next("/login");
      }
    } else {
      if (to.path == "/login") {
        next("/");
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        if (
          meta.isTab !== false &&
          !validatenull(value) &&
          !validatenull(label)
        ) {
          store.commit("ADD_TAG", {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            group: router.$avueRouter.group || [],
          });
        }
        next();
      }
    }
  });
  
}

router.afterEach((to, from) => {
  const value = to.query.src || to.fullPath;
  const label = to.query.name || to.name;
  const meta = to.meta || {};
  if (
    meta.isTab !== false &&
    !validatenull(value) &&
    !validatenull(label)
  ) {
    store.commit("ADD_TAG", {
      label: label,
      value: value,
      params: to.params,
      query: to.query,
      group: router.$avueRouter.group || [],
    });
  }
  NProgress.done();
  // const title = store.getters.tag.label
  router.$avueRouter.setTitle(to.name);
});
