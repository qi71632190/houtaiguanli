<template>
  <div>
    <!-- <h1>登录</h1> -->
    <el-container>
      <el-header class="head"
        >XXX后台管理项目
        <div v-if="getUserInfo" class="userInfo">
          欢迎 <span>{{ getUserInfo.username }}</span> 登录本系统
          <el-button @click="logout" type="danger" size="small">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <v-nav></v-nav>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import vNav from "../components/nav";
export default {
  components: {
    vNav,
  },
  computed: {
    ...mapGetters(["getUserInfo"]),
  },
  methods: {
    ...mapActions(["changeUserInfoAction"]),
    //logout退出事件
    logout() {
      this.$message({
        message: "成功退出",
        type: "success",
      });
      this.changeUserInfoAction(null);
      //退出之后强制跳转登录页
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.head {
  background: $secondColor;
  font-size: 24px;
  color: white;
}

.userInfo {
  float: right;
  font-size: 20px;
  margin-top: 10px;
}

.userInfo span {
  color: #333;
}
</style>