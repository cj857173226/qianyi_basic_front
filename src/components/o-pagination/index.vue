<template>
  <div class="MyPagination">
    <div class="left">
      <div class="totalPage">共：{{ total }} 条记录</div>
      <div class="curPages">第：{{ currentPage }} / {{ toalPage }} 页</div>
    </div>
    <div class="right">
      <el-pagination
        background
        :page-size="newPageSize"
        :page-sizes="pageSizes"
        :current-page="currentPage"
        @current-change="currentPageChange"
        @prev-click="prevClick"
        @next-click="nextClick"
        @size-change="sizeChange"
        layout="prev, pager, next,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyPagination",
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30];
      },
    },
  },
  data() {
    return {};
  },

  computed: {
    _pageSizes: {
      get: function () {
        let PageSizeS = [];
        this.pageSizes.forEach((item) => {
          PageSizeS.push({
            name: `${item}/page`,
            value: item,
          });
        });
        return PageSizeS;
      },
    },
    newPageSize: {
      get: function () {
        return this.pageSize;
      },
      set: function (val) {
        this.$emit("update:page-size", val);
      },
    },
    NewCurrentPage: {
      get: function () {
        return this.currentPage;
      },
      set: function (val) {
        this.$emit("update:current-page", val);
      },
    },
    toalPage: {
      get: function () {
        return Math.ceil(this.total / this.pageSize);
      },
    },
  },

  mounted() {},
  methods: {
    currentPageChange(val) {
      this.$emit("current-change", val);
    },
    sizeChange(val) {
      this.$emit("size-change", val);
    },
    prevClick(val) {
      this.$emit("prev-click", val);
    },
    nextClick(val) {
      this.$emit("next-click", val);
    },
  },
};
</script>
<style lang='scss' scoped>
.MyPagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 0 20px;
  .left {
    margin-top: 4px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666666;
    .curPages {
      margin-right: 15px;
    }
    .totalPage {
      margin-right: 20px;
    }
    .pageSzie {
      width: 140px;
    }
  }
  .right {
    margin-top: 4px;
  }
}

.el-pagination.is-background {
  /deep/.el-pager {
    > li {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.15) !important;
      height: 32px;
      min-width: 32px;
      line-height: 32px;
      border-radius: 6px;
      &:hover {
        color: #00c2ff !important;
        border: 1px solid #00c2ff !important;
      }
    }
    .active {
      background: #00c2ff !important;
      border: 1px solid #00c2ff !important;
      &:hover {
        color: #ffffff !important;
      }
    }
  }
  /deep/.btn-prev:disabled,
  /deep/.btn-next:disabled {
    color: #c0c4cc;
    background: #f4f4f5;
    border: 1px solid #c0c4cc;
  }
  /deep/.btn-next,
  /deep/.btn-prev {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border: 1px solid #e4e4e4 !important;
  }
  /deep/.el-pagination__sizes {
    height: 30px !important;
    line-height: 30px !important;
    margin-right: 0 !important;
    margin-left: 10px !important;
    /deep/.el-input__inner {
      height: 30px !important;
    }
  }
  /deep/ .el-pagination__jump {
    height: 30px !important;
    line-height: 30px !important;
    margin-left: 10px !important;
    /deep/.el-pagination__editor {
      height: 30px !important;
      /deep/.el-input__inner {
        height: 30px !important;
      }
    }
  }
}
</style>