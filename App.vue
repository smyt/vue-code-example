<template>
  <div id="app">
    <h1>Таблица пользователей</h1>
    <editable-table
            ref="table"
            :data="items"
            :columns="getColumns"
            :buttons="getToolbar"
            :isLoading="isLoading"
            :page="page"
            :total="total"
            :filter="filter"
            :isEditMode="isEditMode"
            :editItem="editItem"
            @change-page="changePage"
            @change-sort="changeSort"
            @reset-filter="resetFilter"
            @change-filter="changeFilter"
            @select="select"
            @add="add"
            @save="save"
            @cancel="cancel"
    >
      <el-tooltip slot-scope="{ button }" class="item" effect="dark" :content="button.tooltip" placement="top-start">
        <el-button
                :icon="button.icon"
                size="mini"
                @click="button.action"
                :disabled="button.disabled"
        >
          <template v-if="button.text">{{button.text}}</template>
        </el-button>
      </el-tooltip>
      <template slot="errors">
        <div class="error-block" v-if="editErrorsCount > 0">
          <i class="el-icon-warning error-count"></i>
          <span>Ошибок заполнения: {{editErrorsCount}}</span>
        </div>
      </template>
    </editable-table>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import EditableTable from './components/EditableTable/EditableTable.vue'

  export default {
    name: 'app',
    components: [
      EditableTable
    ],
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed: {
      ...mapGetters('equipment', [
        'items',
        'isLoading',
        'isLoaded',
        'total',
        'page',
        'filter',
        'selection',
        'isEditMode',
        'editItem',
        'hasError',
        'editErrors',
        'editErrorsCount',
        'editItemValue'
      ]),
      getColumns() {
        const me = this
        return [{
          label: 'Ид пользователя',
          prop: 'id',
          width: 160,
          align: 'center',
          sortable: me.isEditMode ? false : 'custom',
          sort: 'id',
        }, {
          label: 'Имя',
          prop: 'firstname',
          width: 160,
          align: 'left',
          sortable: me.isEditMode ? false : 'custom',
          filter: {
            type: 'simple',
          },
          editor: simpleEditor({
            state: me.editItem,
            field: 'username',
            handler: me.changeProperty
          }),
        }, {
          label: 'Фамилия',
          prop: 'secondname',
          align: 'left',
          sortable: me.isEditMode ? false : 'custom',
          filter: {
            type: 'simple',
          },
          editor: simpleEditor({
            state: me.editItem,
            field: 'secondname',
            handler: me.changeProperty
          }),
        }]
      },
      getToolbar() {
        const me = this
        return [{
          icon: 'el-icon-circle-plus-outline',
          action: me.add,
          tooltip: 'Добавить новую запись',
          text: 'Добавить',
          disabled: me.isEditMode
        }, {
          icon: 'el-icon-circle-close-outline',
          action: me.remove,
          tooltip: 'Удалить запись',
          text: 'Удалить',
          disabled: me.isEditMode
        }, {
          icon: 'el-icon-refresh',
          action: me.load,
          align: 'right',
          tooltip: 'Обновить данные в таблице',
          disabled: me.isEditMode
        },]
      },
    },
    methods: {
      ...mapActions('users', {
        add: 'AddItem',
        load: 'LoadItems',
        remove: 'RemoveItem',
        cancel: 'CancelItem',
        select: 'SelectItem',
        save: 'SaveItem',
        validate: 'ValidateItem',
        changePage: 'ChangePage',
        changeSort: 'ChangeSort',
        changeFilter: 'ChangeFilter',
        resetFilter: 'ResetFilter',
        changeProperty: 'ChangeProperty',
        changeDateProperty: 'ChangeDateProperty'
      })

    },
  }
</script>

<style lang="scss">
</style>
