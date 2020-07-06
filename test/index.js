import Store from '../lib/index.js'

const state = {
  count: 0,
  categoryIndex: 10
}

const mutations = {
  increment (state) {
    state.count++
  },
  decrement (state, payload) {
    state.count -= payload.number
  }
}

const actions = {
  increment ({commit}) {
    setTimeout(() => {
      commit('increment')
      console.log(store.getters.getCount)
    }, 2000)
    
  },

  decrement ({commit}, payload) {
    setTimeout(() => {
      commit('decrement', payload)
      console.log(store.getters.getCount)
    }, 2000)
  }
}

const getters = {
  getCount: state =>{
    return state.count
  },
  getCategoryIndex: state => (number) => {
    return state.categoryIndex + number
  }
}

const store = new Store({state,mutations,actions,getters})

store.dispatch({
  type: 'increment'
})
store.dispatch({
  type: 'increment'
})
store.dispatch('decrement', {
  number: 10
})