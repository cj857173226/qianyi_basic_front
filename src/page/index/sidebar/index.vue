<template >
  <div class="avue-sidebar">
    <!-- <logo/> -->
    <el-scrollbar style="height: 100%">
      <el-menu
        :default-active="nowTagValue"
        :collapse="isCollapse"
        unique-opened
        mode="vertical"
        class="siderbar-menu"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          :props="website.menu.props"
          :collapse="isCollapse"
          first
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
export default {
  name: "Sidebar",
  inject: ["Index"],
  components: { sidebarItem, logo },
  created() {
    this.Index.openMenu(this.menuId);
  },
  computed: {
    ...mapGetters([
      "website",
      "menu",
      "tag",
      "isCollapse",
      "keyCollapse",
      "screen",
    ]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
};
</script>



