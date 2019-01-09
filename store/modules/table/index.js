/* ============
 * Table module
 * ============
 *
 * Since actions, mutations and getters are simple objects without
 * deep properties we may destruct them.
 * But state is a complex object and we have to use cloneDeep function.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 30.10.18 9:10
 */

import { cloneDeep } from 'lodash'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import tableState from './state'

export default function (options) {
  const {
    filterable = false,
    pagination = true,
    page = 1,
    sortable = true,
    sort = '',
  } = options

  const state = {
    ...tableState,
    filterable,
  }

  if (pagination) {
    state.pagination = pagination
    state.page = page
  }

  if (sortable) {
    state.sortable = sortable
    state.sort = sort
  }

  return {
    namespaced: true,
    state: {
      ...cloneDeep(state),
    },
    getters: {
      ...getters,
    },
    mutations: {
      ...mutations,
    },
    actions: {
      ...actions,
    },
  }
}
