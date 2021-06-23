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
              v-model="formData.username"
              clearable
              @keyup.enter.native="getData"
              @clear="getData"
            >
             
            </el-input>
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
        <el-button
          size="large"
          v-if="permissions.sys_user_add"
          @click="addHandle('add', {}, $event)"
        >
          <img class="icon-img" :src="addIcon" alt="" />新增
        </el-button>
        <el-button
          size="large"
          v-if="permissions.b_user_export"
          @click="couponExpires"
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
            border
            :height="defaultTableHeight"
            @selection-change="selectHandle"
            style="width: 100%"
          >
            <el-table-column type="selection" width="40"></el-table-column>
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
              label="用户名"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="realname"
              label="姓名"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="role"
              label="角色"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="deptName"
              label="所属公司"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建时间"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="状态"
              min-width="100"
              prop="lockFlag"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.lockFlag"
                  active-value="0"
                  inactive-value="1"
                  :disabled="!permissions.sys_user_lock"
                  @change="(val) => changeState(val, scope.row)"
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
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="addHandle('edit', scope.row, $event)"
                  v-if="permissions.sys_user_edit"
                  >编辑</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="addHandle('view', scope.row, $event)"
                  >查看详情</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  v-if="permissions.sys_user_reset_pwd"
                  @click="resetPassword(scope.row, $event)"
                  >重置密码</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  @click="delRows($event, scope.row)"
                  v-if="permissions.sys_user_del"
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
        :title="dialogTitle[type]"
        :visible.sync="addVisibleDialog"
        :close-on-click-modal="false"
        width="1000px"
        class="addVisibleDialogClass"
        @closed="dialogClosed('adduserData')"
      >
        <el-scrollbar style="height: 50vh">
          <el-form
            ref="adduserData"
            :model="adduserData"
            :rules="adduserDataRules"
            label-width="100px"
            label-position="right"
            :disabled="type === 'view'"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户名" prop="username" class="Item">
                  <el-input
                    clearable
                    placeholder="请输入6-11位的英文+数字的用户名"
                    :disabled="type === 'edit'"
                    v-model="adduserData.username"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="realname" class="Item">
                  <el-input
                    clearable
                    placeholder="请输入姓名"
                    v-model="adduserData.realname"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码" prop="newPassword" class="Item">
                  <el-input
                    clearable
                    placeholder="请输入密码"
                    type="password"
                    v-model="adduserData.newPassword"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="确认密码" prop="newpassword1" class="Item">
                  <el-input
                    clearable
                    placeholder="请再次输入密码"
                    type="password"
                    v-model="adduserData.newpassword1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone" class="Item">
                  <el-input
                    clearable
                    placeholder="手机号"
                    v-model="adduserData.phone"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email" class="Item">
                  <el-input
                    clearable
                    placeholder="请输入邮箱"
                    v-model="adduserData.email"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark" class="Item">
                  <el-input
                    clearable
                    placeholder="请输入备注"
                    v-model="adduserData.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="当前状态" prop="lockFlag" class="Item">
                  <el-switch
                    v-model="adduserData.lockFlag"
                    active-value="0"
                    inactive-value="1"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="角色" prop="role" class="Item">
                  <el-checkbox-group
                    v-model="adduserData.role"
                    style="
                      display: flex;
                      align-items: center;
                      flex-wrap: wrap;
                      width: 100%;
                    "
                  >
                    <el-checkbox
                      v-for="item in characterList"
                      :label="item.roleId"
                      :key="item.roleId"
                    >
                      {{ item.roleName }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属公司" prop="deptId" class="deptId">
                  <!-- <el-input clearable placeholder="请输入所属公司" v-model="adduserData.deptName"></el-input> -->
                  <el-select
                    size="large"
                    clearable
                    v-model="adduserData.deptId"
                    placeholder="请选择所属公司"
                    @change="companyChange"
                  >
                    <el-option
                      v-for="item in companyList"
                      :key="item.deptId"
                      :label="item.name"
                      :value="item.deptId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
                v-if="adduserData.deptId && areaTree.length > 0"
              >
                <el-form-item label="所属小区">
                  <el-collapse class="dialog-collapse">
                    <el-collapse-item
                      v-for="(item, index) in areaTree"
                      :key="index"
                      :name="item.area"
                    >
                      <template slot="title">
                        <el-checkbox
                          :indeterminate="item.isIndeterminate"
                          v-model="item.checkAll"
                          @change="(val) => areaTreeCheckAllChange(val, item)"
                        >
                          {{ item.area }}</el-checkbox
                        >
                      </template>
                      <div>
                        <el-checkbox-group
                          v-model="adduserData.subList"
                          @change="(val) => areaItemChange(val, item)"
                        >
                          <el-checkbox
                            v-for="it in item.subs"
                            :key="it.id"
                            :label="it.id"
                            >{{ it.subFullName }}</el-checkbox
                          >
                        </el-checkbox-group>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisibleDialog = false">取 消</el-button>
          <el-button type="primary" @click="sumbitAdduserData($event)"
            >确 定</el-button
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
import { isMobile, isEmail } from "@/util/validate.js";
import { mapGetters } from "vuex";
const FormData = {
  current: 1,
  size: 10,
  username: "",
};
const AdduserData = {
  username: "",
  realname: "",
  password: "",
  newpassword1: "",
  deptName: "",
  phone: "",
  remark: "",
  role: [],
  userId: "",
  lockFlag: true,
  deptId: "",
  email: "",
  newPassword: "",
  subList: [],
};
export default {
  name: "",
  data() {
    let validateUsername = async (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error("用户名只能包含数字和字母"));
      } else {
        callback();
      }
    };
    let validatePhone = async (rule, value, callback) => {
      if (value && value.length >= 1 && value.length !== 11) {
        callback(new Error("手机号长度在 11 个字符"));
      } else if (
        !isMobile(value) &&
        !/\*{4}/g.test(value) &&
        value.length >= 1
      ) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    let validateEmail = async (rule, value, callback) => {
      if (value && !isEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback();
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
      maturityDay: "",
      btnLoading: false,
      addVisibleDialog: false,
      //新增优惠券表单数据
      adduserData: JSON.parse(JSON.stringify(AdduserData)),
      adduserDataRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { validator: validateUsername, trigger: "blur" },
          { min: 5, max: 11, message: "用户名长度在5-11位", trigger: "blur" },
        ],
        newPassword: [],
        newpassword1: [],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
      },
      disabledTime: false,
      disabledDay: false,
      type: "add",
      characterList: [],
      seeDetailsData: {},
      companyList: [],
      roleArr: "",
      dialogTitle: {
        add: "新增用户",
        edit: "修改用户",
        view: "用户详情",
      },
      areaTree: [], //小区数据
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  watch: {
    type: {
      handler: function (val) {
        let validatePositivePassword = async (rule, value, callback) => {
          if (
            this.adduserData.newPassword &&
            this.adduserData.newpassword1 != this.adduserData.newPassword
          ) {
            callback(new Error("两次密码不一致"));
          } else {
            callback();
          }
        };
        this.$nextTick(() => {
          if (val === "add") {
            this.adduserDataRules.newPassword = [
              { required: true, message: "请输入密码", trigger: "blur" },
            ];
            this.adduserDataRules.newpassword1 = [
              { required: true, message: "请再次输入密码", trigger: "blur" },
              { validator: validatePositivePassword, trigger: "blur" },
            ];
          } else {
            this.adduserDataRules.newPassword = [];
            this.adduserDataRules.newpassword1 = [
              { validator: validatePositivePassword, trigger: "blur" },
            ];
          }
        });
      },
      immediate: true,
    },
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
          url: "/admin/user/page",
          method: "get",
          data: this.formData,
        });
        if (res.code === 0) {
          this.listLoading = false;
          let data = res.data;
          data.records.forEach((element) => {
            element.role = element.roleList.map((x) => x.roleName).join(",");
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
    // 获取小区数据
    async getAreaData(deptId, subList) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/sub/deptTree?deptId=" + deptId,
          method: "get",
        });
        if (res.code === 0) {
          let data = res.data;
          this.areaTree = data.map((it) => {
            return {
              isIndeterminate: false,
              checkAll: false,
              ...it,
            };
          });
          if (subList) {
            this.filterAreaChange(subList);
          }
        }
      } catch (err) {}
    },
    resetPassword(data, el) {
      this.$confirm(`是否重置${data.username}的密码?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        options: [],
      })
        .then(() => {
          this.getResetPassword(data.userId, el);
        })
        .catch((err) => {});
    },
    async getResetPassword(id, el) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/user/reset/" + id,
          method: "get",
        });
        if (res.code === 0) {
          this.$message.success('重置成功')
          this.getData();
        }
      } catch (error) {}
    },
    // 公司选择
    companyChange(val) {
      this.areaTree = [];
      this.getAreaData(val);
    },
    search(el) {
      this.formData.current = 1;
      this.getData(el);
    },
    editRow(data) {
      this.getDropDownData();
      this.getdetailedData(data.userId);
      this.addVisibleDialog = true;
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
          url: `/admin/user/export_user_b`,
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
    addHandle(type, row, el) {
      this.getDropDownData();
      if (type !== "add") {
        this.getdetailedData(row.userId);
      }
      this.type = type;
      this.addVisibleDialog = true;
    },
    async sumbitAdduserData(el) {
      if (this.type === "view") {
        this.addVisibleDialog = false;
        return;
      }
      try {
        this.$refs["adduserData"].validate(async (valid) => {
          if (valid) {
            this.companyList.map((x) => {
              if (x.deptId == this.adduserData.deptId) {
                this.adduserData.deptName = x.deptName;
              }
            });

            delete this.adduserData.newpassword1;
            delete this.adduserData.lockFlagDesc;
            const methodType = this.type === "add" ? "post" : "put";
            const methodUrl =
              this.type === "add" ? "/admin/user/add" : "/admin/user";
            const res = await this.$httpRequest({
              url: methodUrl,
              method: methodType,
              data: this.adduserData,
              eTarget: el,
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
    // 小区全选
    areaTreeCheckAllChange(val, item) {
      let arr = item.subs.map((it) => {
        return it.id;
      });
      if (val) {
        this.adduserData.subList = this.adduserData.subList.concat(arr);
      } else {
        this.adduserData.subList = this.adduserData.subList.filter((it) => {
          return arr.indexOf(it) === -1;
        });
      }
    },
    //小区单选
    areaItemChange(val, item) {
      let itemArr = item.subs.map((it) => {
        return it.id;
      });
      let checkedArr = val.filter((it) => {
        return itemArr.indexOf(it) !== -1;
      });
      item.checkAll = checkedArr.length === itemArr.length;
      item.isIndeterminate =
        checkedArr.length > 0 && checkedArr.length < itemArr.length;
    },
    // 过滤选中状态
    filterAreaChange(val) {
      this.areaTree.map((item) => {
        let itemArr = item.subs.map((it) => {
          return it.id;
        });
        let checkedArr = val.filter((it) => {
          return itemArr.indexOf(it) !== -1;
        });
        item.checkAll = checkedArr.length === itemArr.length;
        item.isIndeterminate =
          checkedArr.length > 0 && checkedArr.length < itemArr.length;
      });
    },
    async getdetailedData(id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/user/" + id,
          method: "get",
        });
        if (res.code === 0) {
          // this.adduserData = res.data;
          this.roleArr = res.data.roleList.map((x) => x.roleId).join(",");
          this.seeDetailsData = res.data;
          //
          let arr = [];
          res.data.roleList.map((x) => {
            arr.push(x.roleId);
          });
          this.adduserData = {
            role: arr,
            ...res.data,
          };
          if (this.adduserData.deptId) {
            this.getAreaData(this.adduserData.deptId, this.adduserData.subList);
          }
        }
      } catch (error) {}
    },
    async getDropDownData() {
      try {
        const res1 = await this.$httpRequest({
          url: "/admin/dept/list",
          method: "get",
        });
        const res2 = await this.$httpRequest({
          url: "/admin/role/list",
          method: "get",
        });
        if (res1.code == 0) {
          this.companyList = res1.data;
        }
        if (res2.code == 0) {
          this.characterList = res2.data;
        }
      } catch (error) {}
    },
    async changeState(val, data) {
      try {
        // this.getdetailedData(data.userId)
        this.adduserData.userId = data.userId;
        this.adduserData.lockFlag = val;

        const res = await this.$httpRequest({
          url: "/admin/user/edit_lock",
          method: "put",
          data: this.adduserData,
        });
        if (res.code == 0) {
          this.getData();
        }
      } catch (error) {}
    },
    dialogClosed(val) {
      if (this.Type == "details") {
      } else {
        this.$refs[val].resetFields();
        this.adduserData = JSON.parse(JSON.stringify(AdduserData));
        this.areaTree = [];
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
  .el-select,
  .el-input {
    width: 100%;
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