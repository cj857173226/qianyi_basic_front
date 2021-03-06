import { getStore, setStore } from "@/util/store";
import { isURL, validatenull } from "@/util/validate";
import { Message } from "element-ui";
import {
  loginByMobile,
  loginBySocial,
  loginByUsername,
  logout,
  getUserInfo,
  refreshToken,
} from "@/api/login";
import { deepClone, encryption } from "@/util/util";
import webiste, { SystemSettings } from "@/const/website";
import { resetRouter } from "@/router/router";
import { getMenu, getTopMenu } from "@/api/admin/menu";
import customRouter from "@/router/custom";
import store from "../index";
let is_custom_menu = SystemSettings.IS_CUSTOM_MENU;
function addPath(ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || "name",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children",
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild =
    ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path];
  } else {
    ele[propsDefault.children].forEach((child) => {
      addPath(child);
    });
  }
}

const user = {
  state: {
    userInfo:
      getStore({
        name: "userInfo",
      }) || {},
    permissions:
      getStore({
        name: "permissions",
      }) || [],
    roles: [],
    roleCodes: [],
    menu:
      getStore({
        name: "menu",
      }) || [],
    menuAll: [],
    expires_in:
      getStore({
        name: "expires_in",
      }) || "",
    access_token:
      getStore({
        name: "access_token",
      }) || "",
    refresh_token:
      getStore({
        name: "refresh_token",
      }) || "",
    user_seal:
      getStore({
        name: "user_seal",
      }) || "",
    center_info:
      getStore({
        name: "center_info",
      }) || "",
  },
  actions: {
    // ?????????????????????
    LoginByUsername({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        key: "pigxpigxpigxpigx",
        param: ["password"],
      });
      return new Promise((resolve, reject) => {
        loginByUsername(user.username, user.password, user.location, user.code, user.randomStr)
          .then((response) => {
            if (response.data.code !== 1) {
              const data = response.data;
              commit("SET_ACCESS_TOKEN", data.access_token);
              commit("SET_REFRESH_TOKEN", data.refresh_token);
              commit("SET_EXPIRES_IN", data.expires_in);
              commit("SET_USER_INFO", data.user_info);
              commit("SET_PERMISSIONS", data.user_info.authorities || []);
              commit("CLEAR_LOCK");
              resolve(data);
            } else {
              reject(response.data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // ?????????????????????
    LoginByPhone({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByMobile(userInfo.mobile, userInfo.code)
          .then((response) => {
            const data = response.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("SET_USER_INFO", data.user_info);
            commit("SET_PERMISSIONS", data.user_info.authorities || []);
            commit("CLEAR_LOCK");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // ??????OpenId??????
    LoginBySocial({ commit }, param) {
      return new Promise((resolve, reject) => {
        loginBySocial(param.state, param.code)
          .then((response) => {
            const data = response.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("SET_USER_INFO", data.user_info);
            commit("SET_PERMISSIONS", data.user_info.authorities || []);
            commit("CLEAR_LOCK");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // ??????token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token)
          .then((response) => {
            const data = response.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("CLEAR_LOCK");
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // ??????????????????
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data || {}
          commit('SET_USER_INFO', data.sysUser)
          commit('SET_ROLES', data.roles || [])
          commit('UPDATE_PERMISSIONS', data.permissions || [])
          resolve(data)
        }).catch(() => {
          reject()
        })
      })
    },
    // ??????
    LogOut({ commit, state }, userId) {
      return new Promise((resolve, reject) => {
        logout(state.refresh_token, userId)
          .then((response) => {
            if (response.data.code === 0) {
              resetRouter();
              commit("SET_MENU", []);
              commit("SET_PERMISSIONS", []);
              commit("SET_USER_INFO", {});
              commit("SET_ACCESS_TOKEN", "");
              commit("SET_REFRESH_TOKEN", "");
              commit("SET_EXPIRES_IN", "");
              commit('SET_ROLES', [])
              commit("DEL_ALL_TAG");
              commit("CLEAR_LOCK");
              resolve(response);
            } else {
              Message.error(response.data.msg)
            }
          })
          .catch((error) => {
            Message.error('???????????????')
            reject(error);
          });
      });
    },
    // ??????session
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        resetRouter();
        commit("SET_MENU", []);
        commit("SET_PERMISSIONS", []);
        commit("SET_USER_INFO", {});
        commit("SET_ACCESS_TOKEN", "");
        commit("SET_REFRESH_TOKEN", "");
        commit('SET_ROLES', [])
        commit("DEL_ALL_TAG");
        commit("CLEAR_LOCK");
        resolve();
      });
    },
    // ??????????????????
    GetMenu({ commit, state }, obj) {
      return new Promise((resolve) => {
        if (!is_custom_menu) {
          console.log(obj.id);
          getMenu(obj.id).then((res) => {
            if (res.status === 401) {
              Message({
                message: "????????????",
                type: "error",
              });
              store.dispatch("FedLogOut");
              router.replace("/login");
            }
            let _data = [];
            // _data = customRouter; // ???????????????
            _data = res.data.data; // ????????????
            const menu = deepClone(_data);
            menu.forEach((ele) => {
              addPath(ele);
            });
            let type = obj.type
            commit("SET_MENU", { type, menu });
            resolve(menu);
          });
        } else {
          let _data = customRouter; // ???????????????
          const menu = deepClone(_data);
          menu.forEach((ele) => {
            addPath(ele);
          });
          commit("SET_MENU", { type: true, menu });
          resolve(menu);
        }

      });
    },
    //????????????
    GetTopMenu() {
      return new Promise((resolve) => {
        getTopMenu().then((res) => {
          const data = res.data.data || [];
          resolve(data);
        });
      });
    },
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
      setStore({
        name: "access_token",
        content: state.access_token,
        type: "session",
      });
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in;
      setStore({
        name: "expires_in",
        content: state.expires_in,
        type: "session",
      });
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken;
      setStore({
        name: "refresh_token",
        content: state.refresh_token,
        type: "session",
      });
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({
        name: "userInfo",
        content: userInfo,
        type: "session",
      });
    },
    SET_MENU: (state, params = {}) => {
      let { menu, type } = params;
      if (type !== false) state.menu = menu;
      setStore({
        name: "menu",
        content: menu,
        type: "session",
      });
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll;
    },

    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {};
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i].authority] = true;
      }
      state.permissions = list;
      setStore({
        name: "permissions",
        content: list,
        type: "session",
      });
    },
    UPDATE_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }

      state.permissions = list
      setStore({
        name: 'permissions',
        content: list,
        type: 'session'
      })
    },
    SET_USER_SEAL: (state, userSeal) => {
      state.user_seal = userSeal;
      setStore({
        name: "user_seal",
        content: userSeal,
        type: "session",
      });
    },
    SET_CENTER_INFO: (state, centerInfo) => {
      state.center_info = centerInfo;
      setStore({
        name: "center_info",
        content: centerInfo,
        type: "session",
      });
    },

  },
};
export default user;
