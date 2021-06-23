<template>
  <div class="page-outer">
    <div class="page-inner">
      <!-- 列表搜索条件 -->
      <div class="page-search-line">
        <div class="search-item">
          <div class="s-label">关键字</div>
          <el-input
            placeholder="关键字搜索"
            v-model="formData.name"
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

        <div class="buttons-wrap">
          <el-button size="large" type="primary" @click="search($event)"
            >查询</el-button
          >
          <el-button size="large" @click="clean($event)">重置</el-button>
        </div>
      </div>
      <!-- 工具栏 按钮之类 -->
      <div class="page-tools-line">
        <el-button
          size="large"
          v-if="permissions.sys_dept_add"
          @click="openDialog('add', {}, $event)"
        >
          <img class="icon-img" :src="addIcon" alt="" />新增</el-button
        >
      </div>

      <div class="list-wrap">
        <el-row>
          <el-table
            class="speacilTable"
            v-loading="listLoading"
            :data="tableData"
            :height="defaultTableHeight"
            stripe
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
              prop="name"
              label="公司名称"
              min-width="160"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="sort"
              label="排序"
              min-width="80"
            ></el-table-column>

            <el-table-column
              :show-overflow-tooltip="true"
              prop="productDisplay"
              width="140"
              label="状态"
              align="center"
            >
              <template slot-scope="scope">
                <div class="status-wrap">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="
                      (val) => statusChange(scope.row, val, scope.$index)
                    "
                  >
                  </el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              label="公司描述"
              min-width="200"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  v-if="permissions.sys_dept_edit"
                  @click="openDialog('edit', scope.row, $event)"
                  >编辑</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  v-if="permissions.sys_dept_del"
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

    <el-dialog
      :title="dialogType === 'add' ? '新增公司' : '修改公司'"
      :visible.sync="dialogVisible"
      class="classifyDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      width="600px"
    >
      <el-form
        ref="addform"
        label-position="left"
        :model="addForm"
        :rules="addRules"
        label-width="120px"
        size="small"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司名称" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入公司名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公司描述" prop="remark">
              <el-input
                v-model="addForm.remark"
                placeholder="请输入公司名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="addForm.sort" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类状态" prop="status">
              <el-radio-group v-model="addForm.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="dialogType == 'edit'">
            <el-form-item label="分配小区" prop="status">
              {{ addForm.subList.join(",") }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" @click="saveSubmit($event)" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import addIcon from "@/../public/img/add-icon.png";
import { mapGetters } from "vuex";
const FormData = {
  name: "",
  current: 1,
  size: 10,
};
export default {
  name: "",
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      dialogType: "add",
      addIcon: addIcon,
      startTime: "",
      endTime: "",
      defaultTableHeight: 440,
      delHeight: 300,
      formData: JSON.parse(JSON.stringify(FormData)),
      addForm: {
        name: "",
        remark: "",
        sort: "",
        status: 1,
      },
      addRules: {
        name: [{ required: true, message: "请填写公司名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      tableData: [],
      pageParam: {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      areaTree: [], //小区数据
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
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
          url: "/admin/dept/page",
          method: "get",
          data: this.formData,
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
    // 获取公司详情
    async getItemDetail(deptId, el) {
      try {
        const res = await this.$httpRequest({
          url: `/admin/dept/detail`,
          method: "get",
          data: {
            id: deptId,
          },
          eTarget: el,
        });
        if (res.code === 0) {
          this.dialogVisible = true;
          this.addForm = res.data;
        }
      } catch (err) {}
    },
    search(el) {
      this.formData.current = 1;
      this.getData(el);
    },

    openDialog(type, row, el) {
      this.dialogType = type;
      if (type === "add") {
        this.dialogVisible = true;
      }
      if (type == "edit") {
        this.getItemDetail(row.deptId, el);
      }
    },
    // 状态修改
    async statusChange(row, val, index) {
      let oldVal = !val;
      let data = {
        deptId: row.deptId,
        name: row.name,
        status: val,
      };
      try {
        const res = await this.$httpRequest({
          url: "/admin/dept",
          method: "put",
          data,
        });
        if (res.code !== 0) {
          this.$message.error("修改失败");
          this.tableData[index].status = oldVal;
        }
      } catch (err) {
        this.$message.error("修改失败");
        this.tableData[index].status = oldVal;
      }
    },
    // 删除
    delRows(el, row) {
      const { deptId, name } = row;
      this.$confirm(`是否要删除 ${name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$httpRequest({
              url: `/admin/dept/${deptId}`,
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

    dialogClosed() {
      this.$refs["addform"].resetFields();
      this.addForm = {
        name: "",
        remark: "",
        sort: "",
        status: 1,
      };
    },
    saveSubmit(el) {
      let url = "";
      let method = "";
      let message = "";
      if (this.dialogType === "add") {
        url = "/admin/dept";
        method = "post";
        message = "新增成功";
      } else if (this.dialogType === "edit") {
        url = "/admin/dept";
        method = "put";
        message = "修改成功";
      }
      this.$refs["addform"].validate(async (valid) => {
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
              this.dialogVisible = false;
            }
          } catch (err) {}
        }
      });
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
  },
};
</script>

<style lang="scss" scoped>
.goods-img {
  width: 48px;
  height: 32px;
}
.goods-status {
  display: flex;
  align-items: center;
}
.status-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    margin-right: 6px;
  }
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: transparent;
}
.add-form-title {
  display: flex;
  margin-bottom: 14px;
  align-items: center;
  color: #333333;
  font-size: 16px;
  font-weight: 800;
  &::before {
    content: "";
    width: 2px;
    height: 16px;
    background: #0092e5;
    margin-right: 8px;
    border-radius: 1px;
  }
}
</style>