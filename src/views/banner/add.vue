<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '商品分类' : '编辑菜单'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
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
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../unitl/axios";
import { mapActions, mapGetters } from "vuex";
import { indexRoutes } from "../../router";
export default {
  data() {
    return {
      form: {
       
        title: "",
        img: "",
        status: 1,
      },

      rules: {
        title: [
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
      bannerList: "banner/getBannerList",
    }),
  },
  mounted(){
    this.getBannerList()

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
        id: "",
        title: "",
        img: "",
        status: 1,
      };
      this.$refs["formDialog"].resetFields();
      this.fileList=[]
      this.imgUrl=''
    },
    ...mapActions({
      getBannerList: "banner/getBannerListAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    //查看一条事件
    look(id) {
      console.log(id, "形参");
      //调取查看列表
      getBannerInfo({ id }).then((res) => {
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
          this.imgUrl = this.imgUrl ? this.imgUrl : this.form.img;
          file.append("img", this.imgUrl);
          //调取修改接口
          getBannerEdit(file).then((res) => {
            console.log(res, "修改响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getBannerList();
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

          getBannerAdd(file).then((res) => {
            if (res.data.code == 200) {
              // console.log(res);
              this.$message.success(res.data.msg);
              this.cancel();
              this.getBannerList();
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