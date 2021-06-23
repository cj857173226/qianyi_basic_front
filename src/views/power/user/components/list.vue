<template>
  <div class="list-wrap">
    <div class="mulu" ref="mulu">
      <el-input
        clearable
        placeholder="输入部门名称进行过滤"
        v-model="searchInput"
        style="margin-top: 10px"
      ></el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpanded"
        :filter-node-method="filterNode"
        ref="tree"
        @current-change="treeChange"
      ></el-tree>
    </div>
    <div class="right mulu-main">
      <div class="search-wrap">
        <el-row :gutter="24">
          <el-col :xs="12" :sm="16" :md="16" :lg="18" :xl="18">
            <el-row :gutter="30" class="search-cloumn">
              <el-col
                class="flex-row userss"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="12"
                :xl="12"
              >
                <span class="search-label">用户名：</span>
                <el-input
                  @keyup.enter.native="enterLoad"
                  clearable
                  class="search-input"
                  size="large"
                  v-model="params.username"
                  placeholder="请输入用户名"
                ></el-input>
              </el-col>
            </el-row>
          </el-col>

          <div
            class="quer-btn"
            style="width: 207px; display: flex; justify-content: center"
          >
            <div>
              <el-button type="primary" @click="queryData($event)"
                >查询</el-button
              >
              <el-button @click="reset($event)">重置</el-button>
            </div>
          </div>
        </el-row>
      </div>
      <div class="table">
        <el-button
          style="margin-bottom: 20px"
          size="medium"
          type="primary"
          @click="addHandle($event)"
          :loading="addLoad"
          icon="el-icon-plus"
          >新增</el-button
        >

        <el-table
          v-loading="listLoading"
          height="520px"
          :data="tableData"
          stripe
          style="width: 100%"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="55"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="publicValue" label="角色" width="330px">
            <template slot-scope="scope">
              <div>
                <span
                  class="role-name"
                  :key="item.roleId"
                  v-for="item of scope.row.roleList"
                  >{{ item.roleName }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="lockFlag" label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.lockFlag === "0" ? "有效" : "锁定" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="200"
            align="center"
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  size="large"
                  type="text"
                  v-if="scope.row.type === 'CORPORATE_USER'"
                  @click="operatorHandle($event, scope.row)"
                  >经办人管理</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  @click="editHandle($event, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  class="danger"
                  @click="delHandle($event, scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    <el-dialog
      class="dict-dia"
      :title="type === 'add' ? '新增' : '编辑'"
      :visible.sync="addVisible"
      width="820px"
      @closed="closed"
    >
      <el-form
        :rules="rules"
        :inline="true"
        ref="add"
        :model="addData"
        label-width="110px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="addData.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            type="password"
            v-model="addData.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="lockFlag">
          <el-radio v-model="addData.lockFlag" label="0" border>有效</el-radio>
          <el-radio v-model="addData.lockFlag" label="9" border>锁定</el-radio>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-select
            style="height: auto"
            v-model="addData.role"
            multiple
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in userType"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'手机号:'" prop="phone">
          <el-input
            v-model="addData.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属部门:" prop="deptId">
          <el-select
            clearable
            v-model="addData.deptId"
            :disabled="deptDis"
            placeholder="请选择所属部门"
            ref="deptSelect"
          >
            <div style="padding: 10px" class="custom-tree-node searchInputs">
              <el-input
                clearable
                placeholder="输入关键字进行搜索"
                v-model="searchInputs"
              >
              </el-input>
            </div>
            <el-option value="" class="createCatalogItem" ref="selectTree">
              <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="trees"
                @current-change="treeChanges"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="type === 'edit'"
          label="创建时间:"
          prop="createTime"
        >
          <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            disabled
            type="date"
            v-model="addData.createTime"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button :loading="load" type="primary" @click="sureAddHandle($event)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <operatorContainer
      :opertaorId="opertaorId"
      :opertaorVisible.sync="opertaorVisible"
    />
  </div>
</template>

<script>
import { IdentityCodeValid, isMobile } from "@/util/validate.js";
export default {
  data() {
    let validateUsername = async (rule, value, callback) => {
      if (value.length < 2 || value.length > 20) {
        callback(new Error("用户名长度在 2 到 20 个字符"));
      }
    };
    let validatePassword = async (rule, value, callback) => {
      if (this.type === "add" && (value.length < 6 || value.length > 18)) {
        callback(new Error("密码长度在 6 到 18 个字符"));
      }
    };
    let validatePhone = async (rule, value, callback) => {
      if (value.length !== 11 && value.length >= 1) {
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
    let validateCardid = async (rule, value, callback) => {
      let reg = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
      if (!reg.test(value) && value.length >= 1) {
        callback(new Error("身份证号格式错误"));
      } else {
        callback();
      }
    };
    let validateTong = async (rule, value, callback) => {
      let reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
      let regs =
        this.addData.type === "PERSON_USER"
          ? /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
          : reg;
      if (!regs.test(value) && value.length >= 1) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    return {
      opertaorId: "",
      opertaorVisible: false,
      listLoading: false,
      deptDis: false,
      load: false,
      searchInput: "",
      searchInputs: "",
      addVisible: false,
      addLoad: false,
      type: "",
      dept: "",
      addData: {
        createTime: "",
        deptId: "", //所属部门
        lockFlag: 0, //状态 0:有效，9:锁定
        password: "",
        phone: "",
        userId: "",
        role: [], //角色
        username: "",
      },
      treeData: [],
      tableData: [],
      userType: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validateUsername, trigger: "blur" },
        ],
        // userLoginLabelId:[
        //   { required: true, message: "请选择标签类型", trigger: "blur" },
        // ],
        lockFlag: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        password: [
          {
            required: this.type === "add",
            message: "请输入密码",
            trigger: "blur",
          },
          { validator: validatePassword, trigger: "blur" },
        ],
        phone: [
          // { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change",
          },
        ],
        deptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change",
          },
        ],
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      pageParam: {
        //页码配置
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      defaultExpanded: [],
      roleTypeList: [],
      params: {
        current: 1,
        size: 10,
        type: "",
        username: "",
      },
    };
  },
  watch: {
    "addData.deptId"(val) {
      if (this.addData.deptId === "") {
        this.userType = this.roleTypeList;
      }
    },
    searchInput(val) {
      this.$refs.tree.filter(val);
    },
    searchInputs(val) {
      this.$refs.trees.filter(val);
    },
  },
  mounted() {
    this.loadData();
    this.getTreeList();
  },
  computed: {
    phoneTf() {
      //判断是否需要上传手机号
      const reg = /\*+/g;
      return !reg.test(this.addData.phone);
    },
  },
  methods: {
    async getTreeList() {
      try {
        this.run = this.$loading({
          target: this.$refs.mulu,
        });
        this.defaultExpanded.splice(0);
        const res = await this.$httpRequest({
          url: "/admin/dept/tree",
          method: "get",
        });
        if (res.code === 0) {
          res.data.forEach((item) => {
            this.defaultExpanded.push(item.id);
          });
          this.treeData = res.data;
        }
        this.run.close();
      } catch (err) {
        this.run.close();
      }
    },
    async loadData(el = "") {
      try {
        this.listLoading = true;
        const res = await this.$httpRequest({
          url: "/admin/user/page",
          method: "get",
          data: this.params,
          eTarget: el,
        });
        if (res.code === 0) {
          this.tableData = res.data.records;
          this.pageParam.total = res.data.total;
        }
        this.listLoading = false;
      } catch (err) {
        this.listLoading = false;
      }
    },
    async getUserType(el = "", id = "") {
      //角色列表
      try {
        const res = await this.$httpRequest({
          url: "/admin/role/list",
          method: "get",
          eTarget: el,
        });
        if (res.code === 0) {
          res.data.forEach((item) => {
            item.id = item.roleId;
            item.label = item.roleName;
          });
          this.roleTypeList = res.data;
          this.userType = res.data;
        }
      } catch (err) {}
    },
    async getDetail(el, id) {
      try {
        const res = await this.$httpRequest({
          url: "/admin/user/" + id,
          method: "get",
          eTarget: el,
        });
        if (res.code === 0) {
          for (let key in res.data) {
            if (key !== "roleList" && res.data[key] == null) {
              res.data[key] = "";
            }
          }
          let {
            avatar,
            createTime,
            delFlag,
            deptName,
            lockFlag,
            qqOpenid,
            role = [],
            salt,
            tenantId,
            updateTime,
            phone,
            userId,
            username,
            wxOpenid,
            deptId,
            roleList,
            type,
            realname,
            flatType,
            cardId,
            legalName = "",
            legalCodeid = "",
            operatorName = "",
            operatorCardid = "",
            operatorPhone = "",
            userLoginLabelId = "",
          } = res.data;
          role = roleList.map((item) => {
            return item.roleId;
          });
          deptId && this.deptTreeHandle(this.treeData, "id", "name", deptId);
          deptId = this.dept;
          // if (type === "CORPORATE_USER") {
          //   type = "2";
          // }
          this.addData = {
            deptId,
            avatar,
            createTime,
            delFlag,
            deptName,
            lockFlag,
            qqOpenid,
            role,
            salt,
            tenantId,
            updateTime,
            userLoginLabelId,
            phone,
            password: "",
            userId,
            username,
            wxOpenid,
            type,
            realname,
            flatType,
            cardId,
            legalName,
            legalCodeid,
            operatorName,
            operatorCardid,
            operatorPhone,
          };
          this.dept = "";
          this.addVisible = true;
        }
      } catch (err) {}
    },
    operatorHandle(el, data) {
      this.opertaorId = data.userId;
      this.opertaorVisible = true;
    },
    enterLoad(val) {
      this.queryData();
    },
    reset(el) {
      this.pageParam.pageSize = 10;
      this.pageParam.currentPage = 1;
      this.params.size = 10;
      this.params.current = 1;
      this.params.type = "";
      this.params.username = "";
      this.params.deptId = "";
      this.getTreeList();
      this.loadData(el);
    },
    queryData(el = "") {
      this.params.current = 1;
      this.pageParam.currentPage = 1;
      this.loadData(el);
    },
    closed() {
      this.searchInputs = "";
      this.$refs["add"].resetFields();
    },
    sureAddHandle(el) {
      this.$refs["add"].validate(async (valid) => {
        if (valid) {
          this.load = true;
          this.deptTreeHandle(this.treeData, "name", "id", this.addData.deptId);
          try {
            let {
              createTime,
              deptId, //所属部门
              lockFlag, //状态 0:有效，9:锁定
              password,
              phone,
              userId,
              role, //角色
              username,
            } = this.addData;
            const url = this.type === "add" ? "/save" : "/update";
            const methodType = this.type === "add" ? "post" : "put";
            let data =
              this.type === "add"
                ? {
                    createTime,
                    deptId,
                    lockFlag,
                    password,
                    phone,
                    userId,
                    role,
                    username,
                  }
                : {
                    createTime,
                    deptId,
                    lockFlag,
                    password,
                    phone,
                    userId,
                    role,
                    username,
                  };
            role.forEach((item, index) => {
              data["role[" + index + "]"] = item;
            });
            // data = this.$encryption({
            //   data,
            //   key: "pigxpigxpigxpigx",
            //   param: ["password"],
            // });
            const res = await this.$httpRequest({
              url: "/admin/user" + (this.type === "add" ? "/add" : ""),
              method: methodType,
              data: {
                ...data,
                deptId: this.dept,
              },
              isForm: false,
            });
            if (res.code === 0) {
              const tips = this.type === "add" ? "新增成功!" : "修改成功!";
              this.$message.success(tips);
              this.addVisible = false;
              this.loadData();
            }
            this.load = false;
            this.dept = "";
          } catch (err) {
            this.load = false;
          }
        }
      });
    },
    addHandle(el) {
      this.type = "add";
      this.getUserType(el);
      this.addData = {
        createTime: "",
        deptId: this.addData.deptId ? this.addData.deptId : "", //所属部门
        lockFlag: "", //状态 0:有效，9:锁定
        password: "",
        phone: "",
        type: "CORPORATE_USER",
        realname: "",
        flatType: "",
        cardId: "",
        legalName: "",
        legalCodeid: "",
        operatorName: "",
        operatorCardid: "",
        operatorPhone: "",
        userId: "",
        role: [], //角色
        username: "",
        userLoginLabelId: "",
      };
      this.addVisible = true;
    },
    editHandle(el, data) {
      this.type = "edit";
      this.getUserType("", data.userId);
      this.getDetail(el, data.userId);
    },
    delHandle(el, data) {
      this.$confirm("是否删除用户名为 ”" + data.username + "“ 的数据项?")
        .then(async (_) => {
          const res = await this.$httpRequest({
            url: "/admin/user/" + data.userId,
            method: "delete",
            eTarget: el,
          });
          if (res.code === 0) {
            this.loadData();
            this.$message.success("删除成功!");
          }
        })
        .catch((_) => {});
    },
    deptTreeHandle(data, code, rcode, value) {
      if (data.length) {
        let rvalue = "";
        data.forEach((item, index) => {
          if (item[code] === value) {
            rvalue = item[rcode];
          } else {
            item.children.length &&
              this.deptTreeHandle(item.children, code, rcode, value);
          }
        });
        if (rvalue) {
          this.dept = rvalue;
        }
      }
    },
    treeChange(val, node) {
      this.addData.deptId = val.name; //新增默认部门
      this.params.deptId = val.id;
      this.queryData();
    },
    deptChange(val, val2) {
      if (val.length === 0 && this.addData.deptId === "") {
        this.deptDis = false;
        this.userType = this.roleTypeList;
      } else if (val.length) {
        const data = this.roleTypeList.find((item) => {
          return item.roleId === val[0];
        });
        if (data && data.isOrganization === "N") {
          this.deptDis = true;
        } else {
          this.deptDis = false;
        }
        if (data && data.isOrganization) {
          this.userType = this.roleTypeList.filter((item) => {
            //const tf = data.isOrganization;

            return item.isOrganization === "";
          });
        }
      }
    },
    treeChanges(val, node) {
      //if (!val.children.length) {
      // this.userType = this.roleTypeList.filter((item) => {
      //   return item.isOrganization !== "N";
      // });
      this.addData.deptId = val.name;
      //}
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    curPageChange(val) {
      this.pageParam.currentPage = val;
      this.params.current = val;
      this.loadData();
    },
    sizeChange(val) {
      this.params.size = val;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
// .searchInputs {
//   position: absolute;
//   left: 0;
//   width: 100%;
//   padding: 0 10px;
//   box-sizing: border-box;
//   top: 0;
// }
//@media screen and (max-width: 1140px) {
.quer-btn {
  margin-left: 160px;
}
//}
.list-wrap {
  display: flex;
  overflow: hidden;
  .user {
    width: 496px;
  }
  .mulu {
    border: 1px solid #e4e4e4;
    margin-right: 24px;
    //float: left;
    width: 250px;
    padding: 10px;
  }
  .right {
    width: calc(100% - 280px);
    //float: right;
    .role-name {
      display: inline-block;
      font-size: 14px;
      padding: 2px 3px;
      border-radius: 3px;
      border: 1px solid #a6b5f8;
      margin: 5px 0;
      margin-right: 10px;
      color: #2b55fb;
      background: #c2cdf8;
    }
  }
}
.dict-dia {
  .el-select {
    width: 202px !important;
    height: 40px;
  }
}
.right {
  .userss {
    width: 441px !important;
  }
}

.supervise {
  .el-dialog__body {
    overflow: auto;
  }
  .el-select {
    width: 202px !important;
    height: 40px;
  }
}
</style>
