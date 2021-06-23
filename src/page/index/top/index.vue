<template>
  <SplistTop v-if="isSplit" />
  <MergeTop v-else />
</template>

<script type="text/javascript">
import SplistTop from "./index_split";
import MergeTop from "./index_merge";
import { SystemSettings } from "@/const/website";
export default {
  components: { SplistTop, MergeTop },
  name: "",
  data() {
    return {
      isSplit: SystemSettings.IS_NAV_SPLIT,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>