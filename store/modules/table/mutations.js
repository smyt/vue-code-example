/* ============
 * Mutations for the table module
 * ============
 *
 * The mutations that are available on the table module.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 30.10.18
 */

import Vue from 'vue'
import { isString, remove } from 'lodash'
import { VIEW_MODE } from './constants'
import {
  SET_ITEMS,
  REMOVE_PHANTOM_ITEMS,
  SET_IS_LOADING,
  SET_IS_LOADED,
  SET_PAGE,
  SET_TOTAL,
  SET_SORT,
  SET_FILTER,
  RESET_FILTER,
  RESET_SELECTION,
  SELECT_RECORD,
  CHANGE_MODE,
  CHANGE_EDIT_PROPERTY,
  CHANGE_EDIT_PROPERTIES,
  SET_EDIT_ERRORS,
  CLEAR_EDIT_ERROR,
  CLEAR_EDIT_ERRORS,
  CLEAR_ALL_ERRORS,
  ADD_ERROR_FIELD,
  REMOVE_ERROR_FIELD,
  UNDO_CHANGES,
} from './mutation-types'
import { has } from '@/utils/helpers' // eslint-disable-line import/no-unresolved

export default {
  [SET_ITEMS](state, items) {
    state.items = items
  },
  [REMOVE_PHANTOM_ITEMS](state) {
    remove(state.items, item => item.id === state.editItem.id)
    state.initEditItem = {}
    state.editItem = {}
  },
  [SET_IS_LOADING](state, status) {
    state.isLoading = status
  },
  [SET_IS_LOADED](state, status) {
    state.isLoaded = status
  },
  [SET_PAGE](state, page) {
    state.page = page
  },
  [SET_TOTAL](state, total) {
    state.total = total
  },
  [SET_SORT](state, field) {
    state.sort = field
  },
  [SET_FILTER](state, payload) {
    const { field, value } = payload
    if (!has(state.filter, field)) {
      state.filter = { ...state.filter, [field]: value }
    } else {
      state.filter[field] = value
    }
    state.filtered = true
    state.page = 1
  },
  [RESET_FILTER](state) {
    state.filter = {}
    state.filtered = false
    state.page = 1
  },
  [RESET_SELECTION](state) {
    state.selection = false
  },
  [SELECT_RECORD](state, record) {
    state.selection = { ...record }
  },
  [CHANGE_MODE](state, payload) {
    const { mode, record } = payload
    state.mode = mode
    if (mode === VIEW_MODE) {
      state.initEditItem = {}
      state.editItem = {}
    } else {
      if (isString(record.id)) {
        state.items.push(record)
      }
      state.editItem = { ...record }
      state.initEditItem = { ...record }
    }
  },
  [CHANGE_EDIT_PROPERTY](state, { name, value }) {
    const index = state.items.findIndex(item => item.id === state.editItem.id)
    if (index !== -1) {
      state.editItem = { ...state.editItem, [name]: value }
      state.items[index][name] = value
    }
  },
  [CHANGE_EDIT_PROPERTIES](state, properties) {
    const index = state.items.findIndex(item => item.id === state.editItem.id)
    if (index !== -1) {
      state.editItem = { ...state.editItem, ...properties }
      state.items[index] = { ...state.editItem, ...properties }
    }
  },
  [UNDO_CHANGES](state) {
    const index = state.items.findIndex(item => item.id === state.editItem.id)
    if (index !== -1) {
      if (isString(state.editItem.id)) {
        remove(state.items, item => item.id === state.editItem.id)
      } else {
        state.items[index] = { ...state.editItem, ...state.initEditItem }
      }
    }
  },
  [SET_EDIT_ERRORS](state, errors) {
    Object.keys(errors).forEach((prop) => {
      if (has(state.editErrors, prop)) {
        state.editErrors[prop] = errors[prop]
      }
    })
  },
  [CLEAR_EDIT_ERROR](state, name) {
    if (has(state.editErrors, name)) {
      state.editErrors[name] = null
    }
  },
  [CLEAR_EDIT_ERRORS](state, fields) {
    Object.keys(fields).forEach((prop) => {
      if (has(state.editErrors, prop)) {
        state.editErrors[prop] = null
      }
    })
  },
  [CLEAR_ALL_ERRORS](state) {
    Object.keys(state.editErrors).forEach((prop) => {
      state.editErrors[prop] = null
    })
  },
  [ADD_ERROR_FIELD](state, field) {
    Vue.set(state.editErrors, field, null)
  },
  [REMOVE_ERROR_FIELD](state, field) {
    Vue.delete(state.editErrors, field)
  },
}
