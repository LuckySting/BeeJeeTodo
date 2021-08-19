import {createStore} from 'vuex'
import todo from './todo'
import auth from './auth'

export default createStore({
  modules: {
    todo: {
      namespaced: true,
      ...todo
    },
    auth: {
      namespaced: true,
      ...auth
    }
  }
})
