/* ============
 * Actions for the equipments module
 * ============
 *
 * The actions that are available on the equipments module.
 */

import { copyRecord } from '@/utils'
import idGen from 'uniqid'
import moment from 'moment'
import api from '@/api/config'
import Transformer from '@/transformers/UsersTransformer'

/**
 * Proxy configuration object.
 */
const usersProxy = {
  url: api.usersUrl,
  transformer: Transformer,
}

/**
 * Override action that add proxy to the table.
 * @returns {{url: string, needTransform: boolean, transformer: Transformer}}
 */
export const $_GetProxy = () => usersProxy

export default {
  $_GetProxy,
}
