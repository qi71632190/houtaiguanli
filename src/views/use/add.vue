<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加角色' : '修改角色'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
          prop="roleid"
          label="所属角色"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.roleid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="username"
          label="角色名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="角色密码:"
          :label-width="formLabelWidth"
        >
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
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="add('formDialog')"
          v-if="addInfo.isAdd"
          >确 定</el-button
        >
        <el-button type="primary" v-else @click="update">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getUserAdd, getUserInfo, getUserEdit } from "../../unitl/axios";
export default {
  data() {
    return {
      form: {
        roleid: "", // 角色编号
        username: "", //角色名称
        password: "", //角色密码
        status: 1, //状态1正常2禁用
      },
      formLabelWidth: "120px",
      rules: {
        username: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
        ],
        roleid: [
          { required: true, message: "请选择所属角色", trigger: "blur" },
        ],
      },
    };
  },
  props: ["addInfo"],
  computed: {
    ...mapGetters({
      roleList: "role/getRoleList",
    }),
  },
  mounted() {
    console.log(this.getRoleList());
    if (this.roleList.length == 0) {
      this.getRoleList();
    }
  },
  methods: {
    reset() {
      this.form = {
        roleid: "", // 角色编号
        username: "", //角色名称
        password: "", //角色密码
        status: 1, //状态1正常2禁用
      };
      this.$refs["formDialog"].resetFields();
    },
    ...mapActions({
      getRoleList: "role/getRoleAction",
      getUserList: "use/getUserAction",
      getCountAction: "use/getCountAction",
    }),

    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    look(uid) {
      getUserInfo({ uid }).then((res) => {
        // console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;

          this.form.uid = uid;
        }
      });
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUserAdd(this.form).then((res) => {
            console.log(this.form);
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);

              this.getUserList();
              this.getCountAction();
              this.cancel();
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
    update() {
      console.log(this.form, "表单信息");
      //调取添加接口
      getUserEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getUserList();
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