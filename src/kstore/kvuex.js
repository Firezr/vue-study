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
    this._getters = options.getters


    //定义computed选项
    let computed = {}
    this.getters = {}
    
    //  { doubleCounter（state）{} }
    let store = this
    Object.keys(this._getters).forEach(key => {
      // 获取用户定义的getter
      let fn = store._getters[key]
      // 转换为computed可以使用无参数形式
      computed[key] = function () {
        return fn(store.state)
      }
      // 为getters定义只读属性
      Object.defineProperty(store.getters, key, {
        get() {
          return store._vm[key]
        }
      })
    });

    // 响应化处理state
    this._vm = new Vue({
      data: {
        // 加两个$，Vue不做代理
        $$state: options.state,
      },
      computed
    })
    
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  get state() {
    // console.log(this._vm);
    return this._vm.$data.$$state
  }
  set state(data) {
    console.error('not permit');
  }
  commit(type, payload) {
    let mutation = this._mutations[type]
    mutation && mutation(this.state, payload)
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