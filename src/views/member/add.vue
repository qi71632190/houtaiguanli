<template>
  <div>
    <el-dialog
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
        
          label="手机号:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="nickname"
          label="会员名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      
        <!-- <el-button
          type="primary"
          @click="add('formDialog')"
          v-if="addInfo.isAdd"
          >确 定</el-button
        > -->
        <el-button type="primary" @click="update">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getMemberAdd, getMemberInfo, getMemberEdit } from "../../unitl/axios";
export default {
  data() {
    return {
      form: {
        uid: "",
        phone: "",
        nickname: "",
        password: "",
        status: 1, //状态1正常2禁用
      },
      formLabelWidth: "120px",
      rules: {
        phone: [
          { required: true, message: "请输入", trigger: "blur" },
  
        ],
        nickname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  props: ["addInfo"],

  methods: {
    reset() {
      this.form = {
        phone:"",
        nickname: "",
        password: "",
        status: 1,
      };
      this.$refs["formDialog"].resetFields();
    },
    ...mapActions({
      getMemberList: "role/getMemberAction",
    }),

    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    look(uid) {
      console.log(this.form)
      getMemberInfo({ uid }).then((res) => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
        }
      });
    },
    update() {
      //调取添加接口
      getMemberEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getMemberList();
          //关闭弹框
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped></style>