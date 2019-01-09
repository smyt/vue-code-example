/**
 * Description of UsersTransformer.
 *
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 07.11.18 13:27
 */

import Transformer from './Transformer'

export default class UsersTransformer extends Transformer {

  /**
   * @inheritDoc
   */
  static fetch(item) {
    return {
      ...item,
    }
  }

  /**
   * @inheritDoc
   */
  static send(item) {
    return {
      ...item,
    }
  }
}
