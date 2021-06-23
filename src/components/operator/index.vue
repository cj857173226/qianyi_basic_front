<template>
  <section>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="opertaor-dia"
      title="经办人管理"
      :visible.sync="newOpertaorVisible"
      width="1400px"
    >
      <div>
        <el-row :gutter="40">
          <el-col :xs="12" :sm="16" :md="16" :lg="18" :xl="18">
            <el-row :gutter="30" class="search-cloumn">
              <el-col
                class="flex-row flex-row-ie"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="12"
                :xl="12"
              >
                <span class="search-label">经办人姓名：</span>
                <el-input
                  clearable
                  @keyup.enter.native="enterLoad"
                  class="search-input"
                  size="large"
                  v-model="params.operatorName"
                  placeholder=""
                ></el-input>
              </el-col>
              <el-col
                class="flex-row flex-row-ie"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="12"
                :xl="12"
              >
                <span class="search-label">手机号码：</span>
                <el-input
                  clearable
                  @keyup.enter.native="enterLoad"
                  class="search-input"
                  size="large"
                  v-model="params.operatorPhone"
                  placeholder=""
                ></el-input></el-col
              ><el-col
                class="flex-row flex-row-ie"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="12"
                :xl="12"
              >
                <span class="search-label">状态：</span>
                <el-select
                  class="search-input"
                  clearable
                  v-model="params.status"
                  placeholder=""
                  size="large"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.desc"
                    :value="item.value"
                  ></el-option>
                </el-select> </el-col
            ></el-row>
          </el-col>
          <div style="width: 207px; display: flex; justify-content: center">
            <div>
              <el-button size="large" type="primary" @click="queryData($event)"
                >查询</el-button
              >
              <el-button size="large" @click="resetQuery($event)"
                >重置</el-button
              >
            </div>
          </div>
        </el-row>
      </div>
      <el-button
        @click="addHandle($event)"
        type="primary"
        style="margin-bottom:20px"
        >+ 新增经办人</el-button
      >
      <el-table height="420px" v-loading="listLoading" :data="tableData" border>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="operatorName"
          label="经办人姓名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="operatorCardid"
          label="身份证号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="operatorPhone"
          label="手机号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? "正常" : "失效" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更改时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateUser"
          label="操作人"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              size="large"
              type="text"
              v-if="scope.row.status == 1"
              @click="unbundlingHandle($event, scope.row)"
              >移除</el-button
            >
            <el-button
              size="large"
              type="text"
              v-if="scope.row.status == 0"
              @click="bindingHandle($event, scope.row)"
              >重新添加</el-button
            >
            <el-button
              size="large"
              type="text"
              v-if="!scope.row.mainFlag"
              @click="changeOperatorHandle($event, scope.row)"
              >移交主经办人</el-button
            >
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
    </el-dialog>
    <el-dialog
      class="dialog"
      title="移除确认"
      :visible.sync="unbundlingVisible"
      width="500px"
    >
      <div class="tips">
        <img :src="require('../../../public/img/jie.png')" alt="" />
        <span>是否移除该经办人，移除后该经办人将不能再登录平台?</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unbundlingVisible = false">取 消</el-button>
        <el-button type="primary" @click="unbundlingSure($event)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="dialog"
      title="重新添加确认"
      :visible.sync="bindingVisible"
      width="500px"
    >
      <div class="tips">
        <img :src="require('../../../public/img/jie.png')" alt="" />
        <span>是否重新添加该经办人，添加后该经办人可继续登录平台？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindingVisible = false">取 消</el-button>
        <el-button type="primary" @click="bindingSure($event)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="dialog"
      title="移交主经办人确认"
      :visible.sync="OperatorVisible"
      width="500px"
    >
      <div class="tips">
        <img :src="require('../../../public/img/jie.png')" alt="" />
        <span class="tips-text"
          >是否移交主经办人权限，移交后该用户将变成普通经办人，不再具备“经办人管理”权限？</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="OperatorVisible = false">取 消</el-button>
        <el-button type="primary" @click="OperatorSure($event)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="dialog-add"
      title="新增经办人"
      :visible.sync="addVisible"
      width="500px"
      @close="addClose"
    >
      <el-form :rules="addrules" ref="add" :model="addData" label-width="100px">
        <el-form-item label="经办人姓名:" prop="operatorName">
          <el-input
            style="width: 250px"
            v-model.trim="addData.operatorName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="operatorCardid">
          <el-input
            style="width: 250px"
            v-model.trim="addData.operatorCardid"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="operatorPhone">
          <el-input
            style="width: 250px"
            v-model.trim="addData.operatorPhone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure($event)">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    let validateId = async (rule, value, callback) => {
      let regTextChar = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!regTextChar.test(value)) {
        callback(new Error("身份证格式错误"));
      }
    };
    let validatePhone = async (rule, value, callback) => {
      let regTextChar = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!regTextChar.test(value)) {
        callback(new Error("手机号码格式错误"));
      }
    };
    return {
      listLoading: false,
      unbundlingVisible: false,
      bindingVisible: false,
      OperatorVisible: false,
      addVisible: false,
      addData: {},
      id: "",
      tableData: [],
      typeList: [
        { desc: "有效", value: 1 },
        { desc: "失效", value: 0 },
      ],
      addrules: {
        operatorName: [
          { required: true, message: "请输入经办人姓名", trigger: "blur" },
        ],
        operatorPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
        operatorCardid: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: validateId, trigger: "blur" },
        ],
      },
      pageParam: {
        //页码配置
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      params: {
        status: "",
        operatorPhone: "",
        operatorName: "",
        current: 1,
        size: 10,
      },
    };
  },
  props: {
    opertaorVisible: {
      type: Boolean,
      default: false,
    },
    opertaorId: {
      type: Number | String,
    },
  },
  watch: {
    opertaorVisible(val) {
      val && this.loadData();
    },
  },
  computed: {
    newOpertaorVisible: {
      get: function() {
        return this.opertaorVisible;
      },
      set: function(val) {
        this.$emit("update:opertaor-visible", val);
      },
    },
  },
  methods: {
    async loadData(el = "") {
      this.listLoading = true;
      try {
        const res = await this.$api.getToken(
          "/admin/sysCompanyOperator/operatorPage",
          { ...this.params, userId: this.opertaorId },
          el
        );
        if (res.code === 0) {
          this.tableData = res.data.records;
          this.pageParam.total = res.data.total;
        }
        this.listLoading = false;
      } catch (err) {
        this.listLoading = false;
      }
    },
    addSure(el) {
      //新增
      this.$refs["add"].validate(async (valid) => {
        if (valid) {
          const res = await this.$api.postToken(
            "/admin/sysCompanyOperator/operatorSave",
            {...this.addData,userId:this.opertaorId},
            el
          );
          if (res.code === 0) {
            this.addVisible = false;
            this.$message.success("新增成功");
            this.resetQuery("");
          } else {
            this.$message.error("添加失败！");
          }
        }
      });
    },
    async unbundlingSure(el) {
      // 移除经办人
      const res = await this.$api.postToken(
        "/admin/sysCompanyOperator/operatorUnbind?id=" + this.id,
        {},
        el
      );
      if (res.data) {
        this.$message.success("移除成功！");
        this.unbundlingVisible = false;
        this.resetQuery("");
      } else {
        this.$message.error("移除失败！");
      }
    },
    async OperatorSure(el) {
      const res = await this.$api.postToken(
        //移交主经办人
        "/admin/sysCompanyOperator/operatorTransfer?id=" + this.id,
        {},
        el
      );
      if (res.code === 0) {
        this.OperatorVisible = false;
        this.$message.success("移交成功！");
        this.resetQuery("");
      } else {
        this.$message.success("移交失败！");
      }
    },
    async bindingSure(el) {
      const res = await this.$api.postToken(
        //重新绑定经办人
        "/admin/sysCompanyOperator/operatorBind?id=" + this.id,
        {},
        el
      );
      if (res.data) {
        this.$message.success("添加成功！");
        this.bindingVisible = false;
        this.resetQuery("");
      } else {
        this.$message.error("添加失败！");
      }
    },
    addHandle(el) {
      //新增
      this.addData = {
        operatorName: "",
        operatorPhone: "",
        operatorCardid: "",
      };
      this.addVisible = true;
    },
    unbundlingHandle(el, data) {
      //移除
      this.id = data.id;
      this.unbundlingVisible = true;
    },
    bindingHandle(el, data) {
      //重新绑定
      this.id = data.id;
      this.bindingVisible = true;
    },
    changeOperatorHandle(el, data) {
      //移交
      this.id = data.id;
      this.OperatorVisible = true;
    },
    enterLoad() {
      this.queryData();
    },
    queryData(el = "") {
      this.params.current = 1;
      this.pageParam.currentPage = 1;
      this.loadData(el);
    },
    resetQuery(el) {
      this.pageParam.pageSize = 10;
      this.pageParam.currentPage = 1;
      this.params.size = 10;
      this.params.current = 1;
      this.params.operatorPhone = "";
      this.params.operatorName = "";
      this.params.status = "";
      this.loadData(el);
    },
    addClose() {
      this.$refs["add"].resetFields();
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
.dialog .tips {
  display: flex;
  font-size: 16px;
  img {
    height: 54px;
    flex: 0 0 39px;
  }
  span {
    width: 90% \9;
    display: inline-block;
    margin-left: 10px;
    line-height: 25px;
    margin-top: 20px;
  }
}
.opertaor-dia {
  .header {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .master {
      display: flex;
      align-items: center;
    }
    .master span {
      margin-right: 20px;
    }
    .master span:first-child {
      font-weight: bold;
    }
  }
}
</style>
