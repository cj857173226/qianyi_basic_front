<template>
  <div class="page-outer">
    <div class="page-inner">
      <!-- 列表搜索条件 -->
      <div class="page-search-line">
        <div class="search-item">
          <div class="s-label">关键字</div>
          <el-input
            placeholder="关键字搜索"
            v-model="formData.note"
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
          @click="openDialog('add')"
          v-if="permissions._scAppVersion_add"
        >
          <img class="icon-img" :src="addIcon" alt="" />新增</el-button
        >
        <!-- <el-button
          size="large"
          @click="multipleDel"
          :disabled="multipleSelection.length === 0"
        >
          <i class="el-icon-delete-solid icon-text"></i>
          删除</el-button
        > -->
      </div>

      <div class="list-wrap">
        <el-row>
          <el-table
            class="speacilTable"
            v-loading="listLoading"
            :data="tableData"
            :height="defaultTableHeight"
            @selection-change="handleSelectionChange"
            stripe
            style="width: 100%"
          >
            <!-- <el-table-column type="selection" width="55" align="center">
            </el-table-column> -->
            <el-table-column
              type="index"
              label="序号"
              width="70"
              align="center"
            >
            </el-table-column>
            <el-table-column label="版本" width="80">
              <template slot-scope="scope">
                <span>V{{ scope.row.versionNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否强制更新" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.isUpdate == 1 ? "是" : "否" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              label="发布时间"
              width="180"
            ></el-table-column>
            <el-table-column label="app大小" width="120">
              <template slot-scope="scope">
                <span>{{ getfilesize(scope.row.fileSize) }}m</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="note"
              label="更新介绍"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  v-if="permissions._scAppVersion_edi"
                  @click="openDialog('edit', scope.row)"
                  >编辑</el-button
                >
                <el-button
                  class="tag-btn"
                  type="text"
                  size="small"
                  v-if="permissions._scAppVersion_del"
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
      :title="dialogType === 'add' ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      class="classifyDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      width="600px"
    >
      <el-form
        ref="addform"
        :model="addForm"
        :rules="addRules"
        label-width="120px"
        size="small"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="当前版本" prop="versionNo">
              <el-input
                v-model="addForm.versionNo"
                placeholder="输入格式1.0.1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否强制更新" prop="isUpdate">
              <el-radio-group v-model="addForm.isUpdate">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="更新介绍" prop="note">
              <el-input v-model="addForm.note" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="app上传">
              <el-upload
                class="upload-demo"
                action
                :http-request="(file) => upLoad(file)"
                multiple
                :show-file-list="false"
              >
                <el-button size="small" type="primary" :loading="isUploading"
                  >点击上传</el-button
                >
                <div slot="tip" class="el-upload__tip" v-if="addForm.url">
                  下载地址:{{ $baseUrl + addForm.url }}
                </div>
              </el-upload>
              <el-button
                style="float: right"
                size="small"
                type="primary"
                @click="quxiao"
                v-if="addForm.url"
                >删除当前文件</el-button
              >
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
  note: "",
  current: 1,
  size: 10,
};
export default {
  name: "",
  data() {
    let validateNumber = async (rule, value, callback) => {
      let regTextChar = /^([0]|[1-9][0-9]*)$/;
      if (value && !regTextChar.test(value)) {
        callback(new Error("请输入正整数"));
      } else if (Number(value) >= 999999999) {
        callback(new Error("值不能大于999999999"));
      }
    };
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
        versionNo: "",
        note: "",
        isUpdate: 0,
        fileSize: "",
        url: "",
      },
      isUploading: false,
      addRules: {
        versionNo: [{ required: true, message: "当前版本", trigger: "blur" }],
        note: [{ required: true, message: "更新介绍", trigger: "blur" }],
        isUpdate: [
          { required: true, message: "是否强制更新", trigger: "change" },
        ],
      },
      tableData: [],
      multipleSelection: [],
      pageParam: {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
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
          url: "/admin/scAppVersion/page",
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
    getfilesize(num) {
      let size = num / 1024 / 1024;
      return size.toFixed(2);
    },
    // 上传
    async upLoad(file) {
      if (this.addForm.url != "") {
        this.$message.warning(`限制最多上传1个文件`);
        return;
      }
      if (!this.checkfiletype(file)) {
        return false;
      }
      this.isUploading = true;
      const h = this.$createElement;
      try {
        this.$notify.info({
          title: "提示",
          message: "apk上传中",
        });
        const res = await this.$upLoadFile(file);
        this.isUploading = false;
        if (res.code == 0) {
          this.addForm.url = res.data.url;
          this.addForm.fileSize = res.data.fileSize;
          this.$notify({
            title: "提示",
            message: "apk上传成功",
            type: "success",
          });
        } else {
          this.addForm.url = "";
          this.isUploading = false;
        }
      } catch (err) {
        this.addForm.url = "";
        this.isUploading = false;
      }
    },
    // 校验图片格式
    checkfiletype(file) {
      const isLt40M = file.file.size / 1024 / 1024 < 40;
      var isfile = false;
      if (file.file.type == "application/vnd.android.package-archive") {
        isfile = true;
      }
      if (isfile == false) {
        this.$message.error("上传文件只能是apk格式");
        return false;
      }
      if (isLt40M == false) {
        this.$message.error("上传图片不能大于40m");
        return false;
      }
      return true;
    },
    search(el) {
      this.formData.current = 1;
      this.getData(el);
    },
    openDialog(type, row) {
      if (type == "add") {
        this.addForm.url = "";
      }
      this.dialogType = type;
      if (type === "edit") {
        let { versionNo, note, isUpdate, appVersionId, url, fileSize } = row;
        // isUpdate = parseInt(isUpdate)
        this.addForm = {
          appVersionId,
          versionNo,
          note,
          isUpdate,
          fileSize,
          url,
        };
      }
      this.dialogVisible = true;
    },
    // 删除商品
    delRows(el, row) {
      const { appVersionId, versionNo } = row;
      this.$confirm(`是否要删除 ${versionNo} 版本？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$httpRequest({
              url: `/admin/scAppVersion/remove?id=${appVersionId}`,
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
    // 列表多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogClosed() {
      this.$refs["addform"].resetFields();
      this.addForm = {
        versionNo: "",
        note: "",
        isUpdate: 1,
        fileSize: "",
        url: "",
      };
    },
    quxiao() {
      this.addForm.url = "";
    },
    saveSubmit(el) {
      let url = "";
      let method = "";
      let message = "";
      if (this.dialogType === "add") {
        url = "/admin/scAppVersion/save";
        method = "post";
        message = "新增成功";
      } else if (this.dialogType === "edit") {
        url = "/admin/scAppVersion/update";
        method = "put";
        message = "修改成功";
      }
      this.$refs["addform"].validate(async (valid) => {
        if (valid) {
          if (this.addForm.url == "") {
            this.$message.error("请上传app");
            return;
          }
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
</style>