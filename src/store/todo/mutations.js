import {updateParamInDocumentUrl} from '../../tools/urlUtils'

export function todosMutation(state, todos) {
  state.todos = todos
}

export function sortFieldMutation(state, sortField) {
  state.sortField = sortField
  updateParamInDocumentUrl('sort-field', String(sortField))
}

export function sortDirectionMutation(state, sortDirection) {
  state.sortDirection = sortDirection
  updateParamInDocumentUrl('sort-direction', String(sortDirection))
}

export function pageMutation(state, page) {
  state.page = page
  updateParamInDocumentUrl('page', String(page))
}

export function totalTodosCountMutation(state, totalTodosCount) {
  state.totalTodosCount = totalTodosCount
}