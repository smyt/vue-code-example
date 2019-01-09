<template>
  <div>
    <el-row v-if="buttons.length > 0">
      <div class="toolbar">
        <div class="left-buttons">
          <template v-for="button in leftButtons">
            <slot :button="button"></slot>
          </template>
        </div>
        <div class="right-buttons">
          <template v-for="button in rightButtons">
            <slot :button="button"></slot>
          </template>
        </div>
      </div>
    </el-row>
    <el-row>
      <el-table
              ref="table"
              :data="data"
              v-loading="isLoading"
              element-loading-text="Загрузка..."
              v-bind="tableOptions"
              @sort-change="onSortChange"
              @row-click="onSelect"
              @row-dblclick="onEdit"
              @current-change="onCurrentChange"
      >
        <el-table-column v-for="(item, index) in columns"
                         class-name="e-table-cell__no__break__words"
                         :key="item.prop"
                         v-bind="item"
                         :render-header="renderHeader"
        >
          <template slot-scope="scope">
            <template
                    v-if="showCellEditor(item, scope)"
            >
              <component :is="item.editor.componentName"
                         v-bind="item.editor.options"
                         v-on="item.editor.listeners"
              >
              </component>
            </template>
            <template v-else-if="item.renderer">
              <div v-html="renderCell(scope, item)"></div>
            </template>
            <template v-else>
              {{ scope.row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <div class="table-footer">
      <div class="pagination">
        <el-row v-if="withPagination">
          <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :current-page="page"
                  :total="total"
                  :disabled="isEditMode"
                  :page-size="20"
                  @current-change="onChangePage"
          >
          </el-pagination>
        </el-row>
      </div>
      <div class="save-buttons" v-if="isEditMode">
        <el-button
                size="mini"
                @click="handleSave">
          Сохранить [ENTER]
        </el-button>
        <el-button
                size="mini"
                type="danger"
                @click="handleCancel">
          Отмена [ESC]
        </el-button>

        <slot name="errors"></slot>

      </div>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import { debounce, delay, isFunction, isArray, isNumber, isString } from 'lodash'
  import { strToArray } from '@/utils'
  import {
    selectTypeRenderer,
    datePickerRenderer,
    textInputRenderer
  } from './columnFilterRenderers'

  /**
   * Base table component with editable rows and different filters.
   */
  export default {
    name: 'EditableTable',
    props: {
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      },
      editable: {
        type: Boolean,
        default: false
      },
      isEditMode: {
        type: Boolean,
        default: false
      },
      editItem: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      total: {
        type: Number,
        default: 0
      },
      withPagination: {
        type: Boolean,
        default: true
      },
      page: {
        type: Number,
        default: 1
      },
      filter: {
        type: Object,
      },
      isFilterDelayed: {
        type: Boolean,
        default: true
      },
      filterDelay: {
        type: Number,
        default: 500
      },
      buttons: {
        type: Array,
        default: () => []
      },
      tableOptions: {
        type: Object,
        default: () => {
          return {
            fit: true,
            border: true,
            highlightCurrentRow: true,
            emptyText: 'Нет данных'
          }
        }
      },
      isBlockEditing: {
        type: Boolean,
        default: false
      },
      canEditRow: {
        type: Function,
        default: () => {
          return true
        }
      }
    },
    data() {
      return {
        columnEditorRefs: [],
        focusInputRef: '',
        debounceProcess: false,
        addingProcess: false,
        currentRow: null
      }
    },
    computed: {
      leftButtons() {
        return this.buttons.filter(item => !item.align || item.align === 'left')
      },
      rightButtons() {
        return this.buttons.filter(item => item.align === 'right')
      }
    },
    methods: {
      onChangePage(page) {
        this.$emit('change-page', page)
      },
      onSortChange(options) {
        const me = this
        const column = me.columns.find(item => item.prop === options.prop)
        const prop = column && column.sort ? column.sort : options.prop
        me.$emit('change-sort', { ...options, prop })
      },
      onChangeFilter(value, field) {
        const me = this
        const column = me.columns.find(item => item.prop === field || (item.filter && item.filter.field === field))
        if (column) {
          const fieldName = column.filter.field || field
          if (me.isFilterDelayed && column && column.filter.type === 'simple') {
            me.debounceProcess = true
            me._debouceChangeFilter(value, fieldName)
          }
          else {
            me.emitChangeFilter(value, fieldName)
          }
        }
      },
      onSelect(row) {
        this.$emit('select', row)
      },
      onCurrentChange(currentRow) {
        this.currentRow = currentRow
      },
      onEdit(row) {
        if (!this.isEditMode) {
          this.$emit('edit', row)
        }
      },
      emitChangeFilter(value, field) {
        this.$emit('change-filter', { field, value })
      },
      resetFilter() {
        this.$emit('reset-filter')
      },
      handleAdd() {
        this.$emit('add')
      },
      handleSave() {
        this.$emit('save')
      },
      handleCancel() {
        this.$emit('cancel')
      },
      isRowEdit(id) {
        return this.editItem.id && this.editItem.id === id
      },
      showCellEditor(item, scope) {
        const me = this
        let canEdit = true

        const cond1 = me.isEditMode && item.editor && me.editItem && scope.row.id == me.editItem.id
        if (cond1) {
          canEdit = me.canEditRow(item, scope)
        }
        return cond1 && canEdit && ((!me.isPhantom(scope.row) && item.editor.updated) || me.isPhantom(scope.row))
      },
      isPhantom(record) {
        return isString(record.id)
      },
      getColumnItem(column) {
        return this.columns.find(item => item.prop === column.property)
      },
      renderHeader(h, { column }) {
        const me = this
        const headerItems = []
        const columnItem = me.getColumnItem(column)
        let headerEvents

        headerItems.push(me.getCaption(h, columnItem))

        const filter = me.getFilterByType(h, columnItem)
        if (filter) {
          headerItems.push(filter)
          headerEvents = {
            on: {
              click(e) {
                if (e.target.nodeName === 'INPUT') {
                  e.stopPropagation()
                }
              }
            }
          }
        }

        return h('div', {
          class: 'custom-header',
          ...headerEvents
        }, headerItems)
      },
      renderCell(scope, column) {
        const { renderer } = column
        return renderer ? renderer(scope, column) : scope.row[column.prop]
      },
      getCaption(h, column) {
        let header
        if (column && column.isMultiline) {
          const nameParts = strToArray(column.label)
          header = []
          if (nameParts.length > 1) {
            header = nameParts.map(part => h('span', { class: 'caption-part' }, part))
          } else {
            header.push(h('span', { class: 'caption-part-single' }, column.prop))
          }
          return h('div', { class: 'multiple-row' }, header)
        }
        return h('span', { class: 'caption-part-single' }, column.label)
      },
      getFilterByType(h, column) {
        const me = this
        let filterItem = false
        const { filter } = column
        if (filter) {
          const { type, options = {} } = filter
          if (type === 'simple') {
            filterItem = textInputRenderer(options)(h, column, me)
          }
          else if (type === 'date') {
            filterItem = datePickerRenderer(options)(h, column, me)
          }
          else if (type === 'custom') {
            return options.renderCustomFilter(h, column, me)
          }
        }
        return filterItem
      },
      setEditorRefs() {
        const me = this
        me.columns.forEach(column => {
          if (column.editor && column.editor.options && column.editor.options.ref) {
            me.columnEditorRefs.push(column.editor.options.ref)
          }
        })
      },
      getFirstFocusInputRef() {
        return this.columnEditorRefs.length > 0 ? this.columnEditorRefs[0] : ''
      },
      getNextFocusInputRef() {
        const me = this
        let ref = ''
        const index = me.columnEditorRefs.indexOf(me.focusInputRef)
        if (index !== -1) {
          const idx = index === me.columnEditorRefs.length - 1 ? 0 : index + 1
          ref = me.columnEditorRefs[idx]
        }
        return ref
      },
      doLayout() {
        this.$refs.table.doLayout()
      },
      selectRowByIndex(index) {
        if (this.data.length > 0 && index < this.data.length && index >= 0) {
          this.$refs.table.setCurrentRow(this.data[index])
        }
      },
      selectRow(row) {
        this.$refs.table.setCurrentRow(row)
      },
      selectFirstRow() {
        this.selectRowByIndex(0)
      },
      selectLastRow() {
        this.selectRowByIndex(this.data.length - 1)
      },
      resetSelection() {
        this.$refs.table.setCurrentRow()
      },
      getCurrentRow() {
        return this.currentRow
      },
      /**
       * Custom solution for updating when change selection or other inputs.
       */
      refreshTableBody() {
        const me = this
        const row = me.currentRow
        if (row) {
          me.resetSelection()
          me.selectRow(row)
        } else {
          me.selectLastRow()
          me.resetSelection()
        }
      }

    },
    /**
     * Component lifecycle methods
     */
    created() {
      const me = this

      // Debounce text filter
      me._debouceChangeFilter = debounce((value, field) => {
        me.debounceProcess = false
        me.emitChangeFilter(value, field)
      }, me.filterDelay)

      // Adding record event scenario
      const addingRecordHandler = e => {
        if (e.key === 'Enter' && !me.isLoading && !me.debounceProcess && !me.addingProcess && !me.isBlockEditing) {
          e.preventDefault()
          me.addingProcess = true
          const handler = me.isEditMode ? 'handleSave' : 'handleAdd'
          me[handler]()
          delay(() => me.addingProcess = false, 300)
        }
      }

      const closeEditingHandler = e => {
        if (e.key === 'Escape' && me.isEditMode && !me.isBlockEditing) {
          e.preventDefault()
          me.handleCancel()
        }
      }

      document.addEventListener('keydown', addingRecordHandler)
      document.addEventListener('keydown', closeEditingHandler)

      me.$once('hook:destroyed', () => {
        document.removeEventListener('keydown', addingRecordHandler)
        document.removeEventListener('keydown', closeEditingHandler)
      })

      me.setEditorRefs()
    },
    updated() {
      const me = this

      if (me.isEditMode && !me.focusInputRef) {
        const ref = me.getFirstFocusInputRef()
        if (ref && me.$refs[ref] && me.$refs[ref].focus) {
          me.focusInputRef = ref
          me.$refs[ref].focus()
          me.scroll()
        }
      }

      if (!me.isEditMode) {
        me.focusInputRef = ''
      }
    },
    watch: {
      editItem: function () {
        this.refreshTableBody()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
