/**
 * Base api request
 */
import request from '@/utils/request'
import { serialize } from '@/utils'
import { API_URL } from './config'

/**
 * Send get request to the server.
 * @param url string
 * @param params get params
 */
export function getItems(url, params) {
  return request({
    url,
    method: 'GET',
    params,
  })
}

/**
 * Send request to the server to save changes.
 * @param url string
 * @param method string (POST, PUT, PATCH, DELETE)
 * @param data object
 */
export function saveItem(url, method, data) {
  return request({
    url,
    method,
    data,
  })
}

/**
 * Get report link.
 * @param url
 * @param params
 */
export function createReport(url, params) {
  const urlParams = params ? '?' + serialize(params) : ''
  window.open(`${API_URL}${url}/${urlParams}`)
}
