<template>
  <div>
    <label for>{{label}}</label>:
    <slot></slot>

    <div>{{error}}</div>
  </div>
</template>

<script>
import Schema from "async-validator";
export default {
  inject: ["form"],
  data() {
    return {
      error: "",
    };
  },
  created() {
    this.$on("validate", this.validate);
  },
  props: {
    prop: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  methods: {
    validate() {
      // 获取对应FormItem校验规则
      const rules = this.form.rules[this.prop]; 
      // 获取校验值
      const value = this.form.model[this.prop]; 
      // 校验描述对象
      const descriptor = { [this.prop]: rules }; 
      // 创建校验器
      const schema = new Schema(descriptor);
      // 返回Promise，没有触发catch就说明验证通过
      return schema.validate({ [this.prop]: value }, (errors) => {
        if (errors) {
          // 将错误信息显示
          this.error = errors[0].message;
        } else {
          // 校验通过
          this.error = "";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>