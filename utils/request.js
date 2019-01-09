/**
 * Setup Axios interceptors
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, getCsrf } from '@/utils/auth'
import {
  MESSAGE_DURATION,
  AJAX_TIMEOUT,
  REMOTE_DEBUG_ID,
} from './constants'
import { showError } from './messages'

const token = getCsrf()

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: AJAX_TIMEOUT,
})

if (!!token) {
  service.defaults.headers.common = {
    ['X-Requested-With']: 'XMLHttpRequest',
    ['X_CSRFTOKEN']: token,
  }
}

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }

    if (REMOTE_DEBUG_ID) {
      config.params = {
        ['XDEBUG_SESSION_START']: REMOTE_DEBUG_ID,
        ...config.params,
      }
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    const successStatuses = [200, 201, 204]
    if (successStatuses.indexOf(response.status) === -1) {
      showError(res.message)
      return Promise.reject({ success: false, errorText: res.errorText })
    }

    return response.data
  },
  (error) => {
    const resp = error.response
    let { message } = error.message
    if (resp && resp.data) {
      message = resp.data.errors.errorText
    }
    showError(message)
    return Promise.reject(resp.data)
  },
)

export default service
