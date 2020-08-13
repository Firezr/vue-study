<template>
  <KForm :model="userInfo" :rules="rules" ref='loginForm'>
    <KFormItem label="用户名" prop="username">
      <KInput v-model="userInfo.username"> </KInput>
    </KFormItem>
    <KFormItem label="密码" prop="password">
      <KInput v-model="userInfo.password"> </KInput>
    </KFormItem>
    <div>
      <button @click='login'>登录</button>
    </div>
  </KForm>
</template>

<script>
import KForm from "./KForm";
import KFormItem from "./KFormItem";
import KInput from "./KInput";
import Notice from "../Notice";
export default {
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入用户名称" }],
        password: [{ required: true, message: "请输入密码" }],
      },
    };
  },
  components: {
    KForm,
    KFormItem,
    KInput,
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate(valid => {
        const notice = this.$create(Notice, {
          title: "12345",
          message: valid ? "请求登录!" : "校验失败!",
          duration: 2000
        });
        notice.show();
        // if (valid) {
        //   alert("submit");
        // } else {
        //   alert("error submit!");
        //   return false;
        // }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>