<template>
  <div>
    <el-aside width="200px" class="nav">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        background-color="#3d5f81"
        text-color="#fff"
        active-text-color="#f3d04b"
        router
      >
        <el-menu-item index="/home">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu
          :index="item.id.toString()"
          v-for="item in getUserInfo.menus"
          :key="item.id"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            :index="menu.url"
            v-for="menu in item.children"
            :key="menu.id"
          >
            <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      defaultActive: "/home",
    };
  },
  computed: {
    ...mapGetters(["getUserInfo"]),
  },
  mounted() {
    // this.defaultActive = this.$route.path;
    // this.getMenuListAction();
    this.defaultActive = this.$route.path;
    console.log(this.getUserInfo.menus)
  },
  methods: {
    // ...mapActions({
    //   getMenuListAction: "menu/getMenuListAction",
    // }),
    
  },
};
</script>

<style lang="stylus" scoped>
.nav {
  min-height: 80vh;
  background-color: #3d5f81;
}
</style>