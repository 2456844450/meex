function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}


function isString (str) {
  return typeof str === 'string'
}

function isUndefined(obj) {
  return typeof obj === 'undefined'
}


class Observer {
  constructor(data) {

    this.observe(data)

  }


  observe(data) {
    if (data && isObject(data)) {
      Object.keys(data).forEach(key => {
        if (key === 'getters') {
          Object.keys(data['getters']).forEach(key => {

            this.defineGexGetter(data['getters'], key, data['getters'][key], data)
          })
        }
      })
    }
  }

  defineGexGetter(obj, key, getter, store) {
    if (typeof getter !== 'function') {
      console.warn(`[gex] Getter bound to key 'store.getters.${key}' is not a function.`)
    }
    else {
      Object.defineProperty(obj, key, {
        get: this.makeComputedGetter(store, getter),
        set: this.setter
      })
    }

  }

  makeComputedGetter(store, getter) {
    return () => { return getter(store.state) }
  }

  setter () {
    throw new Error('gex getter properties are read-only.')
  }
}



class Store {
  constructor({
    state: { },
    getters: { },
    mutations: { },
    actions: { }
  } = {}) {
    this.state = state
    this.mutations = mutations
    this.actions = actions
    this.getters = getters
    new Observer(this)
  }

  triggerMutation(mutation, payload) {
    if (isString(mutation)) {
      for (let mut in this.mutations) {
        if (isUndefined(payload) && mut === mutation) {
          this.mutations[mut](this.state)
        } else if (isObject(payload) && mut === mutation) {
          this.mutations[mut](this.state, payload)
        }
      }
    }

    else if (isObject(mutation)) {
      for (let mut in this.mutations) {
        if (mut === mutation.type) {
          this.mutations[mut](this.state, mutation)
        }
      }
    }
  }

  triggerAction(action, payload) {
    if (isString(action)) {
      for (let act in this.actions) {
        if (isUndefined(payload) && act === action) {
          this.actions[act]({commit: this.commit})
        } else if (isObject(payload) && act === action) {
          this.actions[act]({commit: this.commit}, payload)
        }
      }
    } else if (isObject(action)) {
      for (let act in this.actions) {
        if (act === action.type) {
          this.actions[act]({commit:this.commit})
        }
      }
    }
  }

  commit = (mutation, payload) => {
    this.triggerMutation(mutation, payload)
  }


  dispatch(action, payload) {
    this.triggerAction(action, payload)
  }
}