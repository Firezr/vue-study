<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      form: this,
    };
  },
  data() {
    return {};
  },
  props: {
    model: {
      type: Object,
      default: null,
    },
    rules: {
      type: Object,
      default: null,
    },
  },
  methods: {
    validate(callback) {
      let arr = this.$children
        .filter((item) => item.prop)
        .map((item) => item.validate());

      Promise.all(arr)
        .then(() => {
          callback(true);
        })
        .catch(() => {
          callback(false);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>