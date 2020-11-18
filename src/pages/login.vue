<template>
  <div class="login">
    <el-form
      :model="userInfo"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="活动名称" prop="username">
        <el-input v-model="userInfo.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="userInfo.password"
          clearable
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login('ruleForm')"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import { getUserLogin } from "../unitl/axios";
export default {
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapActions(['changeUserInfoAction']),
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUserLogin(this.userInfo).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //存到本地
            console.log(res.data.list);
              // sessionStorage.setItem('userInfo',JSON.stringify(res.data.list))
              this.changeUserInfoAction(res.data.list)
              //跳转
              this.$router.push('/home')
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.login {
  width: 100vw;
  height: 100vh;
  background: $firstColor;

  .el-form {
    height: 100px;
    width: 600px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>