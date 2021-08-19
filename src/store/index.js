import {createStore} from 'vuex'
import todoStore from './todoStore'

export default createStore({
  modules: {
    todoStore: {
      namespaced: true,
      ...todoStore
    }
  }
})
