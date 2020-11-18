<template>
  <div>
    <!--  -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="roleid" label="角色编号" width="180">
      </el-table-column>
      <el-table-column prop="username" label="角色名称" width="180">
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
            <el-button type="primary" size="small" @click="edit(item.row.uid)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              plain
              @click="del(item.row.uid)"
              size="small"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      class="fenye"
      :total="userCount"
      :page-size="userSize"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getUserDelete, getUserEdit, getUserInfo } from "../../unitl/axios";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      // roleList: "role/getRoleList",
      userList: "use/getUserList",
      userCount: "use/getUserCount",
      userSize: "use/getUserSize",
    

    }),
  },
  mounted() {
    this.getUserAction();
    // console.log(this.userList);
    this.getUserCount();
    
  },
  methods: {
    ...mapActions({
      getUserAction: "use/getUserAction",
      getUserCount: "use/getCountAction",
      changePageAction:'use/changePageAction',
      getCountAction:"use/getCountAction"
    }),
    del(uid) {
      this.$confirm("确定要删除这一条数据吗？？？！！！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getUserDelete({ uid }).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //重新调取列表
              this.getUserAction();
              this.getCountAction();
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
    currentChange(e) {
        // console.log(e, "当前页");
      this.changePageAction(e);
    },
  },
};
</script>

<style lang="stylus" scoped>
.fenye {
  margin-top: 20px;
  // margin 0 auto
  float: right;
  position: absolute;
}
</style>