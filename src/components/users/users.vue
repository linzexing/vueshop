<template>
  <!-- 卡片，相当于div -->
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2.搜索框 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <!-- 搜索按钮 -->
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUser()"
          ></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 3.数据表格 -->
    <el-table :data="userlsit" style="width: 100%">
      <!-- type属性设置为index时，会会自动给每条数据赋值，从1开始 -->
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column label="创建时间">
        <!-- 
            如果单元格内显示的内容不是字符串（文本）
            需要给被显示的内容外层包裹一个template
         -->
        <!-- 
            template内部要用数据，设置slot-scope属性
            该属性的值是要用数据create_time的数据源userlist
         -->
        <!-- 
             slot-scope的值userlist其实就是el-table绑定的数据userlist
             userlist.row -> 数组中的每个对象
          -->
        <template slot-scope="userlist">
          {{ userlist.row.create_time | fmtdate }}
        </template>
      </el-table-column>
      <!-- 用户状态栏 -->
      <el-table-column label="用户状态">
        <template slot-scope="userlist">
          <el-switch
            @change="changeMgState(userlist.row)"
            v-model="userlist.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- 操作栏 -->
      <el-table-column label="操作">
        <template slot-scope="userlist">
          <!-- 编辑 -->
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(userlist.row)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(userlist.row.id)"
          ></el-button>
          <!-- 更改用户角色-->
          <el-button
            @click="showSetUserRoleDia(userlist.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 4.分页 -->
    <!-- 
        @size-change 每页显示条数变化时 触发
        @current-change 当前页改变时 触发
        current-page 设置当前页是第几页
        page-sizes 每页多少条的数据数组
        page-size 设置显示多少条数据
        total 数据总数
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 对话框 -->
    <!-- 1.添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 2.编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input
            disabled
            v-model="form.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 3.修改用户权限的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{ currUserName }}
        </el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 如果外层select绑定的数据的值和option的value一样
            会显示该option的label值 -->
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item, i) in roles"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      //搜索框内容
      query: "",
      //当前数据页
      pagenum: 1,
      //数据总数
      total: -1,
      //每页数据条数
      pagesize: 2,
      //用户列表数据
      userlsit: [],
      //添加对话框的属性
      dialogFormVisibleAdd: false,
      //编辑对话框的属性
      dialogFormVisibleEdit: false,
      //用户角色对话框的属性
      dialogFormVisibleRole: false,
      //添加用户的表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //分配角色
      currRoleId: -1,
      //当前用户名
      currUserName: "",
      //保存所有角色数据
      roles: [],
      //当前用户id
      currUserId: -1,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表的请求
    async getUserList() {
      //获取token
      const AUTH_TOKEN = localStorage.getItem("token");
      //需要授权的API，必须在请求头中使用Authorization 字段提供token令牌
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // query 查询参数 可以为空
      // pagenum 当前页码 不能为空
      // pagesize 每页显示条数 不能为空
      const res = await this.$http.get("users", {
        params: this.query & this.pagenum & this.pagesize,
      });
      console.log(res);
      const {
        meta: { status, msg },
        data: { users, total },
      } = res.data;
      if (status === 200) {
        //1.给表格数据赋值
        this.userlsit = users;
        //2.给total赋值
        this.total = total;
        //3.提示
        this.$message.success(msg);
      } else {
        //失败提示
        this.$$message.warning(msg);
      }
    },
    //每页显示条数发生变化触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    //当前页发生变化时触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList;
    },
    //根据搜索内容获取数据
    searchUser() {
      this.getUserList();
    },
    //清空搜索框，重新获取数据
    loadUserList() {
      this.getUserList;
    },
    //显示添加用户对话框
    showAddUserDia() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //添加用户，发送请求
    async addUser() {
      //1.关闭对话框
      this.dialogFormVisibleAdd = false;

      const res = await this.$http.post("users", this.form);
      const {
        meta: { status, msg },
        data,
      } = res.data;

      if (status === 200) {
        //2.提示成功
        this.$message.success(msg);
        //3.更新视图
        this.getUserList();
        //4.清空文本框
        this.form = {};
      } else {
        //失败提示
        this.$message.warning(msg);
      }
    },
    //显示删除用户的提示框
    showDeleUserMsgBox(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        //点击确定后执行then方法
        .then(async () => {
          //发送删除请求 id:用户id
          const res = await this.$http.delete("users/${userId}");

          if (res.data.meta.status === 200) {
            //修改当前数据页
            this.pagenum = 1;
            //更新视图
            this.getUserList;
            //提示删除成功的信息
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "warning",
              message: "删除失败!",
            });
          }
        })
        //点击取消后执行catch方法
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //显示编辑用户对话框
    showEditUserDia(user) {
      //获取用户数据
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    //编辑用户发送请求
    async editUser() {
      this.dialogFormVisibleEdit = false;

      const res = await this.$http.put("users/${this.form.id}", this.form);

      const {
        meta: { status, msg },
      } = res.data;

      if (status === 200) {
        this.getUserList();
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    //修改状态
    async changeMgState(user) {
      const res = await this.$http.put(
        "users/${user.id}/state/${user.mg_state}"
      );
    },
    //分配角色--打开对话框
    async showSetUserRoleDia(user) {
      //当前用户名
      this.currUserName = user.username;
      //当前用户id
      this.currUserId = user.username;
      //获取所有的角色
      const result = await this.$http.get("roles");
      this.roles = result.data.data;
      //获取当前用户的角色id -->rid
      const res = await this.$http.get("users/${user.id}");
      this.currRoleId = res.data.data.rid;

      this.dialogFormVisibleRole = true;
    },
    //分配角色-->发送请求
    async setRole() {
      const res = await this.$http.put("users/${this.currUserId}/role", {
        rid: this.currRoleId,
      });

      this.dialogFormVisibleRole = false
    },
  },
};
</script>
<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>