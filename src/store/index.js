import {createStore} from 'vuex'
import todo from './todo'
import common from './common'

export default createStore({
  ...common,
  modules: {
    todoStore: {
      namespaced: true,
      ...todo
    }
  }
})
