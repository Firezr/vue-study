<template>
  <input :type="type" :value="val" @change="onChange" />
</template>

<script>
export default {
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

      this.$parent.$emit('validate', e.target.value)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>