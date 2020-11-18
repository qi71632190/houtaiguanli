<template>
  <div>
    <!--  -->
    <el-table :data="memberList" border style="width: 100%">
      <el-table-column prop="uid" label="会员编号" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="会员名称" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" size="small" @click="edit(item.row.uid)">编辑</el-button>
            <!-- <el-button
              type="danger"
              plain
              @click="del(item.row.id)"
              size="small"
              >删除</el-button
            > -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import { getMemberDelete } from "../../unitl/axios";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      memberList: "member/getMemberList",
    }),
  },
  mounted() {
    this.getMemberAction();
  },
  methods: {
    ...mapActions({
      getMemberAction: "member/getMemberAction",
    }),
    // del(id) {
    //   this.$confirm("确定要删除这一条数据吗？？？！！！", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       //调取删除接口
    //       getRoleDelete({ id }).then((res) => {
    //         if (res.data.code == 200) {
    //           this.$message.success(res.data.msg);
    //           //重新调取列表
    //           this.getRoleAction();
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
    edit(id){
        this.$emit('edit',id)
    }
  },
};
</script>

<style lang="stylus" scoped></style>