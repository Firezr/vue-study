let Vue

function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

class Store {
  constructor(options) {
    this.options = options

    this._mutations = options.mutations
    this._actions = options.actions

    this._vm = new Vue({
      data: {
        // 加两个$，Vue不做代理
        $$state: options.state
      }
    })
    

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  get state() {
    console.log(this._vm);
    return this._vm.$data.$$state
  }
  set state(data) {
    console.error('not permit');
  }
  commit(type, payload) {
    let mutation = this._mutations[type]
    mutation && mutation(this, payload)
  }
  dispatch(type, payload) {
    let action = this._actions[type]
    action && action(this, payload)
  }

}

export default {
  install,
  Store
}