import Layout from "@/page/index/";

export default [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "page" */ "@/page/entrance"),
    redirect: "/home",
    meta: {
      isTab: false,
    },
    children: [
      {
        path: "login",
        name: "登录",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/page/login/index"),
        meta: {
          isTab: false,
        },
      }, //

    ],
  },
  {
    path: "/home",
    component: Layout,
    redirect: "/home/index",
    children: [
      {
        path: "index",
        name: "主页",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/page/home/index_static"),
        props: true,
      },
    ],
  },
  {
    path: "/personal",
    name: "个人中心",
    component: Layout,
    redirect: "/personal/info",
    children: [
      {
        path: "info",
        name: "个人中心",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/page/personal/index"),
        props: true,
      },
    ],
    
  }, //
  {
    path: "/403",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/components/error-page/403"),
    name: "403",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false,
    },
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/components/error-page/404"),
    name: "404",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false,
    },
  },
  {
    path: "/500",
    component: () =>
      import(/* webpackChunkName: "page" */ "@/components/error-page/500"),
    name: "500",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false,
    },
  },
  {
    path: "/myiframe",
    component: Layout,
    redirect: "/myiframe",
    children: [
      {
        path: ":routerPath",
        name: "iframe",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/components/iframe/main"),
        props: true,
      },
    ],
  },
  {
    path: "*",
    redirect: "/404",
  },
];
