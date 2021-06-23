<template>
  <svg-icon
    class="power-by power-by-absolute"
    v-if="isWhite"
    icon-class="power-by-white"
  ></svg-icon>
  <svg-icon class="power-by" :class="{'power-by-absolute':absolute}" v-else icon-class="power-by-black"></svg-icon>
</template>

<script>
export default {
  name: "powerBy",
  props: {
    isWhite: {
      type: Boolean,
      defualt: false,
    },
    absolute:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.power-by {
  width: 100%;
  font-size: 34px;
  text-align: center;
  left: 0;
  right: 0;
  margin-bottom: 20px;
}
.power-by-absolute {
  position: absolute;
  margin-bottom: 0;
  bottom: 10px;
}
</style>