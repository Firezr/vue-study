<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Form',
  componentName: 'Form',
  provide() {
    return {
      form: this,
    };
  },
  data() {
    return {};
  },
  created() {
    this.fields = []
    
    this.$on("el.form.addField", (field) => {
      if (field) {
        this.fields.push(field);
      }
    });
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
      // let arr = this.$children
      //   .filter((item) => item.prop)
      //   .map((item) => item.validate());

      let arr = this.fields.map((item) => item.validate())
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