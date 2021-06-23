<template>
  <div class="main">
    <div class="search-wrap">
      <el-row :gutter="40">
        <el-col :xs="12" :sm="16" :md="16" :lg="18" :xl="18">
          <el-row :gutter="30" class="search-cloumn">
            <el-col
              class="flex-row"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <span class="search-label">类型：</span>
              <el-select
                clearable
                v-model="params.type"
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item of typeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <div style="width: 207px; display: flex; justify-content: center">
          <div>
            <el-button type="primary" @click="queryData($event)"
              >查询</el-button
            >
            <el-button @click="reset($event)">重置</el-button>
          </div>
        </div>
      </el-row>
    </div>
    <div class="list-wrap">
      <div class="table">
        <el-table
          v-loading="listLoading"
          height="600px"
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
            show-overflow-tooltip
            prop="createBy"
            label="操作用户信息"
            width="120"
          ></el-table-column>
          <el-table-column prop="type" label="类型" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.type | typeFilter(that) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="标题"
          ></el-table-column>
          <el-table-column
            prop="remoteAddr"
            label="IP地址"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="method"
            label="请求方式"
            width="120"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userAgent"
            label="客户端"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="请求时间"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
          ></el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  size="small"
                  type="text"
                  @click="watchHandle($event, scope.row)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  class="danger"
                  size="small"
                    v-if="permissions.sys_log_del"
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
    <el-dialog title="查看" :visible.sync="dialogVisible" width="800px">
      <div class="dia-main">
        <div class="left">
          <p>
            <span>类型：</span>
            <span>{{ detailData.type }}</span>
          </p>
          <p>
            <span>IP地址：</span>
            <span>{{ detailData.remoteAddr }}</span>
          </p>
          <p>
            <span>客户端：</span>
            <span>{{ detailData.userAgent }}</span>
          </p>
          <p>
            <span>创建时间：</span>
            <span>{{ detailData.createTime }}</span>
          </p>
        </div>
        <div class="right">
          <p>
            <span>标题：</span>
            <span>{{ detailData.title }}</span>
          </p>
          <p>
            <span>请求方式：</span>
            <span>{{ detailData.method }}</span>
          </p>
          <p>
            <span>请求时间：</span>
            <span>{{ detailData.updateTime }}</span>
          </p>
          <p>
            <span>请求参数：</span>
            <span>{{ detailData.params }}</span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      typeList: [],
      that: this,
      tableData: [],
      detailData: {},
      listLoading: false,
      dialogVisible: false,
      pageParam: {
        //页码配置
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      params: {
        descs: "create_time",
        type: "",
        size: 10,
        current: 1,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  filters: {
    typeFilter(val, that) {
      if (that.typeList.length) {
        return (
          that.typeList.find((item) => {
            return item.value === val;
          }).label || ""
        );
      } else {
        return "";
      }
    },
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
      this.getTypeList();
    });
  },
  methods: {
    async getTypeList() {
      try {
        const res = await this.$httpRequest({
          url: "/admin/dict/type/log_type",
          method: "get",
        });
        if (res.code === 0) {
          res.data.forEach((item) => {
            item.id = item.value;
          });
          this.typeList = res.data;
        }
      } catch (err) {}
    },
    async loadData(el = "") {
      try {
        this.listLoading = true;
        const res = await this.$httpRequest({
          url: "/admin/log/page",
          data: this.params,
          method: "get",
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
    reset(el) {
      this.pageParam.pageSize = 10;
      this.pageParam.currentPage = 1;
      this.params.size = 10;
      this.params.current = 1;
      this.params.type = "";
      this.loadData(el);
    },
    enterLoad() {
      this.queryData();
    },
    queryData(el = "") {
      this.params.current = 1;
      this.pageParam.currentPage = 1;
      this.loadData(el);
    },
    watchHandle(el, data) {
      //查看
      this.detailData = this.$deepClone(data);
      this.detailData.type =
        this.typeList.find((item) => {
          return item.value === data.type;
        }).label || "";
      this.dialogVisible = true;
    },
    delHandle(el, data) {
      //删除
      this.$confirm("是否确认删除ID为" + data.id + "的日志?")
        .then(async (_) => {
          const res = await this.$httpRequest({
            url: "/admin/log/" + data.id,
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
    curPageChange(val) {
      //页码变更
      this.pageParam.currentPage = val;
      this.params.current = val;
      this.loadData();
    },
    sizeChange(val) {
      //size变更
      this.params.size = val;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
.dia-main {
  display: flex;
  justify-content: space-between;
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
