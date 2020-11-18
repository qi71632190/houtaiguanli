<template>
  <div>
    <el-table
      :data="cateList"
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <!-- <el-table-column prop="pid" label="商品编号"> </el-table-column> -->
      <el-table-column prop="catename" label="商品名称"> </el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="item">
          <div>
            <img class="img" :src="$imgUrl + item.row.img" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="item">
          <div>
            <!-- {{item.row.id}} -->
            <el-button type="primary" size="small" @click="edit(item.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="del(item.row.id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getCateDelete } from "../../unitl/axios";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      cateList: "cate/getCateList",
    }),
  },
  mounted() {
    console.log(this.getCateListAction());
    this.getCateListAction();
  },
  methods: {
    ...mapActions({
      getCateListAction: "cate/getCateListAction",
    }),
    del(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调取删除接口
          getCateDelete({ id }).then((res) => {
            // console.log(res)
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.getCateListAction();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(id) {
      this.$emit("edit", id);
    },
  },
};
</script>

<style lang="stylus" scoped>
.img {
  width: 120px;
}
</style>