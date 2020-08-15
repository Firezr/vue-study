let Vue

class KVuerouter {
  constructor(options) {
    this.options = options

    this.routeMap = {}
    let routes = this.options.routes
    routes.forEach(item => this.routeMap[item.path] = item.component)

    //current响应式，current变化，依赖的组件(router-view)重新render
    this.vm = new Vue({
      data() {
        return {
          // current: '/'
          current: location.hash.slice(1)
        }
      }
    })


    window.addEventListener('hashchange', () => {
      this.vm.current = location.hash.slice(1)
    })
  }

  static install(_Vue) {
    Vue = _Vue

    Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          Vue.prototype.$router = this.$options.router
        }
      }
    })

    Vue.component('router-link', {
      props: {
        to: {
          type: String,
          required: true
        },
      },
      render(h) {
        console.log(this);
        return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
      }
    })
    Vue.component('router-view', {
      render(h) {
        console.log(this.$router.vm.current);

        let {routeMap, vm} = this.$router
        return h(routeMap[vm.current])
      }
    })
  }
}

export default KVuerouter