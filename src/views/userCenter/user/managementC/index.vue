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
              v-model="formData.keywords"
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
              :picker-options="startTimeOptions"
              :editable="false"
              clearable
              @change="getData"
            >
            </el-date-picker>
            <div class="split-line"></div>
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束日期"
              default-time="00:00:00"
              :picker-options="startTimeOptions"
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
        <!-- <el-button size="large" @click="addHandle">
          <img class="icon-img" :src="addIcon" alt="" />新增
        </el-button> -->
        <el-button
          size="large"
          @click="couponExpires"
          v-if="permissions.c_user_export"
        >
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
              prop="username"
              label="账户"
              min-width="120"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="realname"
              label="昵称"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="vmCount"
              label="关联水表数"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              label="注册时间"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="goodsRange"
              label="最后访问时间"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="loginTimes"
              label="登录次数"
              min-width="80"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="状态"
              min-width="100"
              prop="lockFlagDesc"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.lockFlag"
                  active-value="0"
                  inactive-value="1"
                  :disabled="!permissions.ap_user_lock"
                  @change="(val) => changeState(val, scope.row, scope.$index)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              label="备注"
              min-width="180"
            >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <!-- <el-button class="tag-btn" type="text" size="small" @click="editRow(scope.row)">编辑</el-button> -->
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  v-if="permissions.sys_user_reset_pwd"
                  @click="resetPassword(scope.row)"
                  >重置密码</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="seeDetails(scope.row)"
                  >查看详情</el-button
                >
                <!-- <el-button class="tag-btn" type="text" size="small" @click="delRows($event, scope.row)">删除</el-button> -->
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
        @closed="dialogClosed('adduserData')"
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
              <el-form-item label="账户" prop="username" class="Item">
                <el-input
                  clearable
                  placeholder="请输入账户"
                  v-model="adduserData.username"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="昵称" prop="realname" class="Item">
                <el-input
                  clearable
                  placeholder="请输入昵称"
                  v-model="adduserData.realname"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="密码" prop="password" class="Item">
                <el-input
                  clearable
                  placeholder="请输入密码"
                  v-model="adduserData.password"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item
                label="再次输入密码"
                prop="newpassword1"
                class="Item"
              >
                <el-input
                  clearable
                  placeholder="请再次输入密码"
                  v-model="adduserData.newpassword1"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="title">
                <div class="label"></div>
                <div>关联水表号</div>
                <div></div>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="24"
              v-for="(item, index) in linkedData"
              :key="item.id"
            >
              <div class="linkedClass">
                <div>{{ index + 1 }}</div>
                <div>
                  <el-input disabled v-model="item.id"></el-input>
                </div>
                <div>{{ item.description }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="状态" prop="lockFlag" class="Item">
                <el-radio-group v-model="adduserData.lockFlag">
                  <el-radio label="0">启用</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
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
        :title="Type == 'edit' ? '修改密码' : '查看详情'"
        @closed="dialogClosed('addpasswordData')"
        :visible.sync="dialogVisible"
        width="40%"
        class="addVisibleDialogClass"
      >
        <el-form
          :inline="true"
          ref="addpasswordData"
          :model="passwordData"
          :rules="addpasswordDataRules"
          label-width="20%"
          v-if="Type == 'edit'"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="账户" prop="name" class="Item">
                <!-- <el-input clearable placeholder="请输入账户" v-model="adduserData.name"></el-input> -->
                <div>{{ passwordData.username }}</div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="昵称" prop="description" class="Item">
                <div>{{ passwordData.realname }}</div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="密码" prop="password" class="Item">
                <el-input
                  clearable
                  placeholder="请输入密码"
                  v-model="passwordData.password"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item
                label="再次输入密码"
                prop="newpassword1"
                class="Item"
              >
                <el-input
                  clearable
                  placeholder="请再次输入密码"
                  v-model="passwordData.newpassword1"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form v-else>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="userInfo">
                <div>头像</div>
                <div class="user-avatar">
                  <!-- <i class="el-icon-s-custom"></i> -->
                  <el-avatar :src="seeDetailsData.imgs"></el-avatar>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="账户" class="Item">
                <!-- <el-input clearable placeholder="请输入账户" v-model="adduserData.name"></el-input> -->
                <div>{{ seeDetailsData.username }}</div>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="昵称" class="Item">
                <!-- <el-input clearable placeholder="请输入账户" v-model="adduserData.name"></el-input> -->
                <div>{{ seeDetailsData.realname }}</div>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="状态" class="Item">
                <!-- <el-input clearable placeholder="请输入账户" v-model="adduserData.name"></el-input> -->
                <div>
                  {{ seeDetailsData.lockFlag == 0 ? "启用" : "未启用" }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="title">
                <div class="label"></div>
                <div>关联水表号</div>
                <div></div>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="24"
              v-for="(item, index) in linkedData"
              :key="item.id"
            >
              <div class="linkedClass">
                <div>{{ index + 1 }}</div>
                <div>
                  <el-input disabled v-model="item.vmId"></el-input>
                </div>
                <div>{{ item.subName }} {{ item.ownerRoomNo }}</div>
              </div>
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
      <el-dialog
        title="导出Excel"
        :visible.sync="exportDialog"
        :close-on-click-modal="false"
        width="400px"
        @closed="exportDialogClosed"
      >
        <el-radio-group v-model="exportType">
          <el-radio :label="1" border>导出当前页</el-radio>
          <el-radio :label="2" border>导出全部</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportDialog = false">取 消</el-button>
          <el-button type="primary" @click="exportExcel($event)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
import addIcon from "@/../public/img/add-icon.png";
import exportIcon from "@/../public/img/export-icon.png";
import { mapGetters } from "vuex";
const FormData = {
  keywords: "",
  startTime: "",
  endTime: "",
  current: 1,
  size: 10,
};
export default {
  name: "",
  data() {
    let validatePositivePassword = async (rule, value, callback) => {
      if (this.adduserData.useGoods != this.adduserData.issuedTo) {
        callback(new Error("请输入与第一次相同的密码"));
      }
    };
    let validatePositivePasswordD = async (rule, value, callback) => {
      if (this.passwordData.password != this.passwordData.newpassword1) {
        callback(new Error("请输入与第一次相同的密码"));
      }
    };
    return {
      exportDialog: false,
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
      exportType: 1,
      options: [],
      dialogVisible: false,
      maturityDay: "",
      btnLoading: false,
      addVisibleDialog: false,
      linkedData: [],
      //新增优惠券表单数据
      adduserData: {
        username: "",
        realname: "",
        password: "",
        newpassword1: "",
        lockFlag: "0",
        userId: "",
        userFlag: 0,
      },
      adduserDataRules: {
        username: [{ required: true, message: "请输入账户", trigger: "blur" }],
        realname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        lockFlag: [{ required: true, message: "请选择状态", trigger: "blur" }],
        newpassword1: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePositivePassword, trigger: "blur" },
        ],
      },
      disabledTime: false,
      disabledDay: false,
      type: "",
      passwordData: {
        username: "",
        realname: "",
        password: "",
        newpassword1: "",
        id: "",
      },
      Type: "",
      addpasswordDataRules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newpassword1: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePositivePasswordD, trigger: "blur" },
        ],
      },
      seeDetailsData: {
        username: "",
        realname: "",
        password: "",
        newpassword1: "",
        userId: "",
      },
      startTimeOptions: {},
      endTimeOptions: {},
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
          url: "/admin/user/pages",
          method: "get",
          data: this.formData,
        });
        if (res.code === 0) {
          this.listLoading = false;
          let data = res.data;
          data.records.forEach((element) => {
            if (element.lockFlag == 0) {
              element.lockFlagDesc = true;
            } else {
              element.lockFlagDesc = false;
            }
          });
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
    editRow(data) {
      this.getdetailedData(data.userId);
      this.addVisibleDialog = true;
      // this.adduserData = this.$deepClone(data);
      this.type = "edit";
    },
    // 删除商品
    delRows(el, row) {
      let id = row.userId;
      this.$confirm(`是否要删除该用户？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$httpRequest({
              url: `/admin/user/${id}`,
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
    clean(el) {
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
              url: "/admin/user/edit",
              method: "put",
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
      this.exportDialog = true;
    },

    // 导出
    async exportExcel(el) {
      let data = {};
      if (this.exportType === 1) {
        data = this.formData;
      } else {
        data = {
          size: 999999,
          current: 1,
        };
      }
      try {
        const res = await this.$httpRequest({
          url: `/admin/user/export_user_c`,
          method: "get",
          data,
          export: true,
          eTarget: el,
        });
        if (res) {
          this.exportDialog = false;
          let blob = new Blob([res], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
          });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = name; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }
      } catch (err) {
        this.downLoading = false;
      }
    },
    addHandle() {
      Object.keys(this.adduserData).forEach((key) => {
        if (key == "lockFlag") {
          this.adduserData[key] = "0";
        } else {
          this.adduserData[key] = null;
        }
      });
      this.addVisibleDialog = true;
      this.type = "add";
    },
    async sumbitAdduserData() {
      try {
        this.$refs["adduserData"].validate(async (valid) => {
          if (valid) {
            if (this.type === "add") {
              this.adduserData.id == "";
            }
            const methodType = this.type === "add" ? "post" : "put";
            const methodUrl =
              this.type === "add" ? "/admin/user/register" : "/admin/user/edit";
            const res = await this.$httpRequest({
              url: methodUrl,
              method: methodType,
              data: this.adduserData,
            });
            if (res.code === 0) {
              this.addVisibleDialog = false;
              this.$message.success("操作成功");
              this.getData();
            }
          }
        });
      } catch (error) {}
    },
    selectHandle() {},
    resetPassword(data) {
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [
          h(
            "span",
            { style: "font-size:16px" },
            `是否重置${data.username}的密码?`
          ),
          h(
            "span",
            { style: "color: red;font-size:14px" },
            " (重置后为：000000)"
          ),
        ]),
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        options: [],
      })
        .then(() => {
          this.getResetPassword(data.userId);
        })
        .catch(() => {});
    },
    async getLinkedData(id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/user/wm/" + id,
          method: "get",
        });
        if (res.code === 0) {
          this.linkedData = res.data;
        }
      } catch (error) {}
    },
    async getResetPassword(id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/user/reset/" + id,
          method: "get",
        });
        if (res.code === 0) {
          this.getData();
        }
      } catch (error) {}
    },
    seeDetails(data) {
      this.getLinkedData(data.userId);
      this.getdetailedData(data.userId);
      this.dialogVisible = true;
      this.Type = "details";
    },
    async getdetailedData(id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/user/" + id,
          method: "get",
        });
        if (res.code === 0) {
          // this.adduserData = this.$deepClone(res.data);
          this.adduserData.userId = res.data.userId;
          this.adduserData.username = res.data.username;
          this.adduserData.realname = res.data.realname;
          this.adduserData.lockFlag = res.data.lockFlag;
          this.passwordData.username = res.data.username;
          this.passwordData.realname = res.data.realname;
          this.passwordData.userId = res.data.userId;
          this.seeDetailsData = res.data;
          this.seeDetailsData.imgs =
            this.$baseUrl + "/" + this.seeDetailsData.avatar;
        }
      } catch (error) {}
    },
    dialogClosed(val) {
      if (this.Type == "details") {
      } else {
        this.$refs[val].resetFields();
      }
    },
    async changeState(val, data, index) {
      let lockFlag = val;
      let { userId } = data;
      try {
        this.adduserData = data;

        const res = await this.$httpRequest({
          url: `/admin/user/edit?userId=${userId}&lockFlag=${lockFlag}`,
          method: "put",
        });
        if (res.code == 0) {
          this.getData();
        } else {
          this.tableData[index].lockFlag = !lockFlag;
        }
      } catch (error) {
        this.tableData[index].lockFlag = !lockFlag;
      }
    },
    exportDialogClosed() {
      this.exportType = 1;
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
</style>