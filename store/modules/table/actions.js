/* ============
 * Actions for the table module
 * ============
 *
 * The actions that are available on the equipments module.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 30.10.18
 */
import { keys, isNumber } from 'lodash'
import moment from 'moment'
import * as types from './mutation-types'
import { getItems, saveItem } from '@/api/common' // eslint-disable-line import/no-unresolved
import { VIEW_MODE, EDIT_MODE } from './constants'
import { checkRequireFields, serialize } from '@/utils' // eslint-disable-line import/no-unresolved
import { DATE_FORMAT } from '@/utils/constants' // eslint-disable-line import/no-unresolved
import { API_URL } from '@/api/config' // eslint-disable-line import/no-unresolved
import { getLoadParams } from './helpers' // eslint-disable-line import/no-unresolved

/**
 * Private functions
 */

/**
 * Load records from server. We use proxy object which
 * contains url and other information about resource.
 * @param commit
 * @param getters
 * @param proxy
 * @returns {Promise.<void>}
 */
export const $_LoadInternal = async ({ commit, getters }, { proxy }) => {
  commit(types.SET_IS_LOADING, true)

  const params = getLoadParams(getters)

  try {
    const response = await getItems(proxy.url, params)
    const { records, totalCount } = response

    commit(types.SET_ITEMS, proxy.transformer.fetchCollection(records))
    commit(types.SET_TOTAL, totalCount)
    commit(types.SET_IS_LOADING, false)
    commit(types.SET_IS_LOADED, true)
    commit(types.RESET_SELECTION, false)
  } catch (e) {
    commit(types.SET_IS_LOADING, false)
  }
}

/**
 *
 * @param commit
 * @param getters
 * @param proxy
 * @param data
 * @returns {Promise.<{record: *, success}>}
 */
export const $_SaveInternal = async ({ commit, getters }, { proxy, data }) => {
  commit(types.SET_IS_LOADING, true)

  try {
    const isNew = !isNumber(data.id)

    let method
    let url
    let inc = 0

    if (isNew) {
      method = 'POST'
      url = `${proxy.url}/`
      inc = 1
    } else {
      method = 'PUT'
      url = `${proxy.url}/${data.id}/`
    }

    const item = proxy.transformer.send(data)
    const response = await saveItem(url, method, item)
    const { record, success } = response
    const { total, items } = getters
    const trRecord = proxy.transformer.fetch(record)
    const index = items.findIndex(node => node.id === data.id)

    items[index] = { ...trRecord }

    commit(types.SET_ITEMS, items)
    commit(types.SET_TOTAL, total + inc)
    commit(types.CLEAR_ALL_ERRORS)
    commit(types.CHANGE_MODE, { mode: VIEW_MODE })
    commit(types.SET_IS_LOADING, false)

    return {
      record: trRecord,
      success,
    }
  } catch (e) {
    commit(types.SET_IS_LOADING, false)
    return false
  }
}

/**
 *
 * @param commit
 * @param getters
 * @param proxy
 * @param data
 * @returns {Promise.<{record: *, success}>}
 */
export const $_UpdateInternal = async ({ commit, getters }, { proxy, data }) => {
  commit(types.SET_IS_LOADING, true)

  try {
    const url = `${proxy.url}/${data.id}/`
    const item = proxy.transformer.patch(data)
    const response = await saveItem(url, 'PATCH', item)
    const { record, success } = response
    const { items } = getters
    const trRecord = proxy.transformer.fetch(record)
    const index = items.findIndex(node => node.id === data.id)

    items[index] = { ...trRecord }

    commit(types.SET_ITEMS, items)
    commit(types.CLEAR_ALL_ERRORS)
    commit(types.CHANGE_MODE, { mode: VIEW_MODE })
    commit(types.SET_IS_LOADING, false)

    return {
      record: trRecord,
      success,
    }
  } catch (e) {
    commit(types.SET_IS_LOADING, false)
    return false
  }
}

/**
 * Private method for removing record request
 * @param commit
 * @param getters
 * @param proxy
 * @param data
 * @returns {Promise.<*>}
 */
export const $_RemoveInternal = async ({ commit, getters }, { proxy, data }) => {
  commit(types.SET_IS_LOADING, true)

  try {
    const url = `${proxy.url}/${data.id}`
    await saveItem(url, 'DELETE', proxy.transformer.send(data))

    const { total, items } = getters
    const records = items.filter(item => item.id !== data.id)

    commit(types.SET_ITEMS, records)
    commit(types.SET_TOTAL, total - 1)
    commit(types.SET_IS_LOADING, false)

    return { success: true, message: 'Запись успешно удалена.' }
  } catch (err) {
    commit(types.SET_IS_LOADING, false)
    return err
  }
}

/**
 *
 * @param commit
 * @param getters
 * @param proxy
 * @returns {Promise.<void>}
 */
export const $_CreateReport = async ({ commit, getters }, { proxy }) => {
  commit(types.SET_IS_LOADING, true)
  const params = getLoadParams(getters, false)
  try {
    const urlParams = serialize(params)
    window.open(`${API_URL}${proxy.url}.xlsx?${urlParams}`) // eslint-disable-line no-undef
    commit(types.SET_IS_LOADING, false)
  }
  catch (e) {
    commit(types.SET_IS_LOADING, false)
  }
}

/**
 * Fabric method to create Proxy to load and save table data.
 */
export const $_GetProxy = () => {
  throw new Error('You need to create override method $_GetProxy.')
}

/**
 * Public functions
 */

export const LoadItems = ({ dispatch }) => dispatch('$_GetProxy')
  .then(proxy => dispatch('$_LoadInternal', { proxy }))
  .catch(e => console.error(e)) // eslint-disable-line no-console

export const UpdateItem = ({ dispatch, getters }) => dispatch('$_GetProxy')
  .then(proxy => dispatch('$_UpdateInternal', { proxy, data: getters.editItem }))
  .catch(e => console.error('$_GetProxy error', e)) // eslint-disable-line no-console

export const SaveItem = ({ dispatch, getters }) => dispatch('$_GetProxy')
  .then(proxy => dispatch('$_SaveInternal', { proxy, data: getters.editItem }))
  .catch(e => console.error('$_GetProxy error', e)) // eslint-disable-line no-console

export const RemoveItem = ({ dispatch, getters }) => dispatch('$_GetProxy')
  .then(proxy => dispatch('$_RemoveInternal', { proxy, data: getters.selection }))
  .catch(e => console.error(e)) // eslint-disable-line no-console

export const AddItem = ({ commit }, record) => {
  commit(types.CHANGE_MODE, { mode: EDIT_MODE, record })
}

export const EditItem = ({ commit, getters }) => {
  if (getters.selection && getters.canEdit) {
    commit(types.CHANGE_MODE, { mode: EDIT_MODE, record: getters.selection })
  }
}

export const CancelItem = ({ commit }) => {
  commit(types.UNDO_CHANGES)
  commit(types.CHANGE_MODE, { mode: VIEW_MODE })
  commit(types.CLEAR_ALL_ERRORS)
}

export const ValidateItem = ({ dispatch, getters }) => {
  const { item, editErrors } = getters
  const { errors, count } = checkRequireFields(item, editErrors)
  dispatch('ClearErrors')
  if (count > 0) {
    dispatch('SetEditErrors', errors)
  }
  return {
    errors,
    count,
  }
}

export const SelectItem = ({ commit }, payload) => {
  commit(types.SELECT_RECORD, payload)
}

export const CreateReport = ({ dispatch }) => dispatch('$_GetProxy')
  .then(proxy => dispatch('$_CreateReport', { proxy }))
  .catch(e => console.error(e)) // eslint-disable-line no-console

export const ChangePage = ({ commit, dispatch }, page) => {
  commit(types.SET_PAGE, page)
  dispatch('LoadItems')
}

export const ChangeSort = ({ commit, dispatch }, options) => {
  if (options.prop) {
    commit(types.SET_SORT, options.order === 'ascending' ? options.prop : `-${options.prop}`)
  } else {
    commit(types.SET_SORT, null)
  }
  dispatch('LoadItems')
}

export const ChangeFilter = ({ commit, dispatch }, payload) => {
  commit(types.SET_FILTER, payload)
  dispatch('LoadItems')
}

export const ResetFilter = ({ commit, dispatch }) => {
  commit(types.RESET_FILTER)
  dispatch('LoadItems')
}

export const ChangeProperty = ({ commit }, { name, value }) => {
  commit(types.CHANGE_EDIT_PROPERTY, { name, value })
  commit(types.CLEAR_EDIT_ERROR, name)
}

export const ChangeProperties = ({ commit }, properties) => {
  commit(types.CHANGE_EDIT_PROPERTIES, properties)
  commit(types.CLEAR_EDIT_ERRORS, keys(properties))
}

export const ChangeDateProperty = ({ commit }, { name, value }) => {
  const date = moment.isDate(value) ? moment(value).format(DATE_FORMAT) : ''
  commit(types.CHANGE_EDIT_PROPERTY, { name, value: date })
  commit(types.CLEAR_EDIT_ERROR, name)
}

export const SetEditErrors = ({ commit }, errors) => {
  commit(types.SET_EDIT_ERRORS, errors)
}

export const ClearErrors = ({ commit }) => {
  commit(types.CLEAR_ALL_ERRORS)
}

export default {
  $_LoadInternal,
  $_SaveInternal,
  $_RemoveInternal,
  $_UpdateInternal,
  $_CreateReport,
  $_GetProxy,
  LoadItems,
  AddItem,
  EditItem,
  RemoveItem,
  CancelItem,
  SaveItem,
  UpdateItem,
  ValidateItem,
  SelectItem,
  CreateReport,
  ChangePage,
  ChangeSort,
  ChangeFilter,
  ResetFilter,
  ChangeProperty,
  ChangeProperties,
  ChangeDateProperty,
  SetEditErrors,
  ClearErrors,
}
