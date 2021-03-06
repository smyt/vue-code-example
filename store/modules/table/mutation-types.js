/* ============
 * Mutation types for the table module
 * ============
 *
 * The mutation types that are available on the table module.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 30.10.18 9:10
 */

export const SET_ITEMS = 'TABLE/SET_ITEMS'
export const REMOVE_PHANTOM_ITEMS = 'TABLE/REMOVE_PHANTOM_ITEMS'
export const SET_IS_LOADING = 'TABLE/SET_IS_LOADING'
export const SET_IS_LOADED = 'TABLE/SET_IS_LOADED'
export const SET_PAGE = 'TABLE/SET_PAGE'
export const SET_TOTAL = 'TABLE/SET_TOTAL'
export const SET_SORT = 'TABLE/SET_SORT'
export const SET_FILTER = 'TABLE/SET_FILTER'
export const RESET_FILTER = 'TABLE/RESET_FILTER'
export const RESET_SELECTION = 'TABLE/RESET_SELECTION'
export const SELECT_RECORD = 'TABLE/SELECT_RECORD'
export const CHANGE_MODE = 'TABLE/CHANGE_MODE'
export const CHANGE_EDIT_PROPERTY = 'TABLE/CHANGE_EDIT_PROPERTY'
export const CHANGE_EDIT_PROPERTIES = 'TABLE/CHANGE_EDIT_PROPERTIES'
export const SET_EDIT_ERRORS = 'TABLE/SET_EDIT_ERRORS'
export const CLEAR_EDIT_ERROR = 'TABLE/CLEAR_EDIT_ERROR'
export const CLEAR_EDIT_ERRORS = 'TABLE/CLEAR_EDIT_ERRORS'
export const CLEAR_ALL_ERRORS = 'TABLE/CLEAR_ALL_ERRORS'
export const ADD_ERROR_FIELD = 'TABLE/ADD_ERROR_FIELD'
export const REMOVE_ERROR_FIELD = 'TABLE/REMOVE_ERROR_FIELD'
export const UNDO_CHANGES = 'TABLE/UNDO_CHANGES'


export default {
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
}
