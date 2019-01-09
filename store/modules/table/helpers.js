/**
 * Description of helpers.
 *
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 22.12.18 14:10
 */
import { isArray, join } from 'lodash'
import { isEmpty } from '@/utils' // eslint-disable-line import/no-unresolved

export const getLoadParams = function (getters, withPage = true) {
  const filter = {}
  if (getters.filterable) {
    const filterOptions = Object.keys(getters.filter)
    filterOptions.forEach((prop) => {
      if (!isEmpty(filterOptions[prop]) && filterOptions[prop] !== false) {
        filter[prop] = isArray(filterOptions[prop]) ? join(filterOptions[prop], ',') : filterOptions[prop]
      }
    })
  }

  const params = {
    ...filter,
  }

  if (withPage) {
    params.page = getters.page
  }

  if (getters.sortable) {
    params.sort = getters.sort
  }

  return params
}

export default {
  getLoadParams,
}
