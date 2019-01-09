/**
 * Description of rowEditors.
 *
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 30.10.18
 */

/**
 * Editor creator for text fields.
 * @param options
 * @returns {{componentName: string, options: {value: *}, listeners: {}}}
 */
export const simpleEditor = (options) => {
  const defInputOptions = {
    size: 'mini',
  }

  const {
    state,
    field,
    handler,
    component = 'el-input',
    inputOptions = {},
    ...rest
  } = options

  if (!field || !handler) {
    throw new Error('You must set state and handler properties.')
  }

  return {
    componentName: component,
    ...rest,
    options: {
      value: state && state[field],
      ...{ ...defInputOptions, ...inputOptions },
    },
    listeners: {
      input: e => handler({ name: field, value: e }),
    },
  }
}

/**
 * Editor creator for number fields.
 * @param options
 * @returns {{componentName: string, options: {value: *}, listeners: {}}}
 */
export const numberEditor = (options) => {
  const defInputOptions = {
    size: 'mini',
    min: 0,
    precision: 2,
    controls: false,
    step: 0.1,
    style: {
      width: '60px',
    },
  }

  const {
    component = 'el-input-number',
    inputOptions = {},
    ...rest
  } = options

  return simpleEditor({
    component,
    inputOptions: {
      ...{ ...defInputOptions, ...inputOptions },
    },
    ...rest,
  })
}

/**
 * Editor creator for simple select fields.
 * @param options
 * @returns {{componentName: string, options: {value: *}, listeners: {}}}
 */
export const selectEditor = (options) => {
  const defSelectOptions = {
    size: 'mini',
  }

  const {
    state,
    field,
    handler,
    items,
    updated = false,
    component = 'base-select',
    selectOptions = {},
    ...rest
  } = options

  if (!field || !handler) {
    throw new Error('You must set state and handler properties.')
  }

  return {
    componentName: component,
    options: {
      value: state && state[field],
      items,
      selectOptions: {
        ...{ ...defSelectOptions, ...selectOptions },
      },
      ...rest,
    },
    updated,
    listeners: {
      ['select-item']: e => handler({ name: field, value: e }),
    },
  }
}

/**
 * Editor creator for date fields.
 * @param options
 * @returns {{componentName: string, options: {value: *}, listeners: {}}}
 */
export const dateEditor = (options) => {
  const defDateOptions = {
    editable: false,
    clearable: false,
    size: 'mini',
    pickerOptions: {
      firstDayOfWeek: 1,
    },
    style: { width: '120px' },
  }

  const {
    value,
    state,
    field,
    handler,
    component = 'el-date-picker',
    dateOptions = {},
    ...rest
  } = options

  if ((!value || !field) && !handler) {
    throw new Error('You must set state and handler properties.')
  }

  const dateValue = value !== undefined ? value : state && state[field]

  return {
    componentName: component,
    ...rest,
    options: {
      value: dateValue,
      ...{ ...defDateOptions, ...dateOptions },
    },
    listeners: {
      input: e => handler({ name: field, value: e }),
    },
  }
}
