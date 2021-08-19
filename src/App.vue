<template>
  <div class="flex flex-col items-center w-full h-full py-5">
    <div class="xl:w-3/4 lg:w-5/6 sm:w-full sm:px-5">
      <div class="border border-gray-400 w-full p-5 relative">
        <div class="todos-overlay" v-if="loading"></div>
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
      <div>
        Тут будет форма
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      loading: true
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
    async loadTodos() {
      try {
        this.loading = true
        await this.$store.dispatch('todo/fetchTodos')
        if (this.page > this.totalPages) {
          this.$store.commit('todo/pageMutation', this.totalPages)
          await this.$store.dispatch('todo/fetchTodos')
        }
      } catch {
        console.log('fail to load')
      } finally {
        this.loading = false
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

.todos-overlay {
  @apply bg-gray-400 absolute top-5 left-5 right-5 bottom-5 z-50 opacity-30;
}
</style>
