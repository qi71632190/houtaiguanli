<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '商品分类' : '编辑菜单'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item prop="pid" label="上级分类" :label-width="formLabelWidth">
          <el-select v-model="form.pid" placeholder="请选择上级菜单">
            <el-option :value="0" label="顶级分类"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="catename"
          label="分类名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            list-type="picture-card"
            action="#"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :auto-upload="false"
            :on-change="onChange"
            :file-list="fileList"
            :limit="1"
            :on-exceed="onExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
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
import { getCateAdd, getCateInfo, getCateEdit } from "../../unitl/axios";
import { mapActions, mapGetters } from "vuex";
import { indexRoutes } from "../../router";
export default {
  data() {
    return {
      form: {
        pid: 0,
        catename: "",
        img: "",
        status: 1,
      },

      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        pid: [{ required: true, message: "请选择上级分类", trigger: "blur" }],
      },
      formLabelWidth: "120px",
      indexRoutes,
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览图片的弹框
      imgUrl: "", //用来接收图片信息
      fileList: [], //文件上传列表
    };
  },

  props: ["addInfo"],
  computed: {
    //获取菜单列表的值
    ...mapGetters({
      cateList: "cate/getCateList",
    }),
  },
  methods: {
    // 图片上传
    onChange(file) {
      console.log(file);
      this.imgUrl = file.raw;
    },
    //图片预览
    onPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片移除
    onRemove(file, fileList) {},
    // 图片上传
    onExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    reset() {
      this.form = {
        pid: 0,
        catename: "",
        img: "",
        status: 1,
      };
      this.$refs["formDialog"].resetFields();
      this.fileList=[]
      this.imgUrl=''
    },
    ...mapActions({
      getCateList: "cate/getCateListAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    //查看一条事件
    look(id) {
      console.log(id, "形参");
      //调取查看列表
      getCateInfo({ id }).then((res) => {
        // console.log(res,'一条数据')
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.fileList = this.form.img
            ? [{ url: `${this.$imgUrl}${this.form.img}` }]
            : [];
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //确定修改事件
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = this.form;
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          //如果你新传了图片 this.imgUrl就有值。就赋值给this.imgUrl。如果没有新添加的图片就用上一次的图片
          this.imgUrl = this.imgUrl ? this.imgUrl : this.form.img;
          file.append("img", this.imgUrl);
          //修改逻辑
          //调取修改接口
          getCateEdit(file).then((res) => {
            console.log(res, "修改响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getCateList();
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
          console.log(this.form, "dwa");
          let data = this.form;
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          file.append("img", this.imgUrl);

          getCateAdd(file).then((res) => {
            if (res.data.code == 200) {
              // console.log(res);
              this.$message.success(res.data.msg);
              this.cancel();
              this.getCateList();
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
    //下拉菜单修改触发的事件
    changeMenu() {
      console.log(this.form.pid, "pid");
      //通过用户是否选择顶级菜单来渲染你的菜单类型
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
  },
};
</script>

<style lang="stylus" scoped></style>