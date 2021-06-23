<template>
  <el-breadcrumb class="o-breadcrumb" separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(item, index) in matched"
      :key="item.path"
      :to="{ path: item.path }"
      >{{ item.name }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      matched: [],
      prevMatched: [],
    };
  },
  computed: mapGetters([
    "userInfo",
    "isLock",
    "isCollapse",
    "website",
    "expires_in",
    "menu",
  ]),
  watch: {
    $route() {
      this.getbreadcrumbList();
    },
  },

  mounted() {
    this.getbreadcrumbList();
  },
  methods: {
    getbreadcrumb(menu, pmenu, result, level) {
      let _menu = menu ? menu : this.menu;
      let m_len = _menu.length;
      let cur_path = this.$route.path;
      let _result = result ? result : [];
      let _lv = level ? level : 0;
      if (m_len > 0) {
        for (let i = 0; i < m_len; i++) {
          if (_menu[i].path === cur_path) {
            if (pmenu) {
              _result[_lv - 1] = {
                name: pmenu.name,
                path: pmenu.redirect ? pmenu.redirect : pmenu.path,
              };
            }
            _result[_lv] = {
              name: _menu[i].name,
              path: _menu[i].redirect ? _menu[i].redirect : _menu[i].path,
            };
            return _result;
          } else {
            _result = this.getbreadcrumb(
              _menu[i].children,
              _menu[i],
              _result,
              _lv + 1
            );
          }
        }
      }
      return _result;
    },
    getbreadcrumbList() {
      this.matched = this.getbreadcrumb();
      if (this.matched.length === 0) {
        this.matched = [...this.prevMatched];
      }
      this.prevMatched = [...this.matched];
    },
  },
};
</script>

<style lang="scss" scoped>
.o-breadcrumb {
  position: absolute;
  top: 16px;
  left: 22px;
}
</style>