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
  const totalTodosCount = await todoRepository.fetchTodo(sortField, sortDirection, page)
  context.commit('totalTodosCountMutation', totalTodosCount)
}

export function loadParamsFromDocumentUrl(context) {
  const sortField = getParamFromDocumentUrl('sort-field', '')
  const sortDirection = getParamFromDocumentUrl('sort-direction', '')
  const page = getParamFromDocumentUrl('page', 1)
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