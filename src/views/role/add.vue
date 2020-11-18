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
          prop="rolename"
          label="角色名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form :model="form" :rules="rules">
          <el-form-item label="角色权限:" :label-width="formLabelWidth">
            <el-tree
              :data="menuList"
              default-expand-all
              node-key="id"
              ref="tree"
              :props="{
                children: 'children',
                label: 'title',
              }"
              show-checkbox
              check-strictly
            >
            </el-tree>
          </el-form-item>
        </el-form>
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
import { getRoleAdd, getRoleInfo, getRoleEdit } from "../../unitl/axios";
export default {
  data() {
    return {
      form: {
        rolename: "", // 角色名称
        menus: "", //角色权限
        status: 1, //状态1正常2禁用
      },
      formLabelWidth: "120px",
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  props: ["addInfo"],
  computed: {
    ...mapGetters({
      menuList: "menu/getMenuList",
    }),
  },
  mounted() {
    if (this.menuList.length == 0) {
      this.getMenuList();
    }
  },
  methods: {
    reset() {
      this.form = {
        rolename: "", // 角色名称
        status: 1, //状态1正常2禁用
      };
      //清空tree结构框
      this.$refs.tree.setCheckedKeys([]);
      this.$refs["formDialog"].resetFields();
    },
    ...mapActions({
      getMenuList: "menu/getMenuListAction",
      getRoleList: "role/getRoleAction",
    }),

    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    look(id) {
      getRoleInfo({ id }).then((res) => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
          //setCheckedKeys 	通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
          this.form.menus = this.$refs.tree.setCheckedKeys(
            // JSON.parse(this.form.menus)
            this.form.menus.split(',')
          );
          this.form.id = id;
        }
      });
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
        if (valid) {
          getRoleAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);

              this.getRoleList();

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
      //转化menu的数据类型
      this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
      // console.log(this.form,'表单信息')
      //调取添加接口
      getRoleEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getRoleList();
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