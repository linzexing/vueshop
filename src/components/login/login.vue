<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formdata"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    /*让异步代码ajax看起来像同步代码
    1、找到异步操作有结果的代码，见面夹await，同时接收异步操作的结果res
    2、找到距离异步操作有结果的代码最近的方法，前面加async
    */
    //登录请求
    async handleLogin() {
      const res = await this.$http.post("login", this.formdata);
      const {
        data,
        meta: { msg, status },
      } = res.data;
      //登录成功
      if (status === 200) {
        //保存token
        localStorage.setItem('token',data.token)
        //跳转到home页面
        this.$router.push({ name: "home" });
        //提示成功信息
        this.$message.success(msg);
      }
      //登录不成功
      else {
        //提示成功信息
        this.$message.warning(msg);
      }
      //   this.$http.post("login", this.formdata).then((res) => {
      //     const {
      //       data,
      //       meta: { msg, status },
      //     } = res.data;
      //     //登录成功
      //     if (status === 200) {
      //       //跳转到home页面
      //       this.$router.push({ name: "home" });
      //       //提示成功信息
      //       this.$message.success(msg);
      //     }
      //     //登录不成功
      //     else {
      //       //提示成功信息
      //       this.$message.warning(msg);
      //     }
      //   });
    },
  },
};
</script>
<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 弹性盒布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>