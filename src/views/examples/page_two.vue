<template>
  <div class="page-outer">
    <div class="column-page-wrap">
      <DivisionTree ref="regionTree" @node-click="nodeClick" />
      <div class="column-list-wrap">
        <!-- 列表搜索条件 -->
        <div class="page-search-line">
          <el-form
            size="small"
            :inline="true"
            class="search-item"
            label-width="80px"
          >
            <el-form-item label="关键字:">
              <el-input
                placeholder="请输入"
                v-model="formData.username"
                clearable
                @keyup.enter.native="getData"
                @clear="getData"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="buttons-wrap">
            <el-button size="small" type="primary" @click="search($event)"
              >查询</el-button
            >
            <el-button size="small" @click="clean($event)">重置</el-button>
          </div>
        </div>

        <div class="list-wrap">
          <el-row>
            <el-table
              class="speacilTable"
              v-loading="listLoading"
              :data="tableData"
              :height="defaultTableHeight"
              border
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="70"
                align="center"
              >
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="subFullName"
                label="小区名称"
              >
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="所属市"
                prop="cityName"
              >
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="所属区"
                prop="countryName"
              ></el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="所属公司"
                prop="countryName"
                min-width="200"
              >
                <template slot-scope="scope">
                  {{ scope.row.deptList.join(",") }}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                  <el-button
                    class="tag-btn"
                    type="text"
                    size="small"
                    @click="getCompany(scope.row, $event)"
                    v-if="permissions._usSubdistrict_setting"
                    >设置公司
                  </el-button>
                  <el-button
                    class="tag-btn"
                    type="text"
                    size="small"
                    @click="dialogOpen('edit', scope.row)"
                    >编辑
                  </el-button>
                  <el-button
                    class="tag-btn"
                    type="text"
                    size="small"
                    @click="delRows($event, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <div class="pagination">
            <o-pagination
              :total="pageParam.total"
              :page-size="pageParam.pageSize"
              :current-page="pageParam.currentPage"
              @size-change="sizeChange"
              @current-change="curPageChange"
            ></o-pagination>
          </div>
        </div>
      </div>
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
          <el-col :span="24" v-if="cityOption.length > 0">
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
          <el-col :span="24" v-if="areaOption.length > 0">
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
    <!-- 设置公司弹框 -->
    <el-dialog
      class="companyDialog"
      title="设置公司"
      :visible.sync="companyDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed('companyFrom')"
      width="560px"
    >
      <el-form
        label-position="left"
        ref="companyFrom"
        :model="companyFrom"
        label-width="80px"
        size="small"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择公司" prop="provinceId">
              <el-select
                v-model="companyFrom.deptIds"
                placeholder="请选择"
                multiple
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="companyDialog = false">取 消</el-button>
        <el-button size="mini" @click="setCompany($event)" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import addIcon from "@/../public/img/add-icon.png";
import exportIcon from "@/../public/img/export-icon.png";
import { dateFormat } from "@/filters/index";
import { AddForm, AddRules } from "./datas";
import { mapGetters } from "vuex";
import DivisionTree from "@/components/division-tree";
const FormData = {
  subFullName: "",
  current: 1,
  size: 10,
  level: "",
  areaId: "",
};
export default {
  components: { DivisionTree },
  name: "",
  data() {
    return {
      listLoading: false,
      addDialog: false,
      companyDialog: false,
      dialogType: "add",
      addIcon: addIcon,
      exportIcon: exportIcon,
      startTime: "",
      endTime: "",
      defaultTableHeight: 440,
      delHeight: 338,
      formData: JSON.parse(JSON.stringify(FormData)),
      addForm: JSON.parse(JSON.stringify(AddForm)),
      addRules: AddRules,
      tableData: [],
      multipleSelection: [],
      pageParam: {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      companyFrom: {
        subId: "",
        deptIds: [],
      },
      startTimeOptions: {},
      endTimeOptions: {},
      provinceOption: [],
      cityOption: [],
      areaOption: [],
      companyList: [],
      areaIds: {
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        countryId: "",
        countryName: "",
      },
    };
  },
  watch: {
    "formData.startTime": {
      handler: function (val) {
        if (val) {
          this.endTimeOptions = {
            disabledDate(time) {
              return time.getTime() < new Date(val);
            },
          };
        } else {
          this.endTimeOptions = {
            disabledDate(time) {
              return null;
            },
          };
        }
      },
    },
    "formData.endTime": {
      handler: function (val) {
        if (val) {
          this.startTimeOptions = {
            disabledDate(time) {
              return time.getTime() > new Date(val);
            },
          };
        } else {
          this.startTimeOptions = {
            disabledDate(time) {
              return null;
            },
          };
        }
      },
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (document.body.clientHeight > this.defaultTableHeight) {
      this.defaultTableHeight = document.body.clientHeight - this.delHeight;
    }
  },
  mounted() {
    window.onresize = () => {
      if (document.body.clientHeight > this.defaultTableHeight) {
        this.defaultTableHeight = document.body.clientHeight - this.delHeight;
      }
    };
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", function () {
      if (document.body.clientHeight > this.defaultTableHeight) {
        this.defaultTableHeight = document.body.clientHeight - this.delHeight;
      }
    });
  },
  methods: {
    async getData() {
      this.listLoading = true;
      try {
        const res = await this.$httpRequest({
          url: "/admin/sub/page",
          method: "get",
          data: this.formData,
          isForm: true,
        });
        this.listLoading = false;
        if (res.code === 0) {
          let data = res.data;
          this.tableData = data.records;
          this.pageParam.currentPage = data.current;
          this.pageParam.pageSize = data.size;
          this.pageParam.total = data.total;
        }
      } catch (err) {
        this.listLoading = false;
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
    // 获取公司列表
    async getCompany(row, el) {
      this.companyFrom.deptIds = row.deptId.split(",").map((it) => Number(it));
      this.companyFrom.subId = row.subId;
      try {
        const res = await this.$httpRequest({
          url: "/admin/dept/list",
          method: "get",
          eTarget: el,
        });
        if (res.code === 0) {
          let data = res.data;
          this.companyList = data.map((it) => {
            return {
              id: it.deptId,
              name: it.name,
            };
          });
          this.companyDialog = true;
        }
      } catch (err) {}
    },
    // 设置公司
    async setCompany(el) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/sub/setting",
          method: "post",
          data: this.companyFrom,
          eTarget: el,
        });
        if (res.code === 0) {
          this.companyDialog = false;
          this.getData();
        }
      } catch (err) {}
    },
    search(el) {
      this.formData.current = 1;
      this.getData(el);
    },
    // 选择小区
    areaChange(val) {
      let id = val ? val.id : "";
      this.formData.subId = id;
      this.addForm.subId = id;
      this.getData();
    },
    dialogOpen(type, row, el) {
      this.dialogType = type;
      this.getAddressTree(el);
      if (type == "add") {
        if (this.areaIds.provinceId) {
          this.getAddressTree(null, "city", this.areaIds.provinceId);
        }
        if (this.areaIds.cityId) {
          this.getAddressTree(null, "area", this.areaIds.cityId);
        }
        this.addForm = { ...this.addForm, ...this.areaIds };
      } else if (type == "edit") {
        this.getDetail(row.subId);
      }
      this.addDialog = true;
    },
    async getdetailedData(id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/scVmInstall/detail",
          method: "get",
          data: {
            id: id,
          },
        });
        if (res.code === 0) {
          this.addForm = res.data;
        }
      } catch (error) {}
    },
    // 删除
    delRows(el, row) {
      const { subId, subFullName } = row;
      this.$confirm(`是否要删除 ${subFullName}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$httpRequest({
              url: `/admin/sub/remove?id=${subId}`,
              method: "delete",
              eTarget: el,
            });
            if (res.code === 0) {
              this.$message.success("删除成功");
              this.getData();
            }
          } catch (err) {}
        })
        .catch((err) => {});
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
              this.getData();
              this.addDialog = false;
            }
          } catch (err) {}
        }
      });
    },
    nodeClick(data) {
      if (this.formData.areaId === data.id) {
        return;
      }
      this.areaIds = data.areaIds;
      this.formData.level = data.level;
      this.formData.areaId = data.id;
      this.getData();
    },
    // 省选择
    provinceChange(val) {
      let zxs = [110000, 120000, 310000, 500000]; //直辖市id，手动过滤
      let isZxs = zxs.indexOf(val) >= 0; // 是否为直辖市
      this.getAddressTree(null, "city", val);
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
    dialogClosed(formName) {
      this.$refs[formName].resetFields();
      this.provinceOption = [];
      this.cityOption = [];
      this.areaOption = [];
      this.addForm = JSON.parse(JSON.stringify(AddForm));
    },
    clean(el) {
      this.formData = JSON.parse(JSON.stringify(FormData));
      this.$refs.regionTree.clearHighlight();
      this.areaIds = {
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        countryId: "",
        countryName: "",
      };
      this.getData(el);
    },
    sizeChange(val) {
      this.formData.size = val;
      this.getData();
    },
    curPageChange(val) {
      this.formData.current = val;
      this.getData();
    },
    importRecipients() {
      this.getData();
      this.addForm.subId = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.status-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    margin-right: 6px;
  }
}
.form-row {
  .el-col {
    padding-right: 20px;
  }
}
.el-form {
  .el-select {
    width: 100%;
  }
}
.uploadImgBox {
  > div {
    margin-bottom: 10px;
  }
  .uploadImg {
    .Img {
      width: 80px;
      height: 80px;
      background-size: 100%;
      div {
        padding-top: 50px;
      }
    }
  }
  .label {
    line-height: 80px;
  }
}
.goods-status {
  display: flex;
  align-items: center;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: transparent;
}
.btn {
  border: none;
  background: rgba(0, 194, 255, 0.03);
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #00c2ff;
  padding: 0;
  height: 19px;
  margin-top: 10px;
}
</style>