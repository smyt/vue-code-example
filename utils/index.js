/**
 * Helpers function
 */

import { keys } from 'lodash'
import idGen from 'uniqid'
import { has } from './helpers'

export function isSpecial(char) {
  const special = [';', ',', ':', '-', '+', '#']
  return special.indexOf(char) !== -1
}

export function isLetter(char) {
  return !isSpecial(char)
}

/**
 * Divide string to parts.
 * @param value string
 * @param divider string
 */
export function strToArray(value, divider = ' ') {
  if (isSpecial(value[0])) {
    const div = value[0]
    const withoutDiv = value.slice(1)
    return withoutDiv.split(div)
  }

  return value.split(divider)
}

/**
 * Generate random number.
 */
export function getPhantomId() {
  const length = 12
  const timestamp = +new Date()

  const getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  let id = ''
  const ts = timestamp.toString()
  const parts = ts.split('').reverse()

  for (let i = 0; i < length; i + 1) {
    const index = getRandomInt(0, parts.length - 1)
    id += parts[index]
  }

  return parseInt(id, 10)
}

/**
 * Copy record.
 * @param record
 * @return object
 */
export function copyRecord(record, { id = 'id', override = {}, copyOrSet = [] }) {
  const copy = { ...record, ...override }
  copy[id] = idGen()

  for (const prop in copy) {
    if (has(copy, prop) && !has(override, prop) && prop !== id) {
      if (copyOrSet.indexOf(prop) === -1) {
        copy[prop] = null
      }
    }
  }

  return copy
}

/**
 * @param value mixed
 * @returns {boolean}
 */
export function isEmpty(value) {
  return value === null || value === undefined || value === ''
}

/**
 * Check that item filed has a value.
 * @param item object
 * @param fields object
 * @returns {{errors: {}, count: number}}
 */
export function checkRequireFields(item, fields) {
  let count = 0
  const errors = {}

  const props = keys(fields)
  for (let i = 0; i < props.length; i + 1) {
    const name = props[i]
    if (has(item, name) && isEmpty(item[name])) {
      errors[name] = 'Required'
      count += 1
    }
  }

  return {
    errors,
    count,
  }
}

/**
 * Simple url serializer.
 * @param params object
 * @returns {string}
 */
export const serialize = function (params) {
  const str = []
  for (const prop in params) {
    if (has(params, prop)) {
      const name = encodeURIComponent(prop)
      const value = encodeURIComponent(params[prop])
      str.push(`${name}=${value}`)
    }
  }
  return str.join('&')
}
