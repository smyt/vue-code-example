/**
 * Description of Transformer.
 *
 * Transformers are used to transform the fetched data
 * to a more suitable format.
 * For instance, when the fetched data contains snake_cased values,
 * they will be camelCased
 *
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 07.11.18 13:26
 */
/* ============
 * Transformer
 * ============
 *
 * The base transformer.
 *
 * Transformers are used to transform the fetched data
 * to a more suitable format.
 * For instance, when the fetched data contains snake_cased values,
 * they will be camelCased.
 */

export default class Transformer {
  /**
   * Method used to transform a fetched collection.
   *
   * @param items The items to be transformed.
   *
   * @returns {Array} The transformed items.
   */
  static fetchCollection(items) {
    return items.map(item => this.fetch(item))
  }

  /**
   * Method used to transform a collection to be send.
   *
   * @param items The items to be transformed.
   *
   * @returns {Array} The transformed items.
   */
  static sendCollection(items) {
    return items.map(item => this.send(item))
  }

  /**
   * Method used to transform a fetched item.
   * @param item The fetched item.
   * @returns {Object} The transformed item.
   */
  static fetch(item) {
    throw new Error('This static method is abstract. You need to develop it in your child class.')
  }

  /**
   * Method used to transform a post item request.
   * @param item The item to be send.
   * @returns {Object} The transformed item.
   */
  static send(item) {
    throw new Error('This static method is abstract. You need to develop it in your child class.')
  }

  /**
   * Method used to transform a put item request.
   * @param item The item to be send.
   * @returns {Object} The transformed item.
   */
  static patch(item) {
    throw new Error('This static method is abstract. You need to develop it in your child class.')
  }
}
