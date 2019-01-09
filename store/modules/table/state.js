/* ============
 * State of the table module
 * ============
 *
 * The initial state of the table module.
 */

import { VIEW_MODE } from './constants'

export default {

  /**
   * Table records
   */
  items: [],
  isLoading: false,
  isLoaded: false,

  /**
   * Pagination props
   */
  pagination: false,
  page: 0,
  total: 0,

  /**
   * Sorting props
   */
  sortable: false,
  sort: {},

  /**
   * Filtering props
   */
  filterable: false,
  filtered: false,
  filter: {},

  /**
   * Selection and editing props
   */
  selection: false,
  initEditItem: {},
  editItem: {},
  editErrors: {},

  /**
   * Table mode (viewing ar editing)
   */
  mode: VIEW_MODE,
}
