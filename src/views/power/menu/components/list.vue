<template>
  <div class="table dict-dia">
    <el-button
      style="margin-bottom: 20px"
      size="medium"
      type="primary"
      v-if="permissions.sys_menu_add"
      @click="addHandle($event)"
      >+ 新 增</el-button
    >
    <el-table
      :data="tableData"
      row-key="id"
      v-loading="listLoading"
      stripe
      height="675px"
      :tree-props="{ children: 'children', hasChildren: 'has' }"
    >
      <el-table-column
        prop="label"
        label="菜单名称"
        width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column align="center" prop="icon" label="图标" width="50">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="path"
        label="组件路径"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column align="center" width="80" prop="address" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === "0" ? "左菜单" : "按钮" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="50" prop="keepAlive" label="缓冲">
        <template slot-scope="scope">
          <span>{{ scope.row.keepAlive | keepAliveFilter(that) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="注释"></el-table-column>
      <el-table-column prop="permission" label="权限标识"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button
              size="small"
              type="text"
              v-if="permissions.sys_menu_add"
              @click="addHandle($event, scope.row)"
              >新增</el-button
            >
            <el-button
              size="small"
              type="text"
              v-if="permissions.sys_menu_edit"
              @click="editHandle($event, scope.row)"
              >编辑</el-button
            >
            <el-button
              class="danger"
              size="small"
              type="text"
              v-if="permissions.sys_menu_del"
              @click="delHandle($event, scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="type === 'add' ? '新增' : '修改'"
      :visible.sync="addVisible"
      :close-on-click-modal="false"
      width="800px"
      @closed="closed"
      class="dialog-icon"
    >
      <el-form
        :rules="rules"
        :inline="true"
        ref="add"
        :model="addData"
        label-width="90px"
      >
        <el-form-item label="菜单类型:" prop="type">
          <el-radio-group v-model="addData.type" size="small">
            <el-radio-button label="0">左菜单</el-radio-button>
            <el-radio-button label="1">按钮</el-radio-button>
            <el-radio-button label="2">顶部菜单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单:" prop="parentId">
          <el-select v-model="addData.parentId" placeholder="请选择上级菜单">
            <el-option value="item" class="createCatalogItem" ref="selectTree">
              <el-tree
                class="filter-tree"
                :data="choseTree"
                :props="{ children: 'children', label: 'name' }"
                ref="tree"
                accordion
                @node-click="treeChose"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-input
            @focus="choseIcon"
            clearable
            placeholder="请选择路由图标"
            v-model="addData.icon"
          >
            <template slot="append">
              <i :class="addData.icon"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input
            clearable
            placeholder="名称"
            v-model="addData.name"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="addData.type !== '1'" label="路由地址:" prop="path">
          <el-input
            clearable
            placeholder="路由地址"
            v-model="addData.path"
          ></el-input>
        </el-form-item>
        <el-form-item v-else label="权限标识:" prop="permission">
          <el-input
            clearable
            placeholder="权限标识"
            v-model="addData.permission"
          ></el-input>
        </el-form-item>
        <el-form-item label="注释:" prop="remark">
          <el-input
            clearable
            placeholder="路由注释"
            v-model="addData.remark"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input-number
            v-model="addData.sort"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="路由缓冲:" prop="keepAlive">
          <el-radio-group v-model="addData.keepAlive" size="small">
            <el-radio-button label="0">否</el-radio-button>
            <el-radio-button label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数:" prop="query">
          <el-col :span="24">
            <el-input
              type="textarea"
              :rows="2"
              :placeholder="textareaplaceholder"
              v-model="addData.query"
              class="menutextarea"
            >
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddHandle($event)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="图标选择" width="800px" :visible.sync="iconVisible">
      <div class="icon-box">
        <div
          @click="sureChoseIcon(item)"
          v-for="(item, index) of iconList"
          :key="index"
        >
          <i :class="item"></i>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import iconConfig from "@/const/iconList";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      textareaplaceholder: '请输入json格式 如:{"id":001,"name":"张三"}',
      that: this,
      listLoading: false,
      addVisible: false,
      iconVisible: false,
      id: "",
      type: "",
      parent: "",
      iconList: iconConfig.list,
      addData: {
        sort: "",
        remark: "",
        keepAlive: "0", //路由缓冲,0,1
        name: "",
        path: "",
        query: "",
        parentId: "", //上级id
        icon: "",
        permission: "",
        type: "0",
      },
      rules: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入路径", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        // permission:[{ required: true, message: "请输入权限标识", trigger: "blur" }]
      },
      tableData: [],
    };
  },
  mounted() {
    this.loadData();
  },
  filters: {
    keepAliveFilter(val, that) {
      if (val === "0") {
        return "否";
      } else {
        return "是";
      }
    },
  },
  watch: {
    "addData.type"(val) {
      if (val == "1") {
        this.addData.path = "";
      } else {
        this.addData.permission = "";
      }
    },
  },
  computed: {
    choseTree() {
      return [
        {
          id: -1,
          name: "根目录",
          children: this.tableData,
        },
      ];
    },
    ...mapGetters(["permissions"]),
  },
  methods: {
    async loadData(el = "") {
      try {
        this.listLoading = true;
        const res = await this.$httpRequest({
          url: "/admin/menu/tree?lazy=false",
          method: "get",
        });
        if (res.code === 0) {
          this.tableData = res.data;
        }
        this.listLoading = false;
      } catch (err) {
        this.listLoading = false;
      }
    },
    sureAddHandle(el) {
      this.$refs["add"].validate(async (valid) => {
        if (valid) {
          this.parentTreeHandle(
            this.choseTree,
            "name",
            "id",
            this.addData.parentId
          );
          const {
            sort,
            keepAlive,
            name,
            remark,
            path,
            query,
            icon,
            type,
            createTime,
            delFlag,
            id,
            permission,
            updateTime,
          } = this.addData;
          const methodType = this.type === "add" ? "post" : "put";
          const data =
            this.type === "add"
              ? {
                  sort,
                  keepAlive,
                  name,
                  remark,
                  permission,
                  path,
                  query,
                  icon,
                  type,
                }
              : {
                  sort,
                  remark,
                  keepAlive,
                  name,
                  path,
                  query,
                  icon,
                  type,
                  createTime,
                  delFlag,
                  menuId: id,
                  permission,
                  updateTime,
                };
          const res = await this.$httpRequest({
            url: "/admin/menu",
            method: methodType,
            eTarget: el,
            data: {
              ...data,
              parentId: this.id,
            },
            isThrow: false,
          });
          if (res.code === 0) {
            const tips = this.type === "add" ? "新增成功！" : "修改成功！";
            this.$message.success(tips);
            this.addVisible = false;
            this.loadData();
          }
          this.parent = "";
        }
      });
    },
    addHandle(el, data = "") {
      data && this.parentTreeHandle(this.choseTree, "id", "name", data.id);
      this.addData = {
        sort: "",
        keepAlive: "0", //路由缓冲,0,1
        name: "",
        permission: "",
        path: "",
        query: "",
        remark: "",
        parentId: this.parent, //上级id
        icon: "",
        type: data.type || "0",
      };
      this.id = data.id;
      this.parent = "";
      this.type = "add";
      this.addVisible = true;
    },
    editHandle(el, data = "") {
      this.addData = this.$deepClone(data);
      this.id = this.addData.parentId;
      this.addData.parentId &&
        this.parentTreeHandle(
          this.choseTree,
          "id",
          "name",
          this.addData.parentId
        );
      if (this.parent) {
        this.addData.parentId = this.parent;
      }
      this.parent = "";
      this.type = "edit";
      this.addVisible = true;
    },
    delHandle(el, data = "") {
      this.$confirm("是否删除 ”" + data.name + "“ 路由?")
        .then(async (_) => {
          const res = await this.$httpRequest({
            url: "/admin/menu/" + data.id,
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
    treeChose(val) {
      this.addData.parentId = val.name;
      this.id = val.id;
    },
    parentTreeHandle(data, code, rcode, value) {
      if (data.length) {
        let rvalue = "";
        data.forEach((item, index) => {
          if (item[code] === value) {
            rvalue = item[rcode];
          } else {
            item.children.length &&
              this.parentTreeHandle(item.children, code, rcode, value);
          }
        });
        if (rvalue) {
          this.parent = rvalue;
        }
      }
    },
    sureChoseIcon(icon) {
      this.addData.icon = icon;
      this.iconVisible = false;
    },
    choseIcon() {
      this.iconVisible = true;
    },
    closed() {
      this.$refs["add"].resetFields();
    },
  },
};
</script>

<style lang="scss">
.dict-dia {
  .dialog-icon {
    .el-input {
      width: 202px !important;
    }
  }
  .el-select {
    width: 202px !important;
  }
}
</style>
<style lang="scss" scoped>
.menutextarea {
  width: 500px;
}
.icon-box {
  display: flex;
  flex-wrap: wrap;
  div {
    padding: 20px;
  }
  div:hover {
    cursor: pointer;
    transition: all 0.2s;
    transform: scale(1.4);
  }
}
</style>
