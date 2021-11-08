<template>
  <div class="aree-tree" :style="{ height: height }">
    <div class="title">行政区划</div>
    <el-input
      size="mini"
      style="margin-bottom: 20px"
      placeholder="输入关键字进行过滤"
      v-model="filterText"
    >
    </el-input>
    <div class="tree-wrap">
      <el-scrollbar style="height: 100%">
        <el-tree
          ref="regionTree"
          :filter-node-method="filterNode"
          :props="props"
          node-key="id"
          :load="getAddressTree"
          @node-click="nodeClick"
          lazy
        >
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script type="text/javascript">
const FormData = {
  provinceId: "",
  provinceName: "",
  cityId: "",
  cityName: "",
  countryId: "",
  countryName: "",
};
export default {
  name: "",
  props: {},
  data() {
    return {
      height: "100px",
      filterText: "",
      props: {
        label: "name",
        children: "children",
      },
      treeData: [],
      provinceOption: [],
      cityOption: [],
      areaOption: [],
      formData: JSON.parse(JSON.stringify(FormData)),
    };
  },
  watch: {
    filterText(val) {
      this.$refs.regionTree.filter(val);
    },
  },
  created() {
    this.height = document.body.clientHeight - 130 + "px";
  },
  mounted() {
    window.onresize = () => {
      this.height = document.body.clientHeight - 130 + "px";
    };
    // this.getAddressTree();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", function () {
      this.height = document.body.clientHeight - 130 + "px";
    });
  },
  methods: {
    // 获取行政区划树
    async getAddressTree(node, resolve) {
      let pid = 0;
      if (node.level === 0) {
        pid = 0;
      } else {
        pid = node.data.id;
      }
      try {
        const res = await this.$httpRequest({
          url: "/admin/region/tree",
          method: "get",
          data: {
            pid,
          },
        });
        if (res.code === 0) {
          resolve(res.data);
        }
      } catch (err) {}
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    nodeClick(data, node) {
      this.formData = JSON.parse(JSON.stringify(FormData));
      this.getAreaLevelData(node);
      let _data = Object.assign(data, { areaIds: this.formData });
      this.$emit("node-click", _data);
    },
    getAreaLevelData(node) {
      if (node.level === 3) {
        this.formData.countryId = node.data.id;
        this.formData.countryName = node.data.name;
      } else if (node.level === 2) {
        this.formData.cityId = node.data.id;
        this.formData.cityName = node.data.name;
      } else if (node.level === 1) {
        this.formData.provinceId = node.data.id;
        this.formData.provinceName = node.data.name;
      }
      if (node.level !== 1) {
        this.getAreaLevelData(node.parent);
      }
    },
    clearHighlight() {
      this.$refs.regionTree.setCurrentKey(null);
      this.formData = JSON.parse(JSON.stringify(FormData));
    },
  },
};
</script>

<style lang="scss" scoped>
.aree-tree {
  margin-right: 20px;
  min-width: 240px;
  padding: 20px 10px;
  background: #fff;
  border-radius: 8px;
  .title {
    font-size: 16px;
    font-weight: bold;
    padding: 0 16px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &:before {
      content: "";
      display: block;
      width: 3px;
      height: 16px;
      background: #00c2ff;
      border-radius: 2px;
      margin-right: 6px;
    }
  }
  .tree-wrap {
    height: calc(100% - 100px);
    .area-item {
      position: relative;
      font-size: 14px;
      color: #999;
      margin-bottom: 14px;
      font-weight: 800;
      height: 24px;
      line-height: 24px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      &:last-of-type {
        margin-bottom: 0;
      }
      &.area-acive {
        cursor: default;
        color: #00c2ff;
      }
      .area-handle {
        transition: 0.13s ease-in;
        transform: scale(0);
        position: absolute;
        background: rgba(249, 249, 249, 0.6);
        right: 0;
        top: 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 24px;
        > i {
          cursor: pointer;
          font-weight: 800;
          + i {
            margin-left: 2px;
          }
        }
        .edit {
          color: #00c2ff;
        }
        .delete {
          color: #ff6060;
        }
      }
      &:hover {
        .area-handle {
          transform: scale(1);
        }
      }
    }
  }
}
.el-form {
  .el-select {
    width: 100%;
  }
}
</style>