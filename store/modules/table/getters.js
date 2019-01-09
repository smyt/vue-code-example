/* ============
 * Getters for the table module
 * ============
 *
 * The getters that are available on the table module.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 30.10.18
 */

import { EDIT_MODE } from './constants'

export default {
  items(state) {
    return state.items
  },
  isLoading(state) {
    return state.isLoading
  },
  isLoaded(state) {
    return state.isLoaded
  },
  total(state) {
    return state.total
  },
  page(state) {
    return state.page
  },
  sortable(state) {
    return state.sortable
  },
  sort(state) {
    return state.sort
  },
  filterable(state) {
    return state.filterable
  },
  filtered(state) {
    return state.filtered
  },
  filter(state) {
    return state.filter
  },
  selection(state) {
    return state.selection
  },
  isEditMode(state) {
    return state.mode === EDIT_MODE
  },
  editItem(state) {
    return state.editItem
  },
  initEditItem(state) {
    return state.initEditItem
  },
  editErrors(state) {
    return state.editErrors
  },
  editErrorsCount(state) {
    let count = 0
    const props = Object.keys(state.editErrors)
    props.forEach((prop) => {
      if (state.editErrors[prop]) {
        count += 1
      }
    })
    return count
  },
  hasError: (state) => (name) => {
    return !!state.editErrors[name]
  },
  editItemValue: (state) => (name) => {
    return state.editItem && state.editItem[name]
  },
}
