<template>
  <input :type="type" :value="val" @change="onChange" />
</template>

<script>
//  mixin + 声明componentName
//  dispatch
import emitter from "@/mixins/emitter";

export default {
  mixins: [emitter],
  model: {
      prop: 'val',
      event: 'change'
  },
  props: {
    type: {
      type: String,
      default: "text",
    },
    val: {
      type: String,
      default: "",
    },
  },
  methods: {
    onChange(e) {
      this.$emit("change", e.target.value);

      // this.$parent.$emit('validate', e.target.value)

      // let tarCom = this.findComponent('KFormItem', this)
      // tarCom.$emit('validate', e.target.value)

      this.dispatch('KFormItem', 'validate')
    },
    findComponent(name, com) {
      console.log(this.$parent);
      let tarCom = com.$parent
      if(tarCom.$options._componentTag !== name) {
        this.findComponent(name, tarCom)
      }else{
        return tarCom
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>