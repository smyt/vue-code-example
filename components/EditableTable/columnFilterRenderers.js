/**
 * Description of columnFilterRenderers.
 * Different filter renderers for table columns.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 09.10.18 15:19
 */
import { isArray } from 'lodash'

/**
 * Combobox renderer.
 * @param options Object
 * @return VNode
 */
export const selectTypeRenderer = (options = {}) => (h, column, table) => {
  const {
    componentName,
    valuePropName = 'filter',
    selectOptions = {},
    ...other
  } = options

  const defSelectOptions = {
    placeholder: '',
    size: 'mini',
  }

  const prop = column.filter.field || column.prop
  const value = table[valuePropName][prop]

  return h(componentName, {
    props: {
      value,
      selectOptions: { ...defSelectOptions, ...selectOptions },
      ...other,
    },
    on: {
      'select-item': function (v) {
        table.onChangeFilter(v, prop)
      },
    },
  })
}

/**
 * Datetime picker renderer.
 * @param options Object
 * @return VNode
 */
export const datePickerRenderer = (options = {}) => (h, column, table) => {
  const { valuePropName = 'filter' } = options

  const prop = column.filter.field || column.prop
  const value = table[valuePropName][prop]

  const filterProps = {
    name: prop,
    value,
    ...options,
  }

  return h('el-date-picker', {
    props: {
      type: 'date',
      size: 'mini',
      editable: false,
      ...filterProps,
    },
    class: 'header-filter-input low-width-input',
    on: {
      input(v) {
        table.onChangeFilter(v, prop)
      },
    },
  })
}

/**
 * Text field renderer.
 * @param options Object
 * @return VNode
 */
export const textInputRenderer = (options = {}) => (h, column, table) => {
  const { valuePropName = 'filter' } = options
  const prop = column.filter.field || column.prop
  const value = table[valuePropName][prop]

  const filterProps = {
    name: prop,
    value,
    ...options,
  }

  return h('el-input', {
    props: {
      size: 'mini',
      ...filterProps,
    },
    class: 'header-filter-input',
    on: {
      input(v) {
        table.onChangeFilter(v, prop)
      },
    },
  })
}

/**
 * Custom period changer renderer.
 * @param options Object
 * @return VNode
 */
export const periodButtonRenderer = (options = {}) => (h, column, table) => {
  const { valuePropName = 'filter' } = options
  const prop = column.filter.field || column.prop
  const period = table[valuePropName][prop]

  let startDate = ''
  let endDate = ''

  if (isArray(period)) {
    [startDate, endDate] = period
  }

  const filterProps = {
    startDate,
    endDate,
    ...options,
  }

  return h('period-button', {
    props: {
      ...filterProps,
    },
    on: {
      'change-period': function (value) {
        table.onChangeFilter(value, prop)
      },
    },
  })
}
