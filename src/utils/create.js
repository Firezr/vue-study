import Vue from 'vue'
import Notice from '../components/Notice'


// function create(Component, props) {
//   const vm = new Vue({
//     render: h => {
//       return h(Component, { props })
//     }
//   }).$mount()

//   document.body.appendChild(vm.$el)

//   const comp = vm.$children[0]
//   comp.remove = function () {
//     document.body.removeChild(vm.$el)
//     vm.$destroy()
//   }

//   return comp
// }
// export default create


function create(Component, props) {
  let Constr = Vue.extend(Component)
  let comp = new Constr({ propsData: props })
  comp.$mount()

  document.body.appendChild(comp.$el)

  comp.remove = function () {
    document.body.removeChild(comp.$el)
    comp.$destroy()
  }

  return comp
}
export default {
  install(Vue) {
    Vue.prototype.$notice = (options) => {
      return create(Notice, options)
    }
  }
}
