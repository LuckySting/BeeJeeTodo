import * as todoRepository from '../../repositories/todoRepository'
import {getParamFromDocumentUrl} from '../../tools/urlUtils'

export function subscribeToTodos(context) {
  todoRepository.subscribeToTodos((todos) => {
    context.commit('todosMutation', todos)
  })
}

export function unsubscribeToTodos(context) {
  todoRepository.unsubscribeToTodos((todos) => {
    context.commit('todosMutation', todos)
  })
}

export async function fetchTodos(context) {
  const sortField = context.getters.sortFieldGetter
  const sortDirection = context.getters.sortDirectionGetter
  const page = context.getters.pageGetter
  let totalTodosCount = await todoRepository.fetchTodo(sortField, sortDirection, page)
  if (totalTodosCount < 1) {
    totalTodosCount = 1
  }
  context.commit('totalTodosCountMutation', totalTodosCount)
}

export function loadParamsFromDocumentUrl(context) {
  const sortField = getParamFromDocumentUrl('sort-field', '')
  const sortDirection = getParamFromDocumentUrl('sort-direction', '')
  let page = Number(getParamFromDocumentUrl('page', 1))
  if (page < 1) {
    page = 1
  }
  context.commit('sortFieldMutation', sortField)
  context.commit('sortDirectionMutation', sortDirection)
  context.commit('pageMutation', page)
}

export function toggleSort(context, sortField) {
  const currentSortField = context.getters.sortFieldGetter
  const currentSortDirection = context.getters.sortDirectionGetter
  if (currentSortField !== sortField) {
    context.commit('sortFieldMutation', sortField)
    context.commit('sortDirectionMutation', 'desc')
  } else {
    if (currentSortDirection === 'desc') {
      context.commit('sortDirectionMutation', 'asc')
    } else if (currentSortDirection === 'asc') {
      context.commit('sortFieldMutation', '')
      context.commit('sortDirectionMutation', '')
    }
  }
}

export async function createTodo(context, {username, email, text}) {
  await todoRepository.createTodo(username, email, text)
}

export async function updateTodo(context, {todoId, text, status}) {
  await todoRepository.updateTodo(todoId, text, status)
}
