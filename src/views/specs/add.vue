<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加规格' : '修改规格'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
          prop="specsname"
          label="规格名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="规格属性:"
          :label-width="formLabelWidth"
          v-for="(domain, index) in domains"
          :key="index"
        >
          <el-input
            v-model="domain.value"
            autocomplete="off"
            class="input"
          ></el-input>
          <el-button type="primary" @click="addAttr" v-if="index === 0"
            >新增规格属性</el-button
          >
          <el-button type="danger" @click="addAttr" v-else>删除</el-button>
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
import { getSpecsAdd, getSpecsInfo, getSpecsEdit } from "../../unitl/axios";
export default {
  data() {
    return {
      domains: [
        {
          value: "",
        },
      ],
      form: {
        specsname: "", // 规格名称
        attrs: "", //规格属性
        status: 1, //状态1正常2禁用
      },
      formLabelWidth: "120px",
      rules: {
        specsname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  props: ["addInfo"],

  methods: {
    // 新增属性
    addAttr() {
      if (this.domains.length <= 6) {
        this.domains.push({
          value: "",
        });
      } else {
        this.$message.warning("最多只能添加6项！！！");
      }
    },
    reset() {
      this.form = {
        specsname: "", // 规格名称
        attrs: "", //规格属性
        status: 1, //状态1正常2禁用
      };
      this.$refs["formDialog"].resetFields();
      //初始化动态循环表单
      this.domains = [
        {
          value: "",
        },
      ];
    },
    ...mapActions({
      getSpecsList: "specs/getSpecsAction",
      getCountAction: "specs/getCountAction",
    }),

    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    look(id) {
      getSpecsInfo({ id }).then((res) => {
        // console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          let data = res.data.list[0];
          this.form = data;
          data.attrs.map((item, index) => {
            console.log(item, "nihao ");
            if (index == 0) {
              this.domains[0].value = item;
            } else {
              this.domains.push({
                value: item,
              });
            }
          });
        }
      });
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.attrs = this.domains.map((item) => item.value).join(",");
          getSpecsAdd(this.form).then((res) => {
            // console.log(this.form, "fwev");

            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.getSpecsList();
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
      this.form.attrs = this.domains.map((item) => item.value).join(",");
      // 调取添加接口
      getSpecsEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getSpecsList();
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

<style lang="stylus" scoped>
.input {
  width: 50%;
}
</style>