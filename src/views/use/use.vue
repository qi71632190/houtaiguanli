<template>
  <div>
    <el-button type="primary" @click="add" class="btn">添加</el-button>
    <v-list @edit="edit"></v-list>
    <v-add :addInfo="addInfo" @cancel="cancel" ref="dialog"></v-add>
  </div>
</template>

<script>
import vList from "./list";
import vAdd from "./add";
export default {
  data() {
    return {
      addInfo: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  components: {
    vList,
    vAdd,
  },
  methods: {
    add() {
      this.addInfo.isShow = true;
      this.addInfo.isAdd = true;
    },
    cancel() {
      this.addInfo.isShow = false;
    },
    edit(e) {
      this.addInfo.isShow = true;
      this.addInfo.isAdd = false;
      this.$refs.dialog.look(e);
    },
    
  },
};
</script>

<style lang="stylus" scoped>
.btn {
  margin-bottom: 20px;
}
</style>