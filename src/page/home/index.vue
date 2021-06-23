<template>
  <div class="home">
    <el-row>
      <el-col :lg="12">
        <div class="content-block welcome-wrap">
          <img class="logo" :src="logo" alt="" />
          <div class="right">
            <div class="title">{{title}}</div>
            <div class="content">
              {{ time }}, 欢迎您使用{{title}}
            </div>
          </div>
        </div>
        <div class="content-block event-wrap">
          <div class="title-wrap">
            <div class="title">办件审核</div>
            <div class="nums">待处理（{{ listNumbers.itemCount }}条）</div>
            <div class="screen-box">
              <div
                class="item"
                v-for="item in screenBtns"
                :key="item.value"
                :class="{ 'item-active': eventFormData.status === item.value }"
                @click="changeScreen(item.value, 'eventFormData')"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="more-line">
            <div
              class="more"
              @click="
                toMore('/businessManage/eventAudit/index', { status: '00' })
              "
            >
              查看更多
            </div>
          </div>
          <el-table
            class="speacilTable"
            v-loading="evnetLoding"
            :data="eventTable"
            border
            :height="defaultTableHeight"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="事项名称"
              prop="title"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              width="160"
              label="申请日期"
            ></el-table-column>

            <el-table-column
              :show-overflow-tooltip="true"
              prop="statusDesc"
              width="80"
              label="状态"
            >
              <template slot-scope="scope">
                <span
                  :style="{
                    color: [
                      scope.row.status == '00' && '#0092E5',
                      scope.row.status == '01' && '#33A954',
                      scope.row.status == '02' && '#999999',
                      scope.row.status == '03' && '#EE7723',
                      scope.row.status == '04' && '#B60808',
                    ],
                  }"
                  >{{ scope.row.statusDesc }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  class="tag-btn"
                  v-if="scope.row.status === '00'"
                  @click="
                    detail(
                      '/businessManage/eventAudit/detail',
                      scope.row,
                      'audit'
                    )
                  "
                  type="text"
                  >审核</el-button
                >
                <el-button
                  class="tag-btn"
                  v-else
                  @click="
                    detail(
                      '/businessManage/eventAudit/detail',
                      scope.row,
                      'view'
                    )
                  "
                  type="text"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :lg="12">
        <div class="content-block appeal-wrap">
          <div class="title-wrap">
            <div class="title">诉求处理</div>
            <div class="nums">待处理（{{ listNumbers.appealCount }}条）</div>
            <div class="screen-box">
              <div
                class="item"
                v-for="item in screenBtns"
                :key="item.value"
                :class="{ 'item-active': appealFormData.status === item.value }"
                @click="changeScreen(item.value, 'appealFormData')"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="more-line">
            <div
              class="more"
              @click="
                toMore('/businessManage/appealDeal/index', { status: '00' })
              "
            >
              查看更多
            </div>
          </div>
          <el-table
            v-loading="appealLoding"
            :data="appealTable"
            border
            :height="halfHeight"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="诉求标题"
              prop="title"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="typeDesc"
              label="诉求类型"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              width="160"
              label="申请日期"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="statusDesc"
              width="80"
              label="状态"
            >
              <template slot-scope="scope">
                <span
                  :style="{
                    color: [
                      scope.row.status == '00' && '#0092e5',
                      scope.row.status == '01' && '#33A954',
                      scope.row.status == '02' && '#B60808',
                      scope.row.status == '03' && '#EE7723',
                    ],
                  }"
                  >{{ scope.row.statusDesc }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  class="tag-btn"
                  v-if="scope.row.status == '00'"
                  @click="
                    detail(
                      '/businessManage/appealDeal/detail',
                      scope.row,
                      'audit'
                    )
                  "
                  type="text"
                  >处理</el-button
                >
                <el-button
                  class="tag-btn"
                  v-else
                  @click="
                    detail(
                      '/businessManage/appealDeal/detail',
                      scope.row,
                      'view'
                    )
                  "
                  type="text"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content-block order-wrap">
          <div class="title-wrap">
            <div class="title">预约审核</div>
            <div class="nums">已提交（{{ listNumbers.appointCount }}条）</div>
          </div>
          <div class="more-line">
            <div
              class="more"
              @click="
                toMore('/businessManage/orderAudit/index', { checkStatus: 3 })
              "
            >
              查看更多
            </div>
          </div>
          <el-table
            v-loading="orderLoading"
            :data="orderTable"
            border
            :height="halfHeight"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="80"
            >
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="预约事项"
              prop="itemName"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="appointDate"
              width="80"
              label="预约日期"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="appointTimeSlot"
              width="140"
              label="预约时间"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="checkStatusDesc"
              width="80"
              label="状态"
            >
              <template slot-scope="scope">
                <span
                  :style="{
                    color: [
                      scope.row.checkStatus == 1 && '#0092E5',
                      scope.row.checkStatus == 2 && '#B60808',
                      scope.row.checkStatus == 3 && '#33a954',
                    ],
                  }"
                  >{{ scope.row.checkStatusDesc }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  class="tag-btn"
                  v-if="scope.row.checkStatus === 3"
                  style="color: red"
                  @click="dialogOpen(scope.row)"
                  type="text"
                  >驳回</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="预约驳回"
      :visible.sync="dialogVisible"
      class="classifyDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      width="600px"
    >
      <el-form
        ref="addform"
        :model="addForm"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回意见：" prop="checkDesc">
              <el-input
                type="textarea"
                v-model="addForm.checkDesc"
                placeholder="请输入"
                resize="none"
                :autosize="{ minRows: 6 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectSubmit($event)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script type="text/javascript">
import time from "@/util/myDate.js"; //返回时间对象的方法
import logo from "../../../public/img/logo.png";
import webiste from "@/const/website";
export default {
  data() {
    return {
      logo: logo,
      evnetLoding: false,
      appealLoding: false,
      orderLoading: false,
      dialogVisible: false,
      time: "",
      defaultTableHeight: "400",
      halfHeight: "200",
      eventFormData: {
        status: "00",
      },

      appealFormData: {
        status: "00",
      },
      orderFormData: {
        checkStatus: 3,
        home: "home",
      },
      eventTable: [],
      appealTable: [],
      orderTable: [],
      listNumbers: {
        appealCount: 0,
        appointCount: 0,
        itemCount: 0,
      },
      addForm: {
        checkDesc: "",
        checkStatus: 2,
        id: "",
      },
      rules: {
        checkDesc: [
          { required: true, message: "请填写驳回意见", trigger: "blur" },
        ],
      },
      screenBtns: [
        {
          name: "已提交",
          value: "00",
        },
        {
          name: "已评价",
          value: "03",
        },
      ],
      title: webiste.title,
    };
  },
  created() {
    if (document.body.clientHeight > 400) {
      this.defaultTableHeight = document.body.clientHeight - 400;
      this.halfHeight = (document.body.clientHeight - 336) / 2;
    }
  },
  mounted() {
    window.onresize = () => {
      if (document.body.clientHeight > 400) {
        this.defaultTableHeight = document.body.clientHeight - 400;
        this.halfHeight = (document.body.clientHeight - 336) / 2;
      }
    };
    let $time = time.getDateObj();
    this.time = `${$time.yyyy}年${$time.m}月${$time.d}日 ${$time.week}`;

    this.getEventList();
    this.getAppealList();
    this.getOrderList();
    this.getListNumber();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", function () {
      if (document.body.clientHeight > 400) {
        this.defaultTableHeight = document.body.clientHeight - 400;
        this.halfHeight = (document.body.clientHeight - 336) / 2;
      }
    });
  },
  methods: {
    // 获取事件审核列表
    async getEventList(el) {
      this.evnetLoding = true;
      try {
        const res = await this.$httpRequest({
          url: "/admin/item/page",
          method: "get",
          data: this.eventFormData,
        });
        this.evnetLoding = false;
        if (res.code === 0) {
          let data = res.data;
          this.eventTable = data.records;
        }
      } catch (err) {
        this.evnetLoding = false;
      }
    },
    // 获取诉求处理列表
    async getAppealList(el) {
      this.appealLoding = true;
      try {
        const res = await this.$httpRequest({
          url: "/admin/appeal/page",
          method: "get",
          data: this.appealFormData,
        });
        this.appealLoding = false;
        if (res.code === 0) {
          let data = res.data;
          this.appealTable = data.records;
        }
      } catch (err) {
        this.appealLoding = false;
      }
    },
    // 获取预约数据
    async getOrderList(el) {
      this.orderLoading = true;
      try {
        const res = await this.$httpRequest({
          url: "/admin/appointTime/page",
          method: "get",
          data: this.orderFormData,
        });
        this.orderLoading = false;
        if (res.code === 0) {
          let data = res.data;
          this.orderTable = data.records;
        }
      } catch (err) {
        this.orderLoading = false;
      }
    },
    // 获取列表统计
    async getListNumber() {
      try {
        const res = await this.$httpRequest({
          url: "/admin/home/findWaitHandleNum",
          method: "get",
        });
        if (res.code === 0) {
          this.listNumbers = res.data;
        }
      } catch (err) {}
    },
    toMore(url, query) {
      let _query = query && typeof query ? query : {};
      this.$router.push({
        path: url,
        query: _query,
      });
    },
    detail(url, val, type) {
      this.$router.push({
        path: url,
        query: {
          id: val.id,
          type: type,
        },
      });
    },
    // 预约驳回
    rejectSubmit(el) {
      this.$refs["addform"].validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$httpRequest({
              url: "/admin/appointTime/verifyAppointTime",
              method: "post",
              data: this.addForm,
              eTarget: el,
            });
            if (res.code === 0) {
              this.$message.success("保存成功");
              this.getOrderList();
              this.dialogVisible = false;
            }
          } catch (err) {}
        }
      });
    },
    // 条件筛选
    changeScreen(val, form) {
      if (val === this[form].status) return;
      if (form === "eventFormData" && !this.evnetLoding) {
        this[form].status = val;
        this.getEventList();
      }
      if (form === "appealFormData" && !this.appealLoding) {
        this[form].status = val;
        this.getAppealList();
      }
    },

    dialogOpen(row) {
      this.addForm.id = row.id;
      this.dialogVisible = true;
    },
    dialogClosed() {
      this.$refs["addform"].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  .content-block {
    padding: 20px;
    background: #fff;
    margin: 0 10px 20px;
    .title-wrap {
      position: relative;
      display: flex;
      align-items: flex-end;
      padding: 0 10px;
      .title {
        margin-right: 36px;
        font-size: 20px;
      }
      .nums {
        color: #0092e5;
        font-size: 18px;
        margin-right: 20px;
      }
      .screen-box {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
        border-radius: 4px;
        .item {
          height: 100%;
          font-size: 12px;
          line-height: 20px;
          padding: 2px 4px;
          cursor: pointer;
          border: 1px solid #0092e5;
        }
        .item-active {
          background: #0092e5;
          color: #fff;
          cursor: default;
        }
      }
      &::after {
        content: "";
        position: absolute;
        width: 2px;
        height: 20px;
        background: #0092e5;
        left: 0;
        top: calc(50% - 9px);
      }
    }
    .more-line {
      display: flex;
      justify-content: flex-end;
      .more {
        color: #0092e5;
        font-size: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .welcome-wrap {
    padding: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      display: block;
      width: 72px;
    }
    .right {
      margin-left: 24px;
      text-align: center;

      .title {
        color: #0092e5;
        font-size: 28px;
        margin-bottom: 12px;
      }
      .content {
        font-size: 14px;
      }
    }
  }
}
</style>