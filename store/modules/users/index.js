/* ============
 * User module
 * ============
 */
import { merge } from 'lodash'
import tableModuleFactory from '../table'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

const table = tableModuleFactory({
  page: 1,
  sort: '-id',
  filterable: true,
})

export default {
  namespaced: true,
  ...merge({ ...table }, {
    state,
    getters,
    mutations,
    actions,
  }),
}
