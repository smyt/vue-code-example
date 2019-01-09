import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users'

Vue.use(Vuex)

const store = new Vuex.Store({
  /**
   * Assign the modules to the store.
   */
  modules: {
    users,
  },
  /**
   * If strict mode should be enabled.
   */
  strict: false,

  /**
   * Plugins used in the store.
   */
  // plugins: debug ? [createLogger()] : [],
})

export default store
