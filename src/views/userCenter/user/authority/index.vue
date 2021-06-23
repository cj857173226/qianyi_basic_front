<template>
  <div class="page-outer">
    <div class="page-inner">
      <!-- 列表搜索条件 -->
      <div>
        <div class="page-search-line">
          <div class="search-item">
            <div class="s-label">关键字</div>
            <el-input
              placeholder="关键字搜索"
              v-model="formData.goodsName"
              clearable
              @keyup.enter.native="getData"
              @clear="getData"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search search-icon"
              ></i>
            </el-input>
          </div>
          <div class="search-item">
            <div class="s-label">有效时间</div>
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始日期"
              default-time="00:00:00"
              :editable="false"
              clearable
            >
            </el-date-picker>
            <div class="split-line"></div>
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束日期"
              default-time="00:00:00"
              :editable="false"
              clearable
              @change="getData"
            >
            </el-date-picker>
          </div>
          <div class="buttons-wrap">
            <el-button size="large" type="primary" @click="search($event)"
              >查询</el-button
            >
            <el-button size="large" @click="clean($event)">重置</el-button>
          </div>
        </div>
      </div>
      <!-- 工具栏 按钮之类 -->
      <div class="page-tools-line">
        <el-button size="large" @click="addHandle">
          <img class="icon-img" :src="addIcon" alt="" />新增
        </el-button>
        <el-button size="large" @click="couponExpires">
          <img class="icon-img" :src="exportIcon" alt="" />导出
        </el-button>
      </div>
      <div class="list-wrap">
        <el-row>
          <el-table
            class="speacilTable"
            v-loading="listLoading"
            :data="tableData"
            stripe
            :height="defaultTableHeight"
            @selection-change="selectHandle"
            style="width: 100%"
            :header-cell-class-name="cellClass"
          >
            <el-table-column type="selection" width="36"></el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="70"
              align="center"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="id"
              label="角色名称"
              min-width="120"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="areaName"
              label="创建人"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="goodsName"
              label="创建时间"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="productName"
              label="更新时间"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="goodsRange"
              label="创建时间"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="状态"
              min-width="100"
              prop="switch"
            >
              <template slot-scope="scope">
                <el-switch v-model="scope.row.switch"> </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              label="备注"
              min-width="180"
            >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="settingPermissions(scope.row)"
                  >设置权限
                </el-button>
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="editHandle(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="delRows(scope.row)"
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
      <el-dialog
        :title="type == 'add' ? '新增用户' : '修改用户'"
        :visible.sync="addVisibleDialog"
        width="800px"
        class="addVisibleDialogClass"
      >
        <el-form
          :inline="true"
          ref="adduserData"
          :model="adduserData"
          :rules="adduserDataRules"
          label-width="20%"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="用户名" prop="name" class="Item">
                <el-input
                  clearable
                  placeholder="请输入用户名"
                  v-model="adduserData.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="姓名" prop="description" class="Item">
                <el-input
                  clearable
                  placeholder="请输入姓名"
                  v-model="adduserData.description"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="密码" prop="issuedTo" class="Item">
                <el-input
                  clearable
                  placeholder="请输入密码"
                  v-model="adduserData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="再次输入密码" prop="useGoods" class="Item">
                <el-input
                  clearable
                  placeholder="请再次输入密码"
                  v-model="adduserData.useGoods"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="所属公司" class="Item">
                <el-input
                  clearable
                  placeholder="请输入所属公司"
                  v-model="adduserData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="手机号" class="Item">
                <el-input
                  clearable
                  placeholder="手机号"
                  v-model="adduserData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="邮箱" class="Item">
                <el-input
                  clearable
                  placeholder="请输入邮箱"
                  v-model="adduserData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="备注" class="Item">
                <el-input
                  clearable
                  placeholder="请输入备注"
                  v-model="adduserData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="所属公司" class="Item">
                <el-input
                  clearable
                  placeholder="请输入所属公司"
                  v-model="adduserData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="角色" class="Item">
                <el-checkbox-group v-model="boxchecked">
                  <el-checkbox
                    v-for="(item, index) in characterList"
                    :label="item.value"
                    :key="item.value"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="当前状态" class="Item">
                <!-- <el-radio-group v-model="adduserData.type">
                  <el-radio label="1">启用</el-radio>
                  <el-radio label="2">禁用</el-radio>
                </el-radio-group> -->
                <el-switch v-model="adduserData.type"> </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisibleDialog = false">取 消</el-button>
          <el-button type="primary" @click="sumbitAdduserData($event)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :title="Type == 'add' ? '新增角色' : '编辑角色'"
        :visible.sync="dialogVisible"
        width="40%"
        class="addVisibleDialogClass"
      >
        <el-form
          :inline="true"
          ref="addcharacterData"
          :model="characterData"
          :rules="addcharacterDataRules"
          label-width="20%"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="用户名" prop="issuedTo" class="Item">
                <el-input
                  clearable
                  placeholder="请输入密码"
                  v-model="characterData.issuedTo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="角色描述" prop="useGoods" class="Item">
                <el-input
                  clearable
                  placeholder="请输入角色描述"
                  v-model="characterData.useGoods"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-menu
                mode="horizontal"
                :default-active="activeIndex"
                @select="changePage"
              >
                <el-menu-item index="1">功能权限</el-menu-item>
                <el-menu-item index="2">数据权限管理</el-menu-item>
              </el-menu>
              <el-collapse
                v-model="activeNames"
                @change="handleChange"
                v-if="pageIndex == 1"
              >
                <el-collapse-item name="1">
                  <template slot="title">
                    <el-checkbox v-model="checked">一级选项A</el-checkbox>
                  </template>
                  <el-row>
                    <el-col :span="4">
                      <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange"
                      >
                        交易中心
                      </el-checkbox>
                    </el-col>
                    <el-col :span="20">
                      <el-checkbox-group
                        v-model="checkedCities"
                        @change="handleCheckedCitiesChange"
                      >
                        <el-checkbox
                          v-for="city in cities"
                          :label="city"
                          :key="city"
                          >{{ city }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange"
                      >
                        交易中心2
                      </el-checkbox>
                    </el-col>
                    <el-col :span="20">
                      <el-checkbox-group
                        v-model="checkedCities"
                        @change="handleCheckedCitiesChange"
                      >
                        <el-checkbox
                          v-for="city in cities"
                          :label="city"
                          :key="city"
                          >{{ city }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="2">
                  <div>
                    控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
                  </div>
                  <div>
                    页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
                  </div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency" name="3">
                  <div>简化流程：设计简洁直观的操作流程；</div>
                  <div>
                    清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
                  </div>
                  <div>
                    帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                  </div>
                </el-collapse-item>
                <el-collapse-item title="可控 Controllability" name="4">
                  <div>
                    用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
                  </div>
                  <div>
                    结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                  </div>
                </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNames" @change="handleChange" v-else>
                <el-collapse-item title="一致性 Consistency" name="1">
                  <div>
                    与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
                  </div>
                  <div>
                    在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
                  </div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="2">
                  <div>
                    控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
                  </div>
                  <div>
                    页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
                  </div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency" name="3">
                  <div>简化流程：设计简洁直观的操作流程；</div>
                  <div>
                    清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
                  </div>
                  <div>
                    帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            @click="sureAddHandle"
            v-loading="btnLoading"
            v-if="Type == 'edit'"
            >确认修改</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
import addIcon from "@/../public/img/add-icon.png";
import exportIcon from "@/../public/img/export-icon.png";
const FormData = {
  startTime: "",
  endTime: "",
  productId: "",
  goodsName: "",
  current: 1,
  size: 10,
};
const cityOptions = [
  "上海",
  "北京",
  "广州",
  "深圳",
  "深圳",
  "深圳",
  "深圳",
  "深圳",
];
export default {
  name: "",
  data() {
    return {
      listLoading: false,
      addIcon: addIcon,
      exportIcon: exportIcon,
      defaultTableHeight: 440,
      delHeight: 360,
      formData: JSON.parse(JSON.stringify(FormData)),
      tableData: [],
      pageParam: {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      options: [],
      dialogVisible: false,
      maturityDay: "",
      btnLoading: false,
      addVisibleDialog: false,
      linkedData: [
        {
          id: "2022222122111",
          description: " 水表地址XXXXXXXXX",
        },
        {
          id: "20222221221122111",
          description: "  水表地址XXXXXXXXX1111",
        },
      ],
      //新增优惠券表单数据
      adduserData: {
        name: "",
        description: "",
        denomination: "",
        totalIssuance: "",
        numberOfReceipts: "",
        Community: [],
        issuedTo: "",
        type: true,
        useGoods: "",
        id: "",
      },
      disabledTime: false,
      disabledDay: false,
      type: "",
      characterData: {
        issuedTo: "",
        useGoods: "",
      },
      Type: "",
      addcharacterDataRules: {
        issuedTo: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
      boxchecked: [],
      characterList: [
        {
          label: "运营",
          value: "111",
        },
        {
          label: "运营2",
          value: "1111",
        },
        {
          label: "运营3",
          value: "1112",
        },
        {
          label: "运营4",
          value: "1113",
        },
        {
          label: "运营5",
          value: "1114",
        },
        {
          label: "运营6",
          value: "1115",
        },
      ],
      userInfoData: [],
      cellClass(row) {
        if (row.columnIndex === 0) {
          return "disabledCheck";
        }
      },
      activeNames: [],
      activeIndex: "1",
      pageIndex: "1",
      Type: "",
      checked: false,
      checkAll: false,
      checkedCities: ["上海", "北京"],
      cities: cityOptions,
      isIndeterminate: false,
    };
  },
  created() {
    this.formData.status = this.$route.query.status
      ? this.$route.query.status
      : "";
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
          url: "/tcms/authority/page",
          method: "get",
          data: this.formData,
        });
        if (res.code === 0) {
          this.listLoading = false;
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
    search(el) {
      this.formData.current = 1;
      this.getData(el);
    },
    editHandle(data) {
      this.dialogVisible = true;
      this.characterData = this.$deepClone(data);
      this.Type = "edit";
    },
    // 删除商品
    delRows(row) {
      const id = row.id;
      this.$confirm(`确定要删除"${row.id}"角色吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$httpRequest({
              url: `/gcms/gcGoodsInfo/remove?id=${id}`,
              method: "delete",
            });
            if (res.code === 0) {
              this.$message.success("删除成功");
              this.getData();
            }
          } catch (err) {}
        })
        .catch((err) => {});
    },
    clean(el) {
      this.timeRange = "";
      this.formData = JSON.parse(JSON.stringify(FormData));
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
    async sureAddHandle() {
      try {
        this.$refs["addpasswordData"].validate(async (valid) => {
          if (valid) {
            const res = await this.$httpRequest({
              url: "/tcms/addCouponData/save",
              method: "post",
              data: this.passwordData,
            });
            if (res.code === 0) {
              this.$message.success("操作成功");
              this.getData();
            }
          }
        });
      } catch (err) {
        this.btnLoading = false;
      }
    },
    couponExpires() {
      // this.dialogVisible = true
    },
    addHandle() {
      this.dialogVisible = true;
      this.Type = "add";
    },
    async sumbitAdduserData() {
      try {
        this.$refs["adduserData"].validate(async (valid) => {
          if (valid) {
            if (this.type === "add") {
              this.adduserData.id == "";
            }
            const methodType = this.Type === "add" ? "post" : "put";
            const methodUrl =
              this.Type === "add"
                ? "/tcms/addCouponData/save"
                : "/tcms/addCouponData/save";
            const res = await this.$httpRequest({
              url: methodUrl,
              method: "post",
              data: this.adduserData,
            });
            if (res.code === 0) {
              this.$message.success("操作成功");
              this.getData();
            }
          }
        });
      } catch (error) {}
    },
    selectHandle() {},
    resetPassword(data) {
      this.dialogVisible = true;
      this.Type = "edit";
    },
    seeDetails(data) {
      this.dialogVisible = true;
      this.Type = "details";
      this.userInfoData = data;
    },
    changePage(key) {
      this.pageIndex = key;
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.addVisibleDialogClass /deep/ .el-form-item {
  width: 100%;
  display: flex;
  align-items: center;
  .el-form-item__content {
    width: 60%;
    .el-select,
    .el-input {
      width: 100%;
    }
  }
  .el-form-item__label {
    width: 30%;
    text-align: left;
  }
}
.addVisibleDialogClass {
  .linkedClass {
    display: flex;
    flex-flow: row;
    align-items: center;
    > div {
      margin-right: 20px;
    }
  }
  .userInfo {
    display: flex;
    flex-flow: row;
    align-items: center;
    .user-avatar {
      margin-left: 65px;
      margin-right: 10px;
      background: #d0f9ff;
      color: #00c2ff;
      font-size: 24px;
      height: 36px;
      width: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
/deep/ .el-table .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}

/deep/ .el-table .disabledCheck .cell::before {
  content: "";
  text-align: center;
  line-height: 37px;
}
</style>