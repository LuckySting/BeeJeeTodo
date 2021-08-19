<template>
  <div class="flex flex-col items-center w-full h-full py-5">
    <div class="xl:w-3/4 lg:w-5/6 sm:w-full sm:px-5">
      <div class="border border-gray-400 border-b-0 p-5 relative">
        <template v-if="isAuthed">
          <div class="flex flex-row items-baseline">
            <div
                class="flex-grow p-2 border border-gray-400"
            >
              Вы авторизованы как Администратор
            </div>
            <div>
              <label>
                <input
                    type="submit"
                    class="outline-none  border border-gray-400 border-l-0 py-2 px-10 w-full cursor-pointer"
                    style="margin-top: -6px;"
                    value="Выйти"
                    @click="logout"
                >
              </label>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="loading-overlay" v-if="loadingAdminEnter"></div>
          <form @submit.prevent="login">
            <div class="flex flex-row items-baseline">
              <div class="border border-gray-400 p-2 w-full relative">
                <label>
                  <input
                      type="text"
                      class="outline-none w-full"
                      placeholder="Имя пользователя"
                      v-model="adminEnterFormData.username"
                  >
                  <div
                      class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                    <div>{{ adminEnterFormValidationErrors.username }}</div>
                  </div>
                </label>
              </div>
              <div class="border border-gray-400 p-2 w-full border-l-0 relative">
                <label>
                  <input
                      type="password"
                      class="outline-none w-full"
                      placeholder="Пароль"
                      v-model="adminEnterFormData.password"
                  >
                  <div
                      class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                    <div>{{ adminEnterFormValidationErrors.password }}</div>
                  </div>
                </label>
              </div>
              <div>
                <label>
                  <input
                      type="submit"
                      class="outline-none border border-gray-400 border-l-0 p-2 w-full cursor-pointer"
                      style="margin-top: -6px;"
                      value="Войти как администратор"
                  >
                </label>
              </div>
            </div>
          </form>
        </template>
      </div>
      <div class="border border-gray-400 w-full p-5 relative">
        <div class="loading-overlay" v-if="loadingTodos"></div>
        <div class="border border-gray-400 w-full" style="min-height: 400px">
          <table class="w-full">
            <colgroup>
              <col style="width: 100px" v-if="isAuthed">
              <col style="width: 200px">
              <col style="width: 200px">
              <col style="min-width: 120px">
              <col style="width: 125px">
            </colgroup>
            <thead>
            <tr style="max-height: 32px;">
              <td class="data-table-cell" v-if="isAuthed">
                Выполнено
              </td>
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
              <td class="data-table-cell" v-if="isAuthed">
                <label>
                  <input type="checkbox" :checked="todo.status >= 10" @click.prevent="toggleTodoCompletion(todo)">
                </label>
              </td>
              <td class="data-table-cell">{{ todo.username }}</td>
              <td class="data-table-cell">{{ todo.email }}</td>
              <td class="data-table-cell text-left px-2" v-if="isAuthed">
                <label>
                  <textarea
                      :value="todo.text"
                      class="w-full outline-none"
                      @change="changeTodoText(todo, $event)"
                  />
                </label>
              </td>
              <td class="data-table-cell text-left px-2" v-else>
                {{ todo.text }}
              </td>
              <td class="data-table-cell text-left px-2">
                <div class="flex flex-row justify-between py-2">
                  <span
                      v-if="todo.status % 2 === 1"
                      class="bg-yellow-300"
                      style="border-radius: 30px; padding: 5px 10px"
                  >ред</span>
                  <span
                      v-if="todo.status >= 10"
                      class="bg-green-300"
                      style="border-radius: 30px; padding: 5px 10px"
                  >вып</span>
                </div>
              </td>
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
                    v-model="newTodoFormData.username"
                >
              </label>
              <div
                  class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                <div>{{ newTodoFormValidationErrors.username }}</div>
              </div>
            </div>
            <div class="border border-gray-400 p-2 w-full border-b-0 relative">
              <label>
                <input
                    type="text"
                    class="outline-none w-full"
                    placeholder="E-mail"
                    v-model="newTodoFormData.email"
                >
                <div
                    class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                  <div>{{ newTodoFormValidationErrors.email }}</div>
                </div>
              </label>
            </div>
            <div class="border border-gray-400 p-2 w-full border-b-0 relative">
              <label>
              <textarea
                  class="outline-none w-full resize-none"
                  placeholder="Текст задачи"
                  style="height: 100px;"
                  v-model="newTodoFormData.text"
              />
                <div
                    class="absolute top-0 bottom-0 right-0 mr-5 text-red-400 flex flex-row items-center pointer-events-none">
                  <div>{{ newTodoFormValidationErrors.text }}</div>
                </div>
              </label>
            </div>
            <div>
              <label>
                <input
                    type="submit"
                    class="outline-none border border-gray-400 p-2 w-full cursor-pointer"
                    style="margin-top: -6px;"
                    value="Создать задачу"
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
      loadingAdminEnter: false,
      newTodoFormData: {
        username: '',
        email: '',
        text: ''
      },
      newTodoFormValidationErrors: {
        username: '',
        email: '',
        text: ''
      },
      adminEnterFormData: {
        username: '',
        password: ''
      },
      adminEnterFormValidationErrors: {
        username: '',
        password: ''
      }
    }
  },
  created() {
    this.$store.dispatch('todo/subscribeToTodos')
    this.$store.dispatch('todo/loadParamsFromDocumentUrl')
    this.$store.dispatch('auth/checkAuthed')
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
      this.clearNewTodoFormValidationErrors()
      if (this.newTodoFormData.username === '') {
        this.newTodoFormValidationErrors.username = 'Обязательное поле'
        return false
      }
      if (this.newTodoFormData.email === '') {
        this.newTodoFormValidationErrors.email = 'Обязательное поле'
        return false
      }
      if (this.newTodoFormData.text === '') {
        this.newTodoFormValidationErrors.text = 'Обязательное поле'
        return false
      }
      if (!validateEmail(this.newTodoFormData.email)) {
        this.newTodoFormValidationErrors.email = 'Неверный формат email'
        return false
      }
      return true
    },
    clearNewTodoFormValidationErrors() {
      this.newTodoFormValidationErrors.username = ''
      this.newTodoFormValidationErrors.email = ''
      this.newTodoFormValidationErrors.text = ''
    },
    clearNewTodoForm() {
      this.newTodoFormData.username = ''
      this.newTodoFormData.email = ''
      this.newTodoFormData.text = ''
    },
    async createTodo() {
      if (!this.validateNewTodoForm()) return
      try {
        this.loadingNewTodo = true
        await this.$store.dispatch('todo/createTodo', this.newTodoFormData)
        await this.loadTodos()
        this.clearNewTodoForm()
      } catch {
        alert('Не удалось создать задачу')
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
        alert('Не удалось загрузить задачи')
      } finally {
        this.loadingTodos = false
      }
    },
    validateAdminEnterForm() {
      this.clearAdminEnterFormValidationErrors()
      if (this.adminEnterFormData.username === '') {
        this.adminEnterFormValidationErrors.username = 'Обязательное поле'
        return false
      }
      if (this.adminEnterFormData.password === '') {
        this.adminEnterFormValidationErrors.password = 'Обязательное поле'
        return false
      }
      return true
    },
    clearAdminEnterFormValidationErrors() {
      this.adminEnterFormValidationErrors.username = ''
      this.adminEnterFormValidationErrors.password = ''
    },
    clearAdminEnterForm() {
      this.adminEnterFormData.username = ''
      this.adminEnterFormData.password = ''
    },
    async login() {
      if (!this.validateAdminEnterForm()) return
      try {
        this.loadingAdminEnter = true
        await this.$store.dispatch('auth/login', this.adminEnterFormData)
      } catch {
        alert('Неверный логин или пароль')
      } finally {
        this.clearAdminEnterForm()
        this.loadingAdminEnter = false
      }
    },
    logout() {
      this.$store.dispatch('auth/logout')
    },
    async toggleTodoCompletion(todo) {
      let newStatus = todo.status
      if (todo.status < 10) {
        newStatus += 10
      } else {
        newStatus -= 10
      }
      try {
        this.loadingTodos = true
        this.loadingNewTodo = true
        await this.$store.dispatch('todo/updateTodo', {
          todoId: todo.id,
          status: newStatus,
          text: null
        })
        await this.loadTodos()
      } catch {
        alert('Вы не авторизованы')
        this.logout()
      } finally {
        this.loadingTodos = false
        this.loadingNewTodo = false
      }
    },
    async changeTodoText(todo, event) {
      const newStatus = todo % 2 === 0 ? todo.status : todo.status + 1
      try {
        this.loadingTodos = true
        this.loadingNewTodo = true
        await this.$store.dispatch('todo/updateTodo', {
          todoId: todo.id,
          status: newStatus,
          text: event.target.value
        })
        await this.loadTodos()
      } catch {
        alert('Вы не авторизованы')
        this.logout()
      } finally {
        this.loadingTodos = false
        this.loadingNewTodo = false
      }
    }
  },
  computed: {
    ...mapGetters({
      todos: 'todo/todosGetter',
      totalTodosCount: 'todo/totalTodosCountGetter',
      sortField: 'todo/sortFieldGetter',
      sortDirection: 'todo/sortDirectionGetter',
      isAuthed: 'auth/isAuthedGetter'
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
