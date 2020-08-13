import Vue from 'vue'

export default function create(Component, props) {
  const vm = new Vue({
    render: h => {
      return h(Component, { props })
    }
  }).$mount()

  document.body.appendChild(vm.$el)

  const comp = vm.$children[0]

  comp.remove = function () {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }

  return comp
}