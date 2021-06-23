<template>
  <div class="aree-tree" :style="{ height: height }">
    <div class="title">{{ title }}</div>
    <div class="tree-wrap" v-loading="loading">
      <el-scrollbar style="height: 100%">
        <el-collapse accordion>
          <el-collapse-item
            v-for="item in treeData"
            :key="item.area"
            :title="item.area"
            :name="item.area"
          >
            <div
              class="area-item"
              :class="{ 'area-acive': areaActive === area.id }"
              v-for="area in item.subs"
              @click="areaSelect(area)"
              :key="area.id"
            >
              {{ area.subFullName }}

              <div class="area-handle">
                <i
                  class="el-icon-edit-outline edit"
                  v-if="isEdit"
                  @click="dialogOpen('edit', area)"
                ></i>
                <i
                  class="el-icon-delete delete"
                  v-if="isDel"
                  @click="delRows(null, area)"
                ></i>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <div class="tree-buttons" v-if="isAdd">
      <el-button type="text" @click="dialogOpen('add', null, $event)"
        >新增小区</el-button
      >
      <!-- <el-button type="text">管理</el-button> -->
    </div>

    <!-- 新增小区弹框 -->
    <el-dialog
      class="addDialog"
      :title="dialogType === 'add' ? '新增小区' : '编辑小区'"
      :visible.sync="addDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed('addForm')"
      width="560px"
    >
      <el-form
        label-position="left"
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-width="80px"
        size="small"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="省" prop="provinceId">
              <el-select
                v-model="addForm.provinceId"
                @change="provinceChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in provinceOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="市" prop="cityId">
              <el-select
                v-model="addForm.cityId"
                @change="cityChange"
                placeholder="请选择"
                :disabled="addForm.provinceId === ''"
              >
                <el-option
                  v-for="item in cityOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="区" prop="countryId">
              <el-select
                v-model="addForm.countryId"
                @change="areaChange"
                placeholder="请选择"
                :disabled="addForm.cityId === ''"
              >
                <el-option
                  v-for="item in areaOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="街道" prop="street">
              <el-select v-model="addForm.street" placeholder="请选择">
                <el-option
                  v-for="item in testOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="小区名称" prop="subFullName">
              <el-input
                v-model="addForm.subFullName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="subAddress">
              <el-input
                v-model="addForm.subAddress"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addDialog = false">取 消</el-button>
        <el-button size="mini" @click="areaSubmit($event)" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { AddForm, AddRules } from "./datas";
export default {
  name: "",
  props: {
    isAdd: {
      //是否可新增
      type: Boolean,
      default: false,
    },
    isEdit: {
      //是否可修改
      type: Boolean,
      default: false,
    },
    isDel: {
      //是否可删除
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      addDialog: false,
      dialogType: "add",
      height: "100px",
      areaActive: "",
      addForm: JSON.parse(JSON.stringify(AddForm)),
      addRules: AddRules,
      testOptions: [
        {
          name: "测试选项1",
          id: "1",
        },
        {
          name: "测试选项2",
          id: "2",
        },
      ],
      treeData: [],
      title: "小区列表",
      provinceOption: [],
      cityOption: [],
      areaOption: [],
    };
  },
  created() {
    this.height = document.body.clientHeight - 100 + "px";
  },
  mounted() {
    window.onresize = () => {
      this.height = document.body.clientHeight - 100 + "px";
    };
    this.getAreaData();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", function () {
      this.height = document.body.clientHeight - 100 + "px";
    });
  },
  methods: {
    // 获取小区数据
    async getAreaData() {
      try {
        this.loading = true;
        const res = await this.$httpRequest({
          url: "/admin/sub/tree",
          method: "get",
        });
        this.loading = false;
        if (res.code === 0) {
          let data = res.data;
          this.treeData = data;
        }
      } catch (err) {
        this.loading = false;
      }
    },
    // 获取行政区划树
    async getAddressTree(el, type = "province", pid = 0) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/region/tree",
          method: "get",
          data: {
            pid,
          },
          eTarget: el,
        });
        if (res.code === 0) {
          let data = res.data;
          switch (type) {
            case "city":
              this.cityOption = data;
              break;
            case "area":
              this.areaOption = data;
              break;
            default:
              this.provinceOption = data;
              break;
          }
        }
      } catch (err) {}
    },
    // 获取小区详情
    async getDetail(id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/sub/detail",
          method: "get",
          data: {
            id,
          },
        });
        if (res.code === 0) {
          let data = res.data;
          this.getAddressTree(null, "city", data.provinceId);
          this.getAddressTree(null, "area", data.cityId);
          this.addForm = data;
        }
      } catch (err) {}
    },

    dialogOpen(type, row, el) {
      this.dialogType = type;
      this.getAddressTree(el);
      this.addDialog = true;
      if (type == "edit") {
        this.getDetail(row.id);
      }
    },
    areaSelect(area) {
      if (area.id === this.areaActive) {
        this.areaActive = "";
        this.$emit("change", "");
      } else {
        this.areaActive = area.id;
        this.$emit("change", area);
      }
    },
    clearHighlight() {
      this.areaActive = "";
    },
    // 新增/修改小区
    areaSubmit(el) {
      let url = "";
      let method = "";
      let message = "";
      if (this.dialogType === "add") {
        url = "/admin/sub/save";
        method = "post";
        message = "新增成功";
      } else if (this.dialogType === "edit") {
        url = "/admin/sub/update";
        method = "put";
        message = "修改成功";
      }
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$httpRequest({
              url: url,
              method: method,
              data: this.addForm,
              eTarget: el,
            });
            if (res.code === 0) {
              this.$message.success(message);
              this.getAreaData();
              this.addDialog = false;
            }
          } catch (err) {}
        }
      });
    },
    dialogClosed() {
      this.$refs["addForm"].resetFields();
      this.addForm = JSON.parse(JSON.stringify(AddForm));
    },
    // 删除
    delRows(el, row) {
      const { id, subFullName } = row;
      this.$confirm(`是否要删除 ${subFullName}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$httpRequest({
              url: `/admin/sub/remove?id=${id}`,
              method: "delete",
              eTarget: el,
            });
            if (res.code === 0) {
              this.$message.success("删除成功");
              this.getAreaData();
            }
          } catch (err) {}
        })
        .catch((err) => {});
    },
    // 省选择
    provinceChange(val) {
      let zxs = [110000, 120000, 310000, 500000]; //直辖市id，手动过滤
      let isZxs = zxs.indexOf(val) >= 0; // 是否为直辖市

      if (isZxs) {
        this.cityOption = this.provinceOption.filter((it) => it.id === val);
      } else {
        this.getAddressTree(null, "city", val);
      }
      this.addForm.provinceName = this.provinceOption.filter((it) => {
        return it.id === val;
      })[0].name;
      this.addForm.cityId = "";
      this.addForm.cityName = "";
      this.addForm.countryId = "";
      this.addForm.countryName = "";
    },
    // 市选择
    cityChange(val) {
      this.getAddressTree(null, "area", val);
      this.addForm.cityName = this.cityOption.filter((it) => {
        return it.id === val;
      })[0].name;
      this.addForm.countryId = "";
      this.addForm.countryName = "";
    },
    // 区选择
    areaChange(val) {
      this.addForm.countryName = this.areaOption.filter((it) => {
        return it.id === val;
      })[0].name;
    },
  },
};
</script>

<style lang="scss" scoped>
.aree-tree {
  margin-right: 20px;
  min-width: 190px;
  background: #fff;
  border-radius: 8px;
  padding: 20px 0;
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
    height: calc(100% - 60px);
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
  .tree-buttons {
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
}
.el-collapse {
  border: 0;
  /deep/.el-collapse-item__header {
    border-bottom: 0;
    padding-left: 16px;
    font-weight: bold;
    .el-collapse-item__arrow {
      font-weight: 800;
      color: #333;
    }
  }
  /deep/.el-collapse-item__wrap {
    border-bottom: 0;
    background: #f9f9f9;
    .el-collapse-item__content {
      padding: 14px 10px 14px 28px;
    }
  }
}

.el-form {
  .el-select {
    width: 100%;
  }
}
</style>