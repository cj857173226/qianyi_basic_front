<template>
  <div class="main">
    <div class="search-wrap">
      <el-row :gutter="24">
        <el-col :xs="12" :sm="16" :md="16" :lg="18" :xl="18">
          <el-row :gutter="30" class="search-cloumn">
            <el-col
              class="flex-row user"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <span class="search-label">角色名：</span>
              <el-input
                @keyup.enter.native="enterLoad"
                clearable
                class="search-input"
                size="large"
                v-model="params.roleName"
                placeholder="请输入角色名"
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
    <div class="table dict-dia">
      <div class="list-wrap">
        <el-button
          style="margin-bottom: 20px"
          size="medium"
          type="primary"
          v-if="permissions.sys_role_add"
          @click="addHandle($event)"
          >+ 新 增</el-button
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
            prop="roleName"
            label="角色名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="roleCode"
            label="角色标识"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="dsType" label="数据权限" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.dsType | dsTypeFilter(that) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
          ></el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  size="small"
                  type="text"
                  @click="lookHandle($event, scope.row)"
                  >查看</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  v-if="permissions.sys_role_edit"
                  @click="editHandle($event, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  class="danger"
                  v-if="permissions.sys_role_del"
                  @click="delHandle($event, scope.row)"
                  >删除</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  v-if="permissions.sys_role_perm"
                  @click="adminHandle($event, scope.row)"
                  >权限</el-button
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
      <el-dialog
        @closed="closed('path')"
        title="分配权限"
        width="800px"
        :visible.sync="adminVisible"
      >
        <div class="admin-tree">
          <el-input
            style="margin-bottom: 10px"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
          </el-input>
          <el-tree
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            :props="formProps"
            :check-strictly="menuType"
            default-expand-all
            :default-checked-keys="menuCheck"
            check-on-click-node
            ref="adminTree"
            :filter-node-method="filterAdminTree"
            @check="menuTreeChange"
            :render-content="renderContent"
          ></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adminVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAdminHandle($event)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog title="查看" width="800px" :visible.sync="lookVisible">
        <div class="dia-main">
          <p>
            <span>角色名称：</span>
            <span>{{ detailData.roleName }}</span>
          </p>
          <p>
            <span>角色标识：</span>
            <span>{{ detailData.roleCode }}</span>
          </p>
          <p>
            <span>角色描述：</span>
            <span>{{ detailData.roleDesc }}</span>
          </p>
          <p>
            <span>数据权限：</span>
            <span>{{ detailData.dsType | dsTypeFilter(that) }}</span>
          </p>
          <p>
            <span>创建时间：</span>
            <span>{{ detailData.createTime }}</span>
          </p>
        </div>
      </el-dialog>
      <el-dialog
        class="dict-dia"
        :title="type === 'add' ? '新增' : '编辑'"
        :visible.sync="addVisible"
        width="800px"
        @closed="closed"
      >
        <el-form
          :rules="rules"
          :inline="true"
          ref="add"
          :model="addData"
          label-width="90px"
        >
          <el-form-item label="角色名称:" prop="roleName">
            <el-input
              v-model="addData.roleName"
              placeholder="角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色标识:" prop="roleCode">
            <el-input
              :disabled="type === 'edit'"
              v-model="addData.roleCode"
              placeholder="角色标识"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述:" prop="roleDesc">
            <el-input
              style="width: 505px"
              type="textarea"
              :rows="2"
              placeholder="请输入角色描述"
              v-model="addData.roleDesc"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据权限:" prop="dsType">
            <el-select v-model="addData.dsType" placeholder="请选择数据权限">
              <el-option
                v-for="item in dsList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addData.dsType === 1">
            <el-tree
              :data="formTreeData"
              show-checkbox
              node-key="id"
              check-strictly
              :props="formProps"
              :default-expand-all="type === 'edit'"
              :default-expanded-keys="formExpanded"
              :default-checked-keys="formChecked"
              @check="formTreeChange"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAddHandle($event)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  filters: {
    dsTypeFilter(val, that) {
      if (that.dsListDscs.length && val !== "") {
        return (
          that.dsListDscs.find((item) => {
            return item.id === val;
          }).label || ""
        );
      } else {
        return "";
      }
    },
  },
  data() {
    let validateRoleName = async (rule, value, callback) => {
      if (value.length < 3 || value.length > 20) {
        callback(new Error("长度在 3 到 20 个字符"));
      }
    }; //R_A_R
    let validateRoleCode = async (rule, value, callback) => {
      let KeyChar = /^[A-Z]+([_]{0,1}[A-Z])*$/;
      if (value.length < 3 || value.length > 50) {
        callback(new Error("长度在 3 到 50 个字符"));
      } else if (!KeyChar.test(value)) {
        callback(new Error("请输入大写英文字母，下划线"));
      }
    };
    return {
      filterText: "",
      that: this,
      listLoading: false,
      addVisible: false,
      lookVisible: false,
      adminVisible: false,
      menuType: true,
      formExpanded: [],
      formChecked: [],
      menuCheck: [],
      formProps: {
        children: "children",
        label: "name",
      },
      detailData: { dsType: "" },
      tableData: [],
      formTreeData: [],
      formTreeId: [],
      menuTreeData: [],
      menuChonseData: [],
      dsListDscs: [
        { id: 0, label: "全部" },
        { id: 1, label: "自定义" },
        { id: 2, label: "本级及子级" },
        { id: 3, label: "本级" },
      ], //权限类型 0:全部,1:自定义,2:本级及子级,3:本级
      dsList: [],
      type: "",
      roleId: "",
      addData: {
        createTime: "",
        dsScope: "", //自定义权限id，逗号分隔
        dsType: "", //权限类型
        roleCode: "",
        roleDesc: "",
        roleName: "",
      },
      userTypeList: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { validator: validateRoleName, trigger: "blur" },
        ],
        roleCode: [
          { required: true, message: "请输入角色标识", trigger: "blur" },
          { validator: validateRoleCode, trigger: "blur" },
        ],
        dsType: [{ required: true, message: "请选择权限", trigger: "blur" }],
        roleType: [
          { required: true, message: "请选择用户类型", trigger: "blur" },
        ],
        // roleType: [
        //   { required: true, message: "请选择机构类型", trigger: "blur" },
        // ],
      },
      pageParam: {
        //页码配置
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      params: {
        //分页查询参数
        current: 1,
        size: 10,
        // roleName: "",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.adminTree.filter(val);
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.loadData();
    this.getAdminTree();
    this.getDsList();
  },
  methods: {
    async loadData(el = "") {
      try {
        this.listLoading = true;
        const res = await this.$httpRequest({
          url: "/admin/role/page",
          method: "get",
          data: this.params,
          eTarget: el,
        });
        if (res.code === 0) {
          let data = res.data;
          this.tableData = data.records;
          this.pageParam.currentPage = data.current;
          this.pageParam.pageSize = data.size;
          this.pageParam.total = data.total;
        }
        this.listLoading = false;
      } catch (err) {
        this.listLoading = false;
      }
    },
    async getDsList() {
      try {
        this.listLoading = true;
        const res = await this.$httpRequest({
          url: "/admin/role/dsTypeList",
          method: "get",
        });
        if (res.code === 0) {
          this.dsList = res.data.map((it) => {
            return {
              id: it.value,
              label: it.name,
            };
          });
        }
      } catch (err) {}
    },

    async getAdminTree() {
      //查询权限树
      try {
        const res = await this.$httpRequest({
          url: "/admin/menu/pTree",
          method: "get",
        });
        if (res.code === 0) {
          this.formTreeData = res.data;
        }
      } catch (err) {}
    },
    async getMenuTree(el = "", data = {}) {
      //查询路由树
      try {
        const res = await this.$httpRequest({
          url: "/admin/menu/pTree",
          method: "get",
        });
        if (res.code === 0) {
          this.menuTreeData = res.data;
          this.adminVisible = true;
          this.roleId = data.roleId;
          setTimeout(() => {
            this.menuType = false;
          }, 100);
        } else {
          this.$message.error("权限查询失败");
        }
      } catch (err) {}
    },
    async getUserAdmin(el = "", data = {}) {
      //查询用户路由
      try {
        const res = await this.$httpRequest({
          url: "/admin/menu/tree/" + data.roleId,
          method: "get",
          eTarget: el,
        });

        if (res.code === 0) {
          this.menuCheck = res.data;
          this.menuChonseData = res.data;
          this.getMenuTree(el, data);
        }
      } catch (err) {}
    },
    async sureAdminHandle(el) {
      //路由分配
      try {
        const res = await this.$httpRequest({
          url: "/admin/role/menu",
          method: "put",
          data: {
            roleId: this.roleId,
            menuIds: this.menuChonseData.join(","),
          },
          eTarget: el,
        });
        if (res.code === 0) {
          this.$message.success("分配完成");
          this.adminVisible = false;
        } else {
          this.$message.error("分配失败");
        }
      } catch (err) {}
    },
    addHandle(el) {
      this.addData = {
        createTime: "",
        dsScope: "",
        dsType: "",
        roleCode: "",
        roleDesc: "",
        roleName: "",
        roleType: "",
        // peopleType: "",
      };
      this.type = "add";
      this.addVisible = true;
    },
    sureAddHandle(el) {
      //新增，编辑提交
      this.$refs["add"].validate(async (valid) => {
        if (valid) {
          let {
            createTime,
            dsScope, //自定义权限id，逗号分隔
            dsType, //权限类型
            roleCode,
            roleDesc,
            roleName,
            delFlag,
            roleId,
            updateTime,
            roleType,
            // peopleType,
          } = this.addData;
          const methodType = this.type === "add" ? "post" : "put";
          const data =
            this.type === "add"
              ? {
                  createTime,
                  dsScope,
                  dsType,
                  roleCode,
                  roleDesc,
                  roleName,
                  roleType,
                  // peopleType,
                }
              : {
                  createTime,
                  dsScope,
                  dsType,
                  roleCode,
                  roleDesc,
                  roleName,
                  delFlag,
                  roleId,
                  roleType,
                  // peopleType,
                  updateTime,
                };
          const res = await this.$httpRequest({
            url: "/admin/role",
            method: methodType,
            data,
            eTarget: el,
          });
          if (res.code === 0) {
            const tips = this.type === "add" ? "新增成功！" : "修改成功！";
            this.$message.success(tips);
            this.addVisible = false;
            this.loadData();
          }
        }
      });
    },
    adminHandle(el, data) {
      this.menuType = true;
      this.getUserAdmin(el, data);
    },
    lookHandle(el, data) {
      this.detailData = this.$deepClone(data);
      this.lookVisible = true;
    },
    editHandle(el, data) {
      this.addData = this.$deepClone(data);
      let dsScope =
        this.addData.dsScope !== null &&
        typeof this.addData.dsScope === "string"
          ? this.addData.dsScope.split(",").map((item) => {
              return Number(item);
            })
          : [];
      this.formTreeId = dsScope || [];
      this.formChecked = dsScope || [];
      this.type = "edit";
      this.addVisible = true;
    },
    delHandle(el, data) {
      this.$confirm("是否确认删除名称为 “" + data.roleName + "” 的角色?")
        .then(async (_) => {
          const res = await this.$httpRequest({
            url: "/admin/role/" + data.roleId,
            method: "delete",
            eTarget: el,
          });
          if (res.code === 0) {
            this.loadData();
            this.$message.success("删除成功！");
          }
        })
        .catch((_) => {});
    },
    menuTreeChange(val, data) {
      this.menuChonseData = data.checkedKeys.concat(data.halfCheckedKeys);
    },
    filterAdminTree(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    formTreeChange(val) {
      //表单树
      let index = this.formTreeId.findIndex((item) => {
        return item === val.id;
      });
      if (index >= 0) {
        this.formTreeId.splice(index, 1);
      } else {
        this.formTreeId.push(val.id);
      }
      this.addData.dsScope = this.formTreeId.join(",");
    },
    closed(type = "") {
      this.filterText = "";
      this.roleId = "";
      this.menuCheck.splice(0);
      this.menuChonseData.splice(0);
      this.formExpanded.splice(0);
      this.formChecked.splice(0);
      this.formTreeId.splice(0);
      if (type !== "path") {
        this.$refs["add"].resetFields();
      }
    },
    renderContent(h, { node, data, store }) {
      //权限树自定义HTML
      return (
        <span
          style="width:100%;display:flex;justify-content: space-between;"
          class="custom-tree-node"
        >
          <span>{node.label}</span>
          <span>{data.remark}</span>
        </span>
      );
    },
    enterLoad() {
      this.loadData();
    },
    reset(el) {
      this.pageParam.pageSize = 10;
      this.pageParam.currentPage = 1;
      this.params.size = 10;
      this.params.current = 1;
      this.params.roleName = "";
      this.loadData(el);
    },
    queryData(el) {
      this.params.current = 1;
      this.pageParam.currentPage = 1;
      this.loadData(el);
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

<style lang="scss">
.dict-dia {
  .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
  .el-select {
    width: 202px !important;
    height: 40px;
  }
}
</style>

<style lang="scss" scoped>
.dia-main {
  p {
    display: flex;
    align-items: baseline;
    span:first-child {
      color: #333333;
      display: inline-block;
      width: 70px;
      text-align: right;
    }
    span:last-child {
      //margin-top: 2px;
      color: #999999;
      display: inline-block;
      width: 250px;
    }
  }
}
</style>
