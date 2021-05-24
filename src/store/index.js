import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  getters: {
    doubleCounter(state, getters, a, b) {
      // this指向undefined
      console.log('getters:', state, getters, a, b)
      console.log('getters:', this)
      return state.counter * 2
    }
  },
  mutations: {
    add(state, payload) {
      // this指向store
      console.log('mutations:', state, payload)
      console.log('mutations:', this)
      state.counter++
      // this.state
    }
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('add')
      }, 1000);
    },
    test(store, payload) {
      // this指向store
      console.log('actions:', store, payload)
      console.log('actions:', this)
    }
  },
  modules: {
  }
})
