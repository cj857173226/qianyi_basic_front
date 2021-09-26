export default {
  title: "XXX平台",
  copyright: "Copyright © 2019 qycloud 快速开发框架. All rights reserved.",
  isFirstPage: true, // 配置首页不可关闭
  key: "qycloud", // 配置主键,目前用于存储
  whiteList: [
    "/login",
  ], // 配置无权限可以访问的页面
  whiteTagList: ["/login", "/404", "/401", "/lock"], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  fistPage: {
    label: "主页",
    value: "/home/index",
    params: {},
    query: {},
    group: [],
    close: false,
  },
  // 配置菜单的属性
  menu: {
    props: {
      id: "id",
      label: "label",
      path: "path",
      icon: "icon",
      children: "children",
      meta: "meta",
      redirect: "redirect",
    },
  },
};

export const SystemSettings = {

  IS_CUSTOM_MENU: true, // 是否启用自定义菜单

  IS_INTERCEPT: false, //是否做登录拦截

  IS_NAV_TAGS: true, // 是否开启路由标签

  IS_NAV_SPLIT: true, // 导航布局是否使用分割

  MENU_TOP_LOGO: './img/menu-top.png', // 菜单顶部小LOGO

  MENU_TOP_TEXT_LOGO: './img/menu-top-text.png', // 菜单顶部带文字的长LOGO
}