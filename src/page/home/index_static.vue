<template>
  <div class="home">
    <div class="main">
      <div class="left animated bounceInLeft">
        <div class="title">{{title}}</div>
        <p class="time-desc">
          {{ time }},欢迎您使用{{title}}
        </p>

        <!-- <p class="line-p">在这里，您可以进行预约与办件审核；</p>
        <p class="line-p">可以对诉求进行处理、事项进行分类；</p>
        <p class="line-p">有消息提醒，及时告知工作人员。</p> -->

        <div class="tips">
          <i class="el-icon-warning-outline" style="margin-right: 8px"></i>
          如需进行非业务内容调整，请先告知技术人员，切勿擅自改动栏目内容。
        </div>
      </div>
      <div class="right">
        <img class="animated swing" :src="homeImg" alt="" />
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
import homeImg from "../../../public/img/home_img.png";
import time from "@/util/myDate.js"; //返回时间对象的方法
import webiste from "@/const/website";
export default {
  data() {
    return {
      homeImg: homeImg,
      time: "",
      title: webiste.title,
    };
  },
  mounted() {
    let $time = time.getDateObj();
    this.time = `${$time.yyyy}年${$time.mm}月${$time.dd}日 ${$time.week}`;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  .main {
    height: 100%;
    padding: 20px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .left {
      .title {
        color: #0092e5;
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 12px;
        letter-spacing: 4px;
      }
      .time-desc {
        font-size: 14px;
        color: #333;
        margin-bottom: 32px;
      }
      .line-p {
        font-size: 16px;
        color: #666;
        margin-bottom: 10px;
        margin-top: 0;
      }
      .tips {
        margin-top: 30px;
        color: #ff9500;
        font-size: 14px;
      }
    }
    .right {
      img {
        width: 475px;
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .right {
    display: none;
  }
}
</style>