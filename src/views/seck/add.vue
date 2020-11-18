<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
          prop="title"
          label="活动名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="活动期限:" :label-width="formLabelWidth">
          <el-date-picker
            v-model="timer"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker
        ></el-form-item>

        <el-form-item :label-width="formLabelWidth" label="一级分类">
          <el-select v-model="form.first_cateid" @change="changeCate()">
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="二级分类">
          <el-select v-model="form.second_cateid" @change="changeGoods()">
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in secondArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.url" autocomplete="off"></el-input> -->
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
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
        <el-button type="primary" @click="update('formDialog')" v-else
          >编辑</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSeckAdd,
  getSeckInfo,
  getSeckEdit,
  getCateList,
  getGoodsList,
} from "../../unitl/axios";
import { mapActions, mapGetters } from "vuex";
import { indexRoutes } from "../../router";
export default {
  data() {
    return {
      form: {
        title: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
        begintime: "",
        endtime: "",
      },
      timer: "",

      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },

      formLabelWidth: "120px",
      indexRoutes,
      secondArr: [],
      goodsArr: [],
    };
  },

  props: ["addInfo"],
  computed: {
    //获取菜单列表的值
    ...mapGetters({
      cateList: "cate/getCateList",
    }),
  },
  mounted() {
    if (this.cateList.length == 0) {
      this.getCateListAction();
    }
  },
  methods: {
    changeCate(n) {
      let index = this.cateList.findIndex(
        (item) => item.id == this.form.first_cateid
      );
      this.secondArr = this.cateList[index].children;
      if (!n) {
        this.form.second_cateid = "";
        this.form.goodsid = "";
      }
      console.log(this.secondArr);
    },
    changeGoods(n) {
      //调取商品列表接口
      getGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.goodsArr = res.data.list;
          //清空二级双向数据绑定还要清空三级
          if (!n) {
            this.form.goodsid = "";
          }
        }
      });
    },
    reset() {
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.timer = "";
      this.$refs["formDialog"].resetFields();
    },
    ...mapActions({
      getCateListAction: "cate/getCateListAction",
      getSeckList: "seck/getSeckListAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    //查看一条事件
    look(id) {
      console.log(id, "形参");
      //调取查看列表
      getSeckInfo({ id }).then((res) => {
        console.log(res, "一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.timer = [
            new Date(parseFloat(this.form.begintime)),
            new Date(parseFloat(this.form.endtime)),
          ];
          this.form.id = id;
          this.changeCate(true);
          this.changeGoods(true);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //确定修改事件
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.begintime = new Date(this.timer[0]).getTime();
          this.form.endtime = new Date(this.timer[1]).getTime();
          //修改逻辑
          //调取修改接口
          getSeckEdit(this.form).then((res) => {
            console.log(res, "修改响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getSeckList();
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

    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.begintime = new Date(this.timer[0]).getTime();
          this.form.endtime = new Date(this.timer[1]).getTime();
          //添加逻辑
          //调取添加接口
          getSeckAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message.success(res.data.msg);
              this.cancel();
              this.getSeckList();
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

<style lang="stylus" scoped></style>