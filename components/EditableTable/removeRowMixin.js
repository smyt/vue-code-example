/**
 * Description of remove-row-mixin.
 * Mixin which show message before delete record from table.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 26.10.18 8:53
 */

import { showMessage, showWarning } from '@/utils/messages'

export default {
  methods: {
    removeRecord() {
      const me = this
      if (!me.selection) {
        showWarning('Для удаления записи необходимо выбрать запись в таблице.')
      } else {
        me.$confirm('Данное действие навсегда удалит текущую запись. Продолжить?', 'Внимание', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Отмена',
          type: 'warning',
        }).then(() => {
          me.remove().then((data) => {
            if (data && data.success) {
              const msg = data.message || 'Запись успешно удалена.'
              showMessage(msg)
            }
          })
        }).catch(() => {
          showMessage('Удаление записи отменено.')
        })
      }
    },
  },
}
