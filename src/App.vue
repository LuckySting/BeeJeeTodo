<template>
  <div class="flex flex-col items-center w-full h-full py-5">
    <div class="xl:w-3/4 lg:w-5/6 sm:w-full sm:px-5">
      <div class="border border-gray-400 w-full p-5 relative">
        <div class="loading-overlay" v-if="loadingTodos"></div>
        <div class="border border-gray-400 w-full" style="min-height: 400px">
          <table class="w-full">
            <colgroup>
              <col style="width: 200px">
              <col style="width: 200px">
              <col style="min-width: 120px">
              <col style="width: 200px">
            </colgroup>
            <thead>
            <tr style="max-height: 32px;">
              <td
                  class="data-table-header-cell cursor-pointer"
                  @click="toggleSort('username')"
              >
                Имя пользователя
                <span v-if="sortField === 'username' && sortDirection === 'asc'">▲</span>
                <span v-if="sortField === 'username' && sortDirection === 'desc'">▼</span>
              </td>
              <td
                  class="data-table-header-cell cursor-pointer"
                  @click="toggleSort('email')"
              >
                E-mail
                <span v-if="sortField === 'email' && sortDirection === 'asc'">▲</span>
                <span v-if="sortField === 'email' && sortDirection === 'desc'">▼</span>
              </td>
              <td
                  class="data-table-header-cell"
              >
                Текст задачи
              </td>
              <td
                  class="data-table-header-cell cursor-pointer"
                  @click="toggleSort('status')"
              >
                Статус задачи
                <span v-if="sortField === 'status' && sortDirection === 'asc'">▲</span>
                <span v-if="sortField === 'status' && sortDirection === 'desc'">▼</span>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="todo in todos"
                :key="todo.id"
                class=""
            >
              <td class="data-table-cell">{{ todo.username }}</td>
              <td class="data-table-cell">{{ todo.email }}</td>
              <td class="data-table-cell text-left px-2">{{ todo.text }}</td>
              <td class="data-table-cell text-left px-2">{{ todo.status }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="border-b border-l border-r border-gray-400 p-4 flex flex-row items-baseline space-x-4">
          <div>
            <button @click="prevPage" class="border border-gray-400 p-2">
              &lt;
            </button>
          </div>
          <div>
            {{ page }}/{{ totalPages }}
          </div>
          <div>
            <button @click="nextPage" class="border border-gray-400 p-2">
              >
            </button>
          </div>
        </div>
      </div>
      <div class="border border-gray-400 border-t-0 p-5 relative">
        <div class="loading-overlay" v-if="loadingNewTodo"></div>
        <form @submit.prevent="createTodo">
          <div class="flex flex-col w-full">
            <div class="border border-gray-400 p-2 w-full border-b-0 relative">
              <label>
                <input
                    type="text"
                    class="outline-none w-full"
                    placeholder="Имя пользователя"
                    v-model="formData.username"
                >
              </label>
              <div
                  class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                <div>{{ formValidationErrors.username }}</div>
              </div>
            </div>
            <div class="border border-gray-400 p-2 w-full border-b-0 relative">
              <label>
                <input
                    type="text"
                    class="outline-none w-full"
                    placeholder="E-mail"
                    v-model="formData.email"
                >
                <div
                    class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                  <div>{{ formValidationErrors.email }}</div>
                </div>
              </label>
            </div>
            <div class="border border-gray-400 p-2 w-full border-b-0 relative">
              <label>
              <textarea
                  class="outline-none w-full resize-none"
                  placeholder="Текст задачи"
                  style="height: 100px;"
                  v-model="formData.text"
              />
                <div
                    class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                  <div>{{ formValidationErrors.text }}</div>
                </div>
              </label>
            </div>
            <div>
              <label>
                <input
                    type="submit"
                    class="outline-none border border-gray-400 p-2 w-full cursor-pointer"
                    style="margin-top: -6px;"
                >
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default {
  name: 'App',
  data() {
    return {
      loadingTodos: false,
      loadingNewTodo: false,
      formData: {
        username: '',
        email: '',
        text: ''
      },
      formValidationErrors: {
        username: '',
        email: '',
        text: ''
      }
    }
  },
  created() {
    this.$store.dispatch('todo/subscribeToTodos')
    this.$store.dispatch('todo/loadParamsFromDocumentUrl')
  },
  methods: {
    nextPage() {
      if (this.page < this.totalPages) {
        this.$store.commit('todo/pageMutation', this.page + 1)
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.$store.commit('todo/pageMutation', this.page - 1)
      }
    },
    toggleSort(sortField) {
      this.$store.dispatch('todo/toggleSort', sortField)
    },
    validateNewTodoForm() {
      this.clearValidationErrors()
      if (this.formData.username === '') {
        this.formValidationErrors.username = 'Обязательное поле'
        return false
      }
      if (this.formData.email === '') {
        this.formValidationErrors.email = 'Обязательное поле'
        return false
      }
      if (this.formData.text === '') {
        this.formValidationErrors.text = 'Обязательное поле'
        return false
      }
      if (!validateEmail(this.formData.email)) {
        this.formValidationErrors.email = 'Неверный формат email'
        return false
      }
      return true
    },
    clearValidationErrors() {
      this.formValidationErrors.username = ''
      this.formValidationErrors.email = ''
      this.formValidationErrors.text = ''
    },
    clearNewTodoForm() {
      this.formData.username = ''
      this.formData.email = ''
      this.formData.text = ''
    },
    async createTodo() {
      if (!this.validateNewTodoForm()) return
      try {
        this.loadingNewTodo = true
        await this.$store.dispatch('todo/createTodo', this.formData)
        await this.loadTodos()
        this.clearNewTodoForm()
      } catch {
        console.log('fail to create')
      } finally {
        this.loadingNewTodo = false
      }
    },
    async loadTodos() {
      try {
        this.loadingTodos = true
        await this.$store.dispatch('todo/fetchTodos')
        if (this.page > this.totalPages) {
          this.$store.commit('todo/pageMutation', this.totalPages)
          await this.$store.dispatch('todo/fetchTodos')
        }
      } catch {
        console.log('fail to load')
      } finally {
        this.loadingTodos = false
      }
    }
  },
  computed: {
    ...mapGetters({
      todos: 'todo/todosGetter',
      totalTodosCount: 'todo/totalTodosCountGetter',
      sortField: 'todo/sortFieldGetter',
      sortDirection: 'todo/sortDirectionGetter'
    }),
    page() {
      return Number(this.$store.getters['todo/pageGetter'])
    },
    totalPages() {
      return Math.ceil(this.totalTodosCount / 3)
    }
  },
  watch: {
    page() {
      this.loadTodos()
    },
    sortField() {
      this.loadTodos()
    },
    sortDirection() {
      this.loadTodos()
    }
  }
}
</script>

<style>
body {
  font-family: sans-serif;
}

.data-table-cell {
  @apply border-gray-400 border-b border-r;
  @apply align-middle text-center;
}

.data-table-header-cell {
  @apply sticky border-b border-r border-gray-400 box-border top-0 z-10 bg-white py-1 font-normal;
  @apply align-middle text-center select-none;
}

.data-table-header-cell:last-child,
.data-table-cell:last-child {
  @apply border-r-0
}

.loading-overlay {
  @apply bg-gray-400 absolute top-5 left-5 right-5 bottom-5 z-50 opacity-30;
}
</style>
