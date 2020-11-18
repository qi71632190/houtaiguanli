<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '商品分类' : '编辑菜单'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
       @opened="createEditor"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
          prop="first_cateid"
          :label-width="formLabelWidth"
          label="一级分类"
        >
          <el-select v-model="form.first_cateid" @change="changeCate(false)">
            <el-option value label="请选择" disabled></el-option>
            <!-- 调取商品分类的列表接口 -->
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
          prop="second_cateid"
          :label-width="formLabelWidth"
          label="二级分类"
        >
          <el-select v-model="form.second_cateid">
            <!-- 二级分类一定是根据一级分类选择之后的联动信息 -->
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
        <el-form-item
          prop="goodsname"
          label="商品名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="price"
          label="商品价格:"
          :label-width="formLabelWidth"
        >
          <el-input v-model.number="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="market_price"
          label="市场价格:"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model.number="form.market_price"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="specsname"
          label="图片:"
          :label-width="formLabelWidth"
        >
          <!-- :on-preview="handlePictureCardPreview" -->
          <!-- :on-remove="handleRemove" -->
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="onChange"
            :file-list="fileList"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-exceed="onExceed"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item
          prop="specsid"
          :label-width="formLabelWidth"
          label="商品规格"
        >
          <el-select v-model="form.specsid" @change="changeSpecs(false)">
            <el-option value label="请选择" disabled></el-option>
            <!-- 调取商品规格列表接口 -->
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="specsattr"
          :label-width="formLabelWidth"
          label="规格属性"
        >
          <!-- multiple	是否多选 -->
          <el-select v-model="form.specsattr" multiple>
            <el-option value label="请选择" disabled></el-option>

            <el-option
              v-for="item in attrArr"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
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
        <el-form-item label="商品描述:" :label-width="formLabelWidth">
          <!-- <textarea
            v-model="form.description"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea> -->
          <div id="editor"></div>
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
import { getGoodsAdd, getGoodsInfo, getGoodsEdit } from "../../unitl/axios";
import { mapActions, mapGetters } from "vuex";
import { indexRoutes } from "../../router";
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null,
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      },

      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "商品价格必须为数字" },
        ],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" },
          { type: "number", message: "市场价格必须为数字" },
        ],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "blur" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "blur" },
        ],
        specsid: [
          { required: true, message: "请选择商品规格", trigger: "blur" },
        ],
        specsattr: [
          { required: true, message: "请选择规格属性", trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
      indexRoutes,
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览图片的弹框
      imgUrl: "", //用来接收图片信息
      fileList: [], //文件上传列表
      secondArr: [],
      attrArr: [],
    };
  },

  props: ["addInfo"],
  mounted() {
    this.getSpecsList();
    this.getCateList();
  },
  computed: {
    //获取菜单列表的值
    ...mapGetters({
      cateList: "cate/getCateList",
      specsList: "specs/getSpecsList",
    }),
  },
  methods: {
    // 建立文本编辑器
    createEditor() {
      console.log("富文本被创建");
      this.editor = new E("#editor");
      this.editor.create();
      this.editor.txt.html(this.form.description);
      console.log(this.editor, "编辑器对象");
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 二级分类
    changeCate(n) {
      // console.log(this.form.first_cateid, "yi");
      console.log(n, "who");
      let index = this.cateList.findIndex((item, i) => {
        return this.form.first_cateid == item.id;
      });
      this.secondArr = this.cateList[index].children;
      // console.log(this.secondArr, "二级分类数组")
      if (!n) {
        console.log("false进来");
        //清空联动二级的双向数据绑定
        this.form.second_cateid = "";
      }
    },

    changeSpecs(n) {
      console.log(n);
      let index = this.specsList.findIndex(
        (item) => this.form.specsid == item.id
      );
      this.attrArr = this.specsList[index].attrs;
      //清空二级联动信息
      if (!n) {
        this.form.specsattr = [];
      }
    },
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
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.fileList = [];
      this.secondArr = [];
      this.attrArr = [];

      this.$refs["formDialog"].resetFields();
    },
    ...mapActions({
      getSpecsList: "specs/getSpecsAction",
      getCateList: "cate/getCateListAction",
      getGoodsList: "goods/getGoodsAction",
      getGoodsCount: "goods/getCountAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    //查看一条事件
    look(id) {
      getGoodsInfo({ id }).then((res) => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          //对数据进行二次修改
          let data = res.data.list;
          this.form = data;
          this.form.id = id;
          //点击打开弹框给图片列表赋值
          this.fileList = this.form.img
            ? [{ url: this.$imgUrl + this.form.img }]
            : [];
          //点击打开弹框，给属性值进行二次数据整合
          this.form.specsattr = this.form.specsattr
            ? this.form.specsattr.split(",")
            : [];
          //重新调取change事件
          this.changeCate(true);
          //防止 规格属性概率问题
          this.changeSpecs(true);
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
          //把编辑器中的内容设置给我的描述参数
          this.form.description = this.editor.txt.html();
          getGoodsEdit(file).then((res) => {
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
          this.form.specsattr = this.form.specsattr
        ? this.form.specsattr.join(",")
        : "";
          console.log(this.form, "dwa");
          let data = this.form;
          let file = new FormData();
           this.form.description = this.editor.txt.html();
          for (let i in data) {
            file.append(i, data[i]);
          }
          file.append("img", this.imgUrl);

          getGoodsAdd(file).then((res) => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message.success(res.data.msg);
              this.cancel();
               this.getCountAction();
              this.getGoodsList();
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