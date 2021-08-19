import * as api from '../services/api'

const todoSubscriptions = new Set()


export function subscribeToTodos(callback) {
  todoSubscriptions.add(callback)
}

export function unsubscribeToTodos(callback) {
  todoSubscriptions.delete(callback)
}

export function pollSubscribers(todos) {
  for (const callback of todoSubscriptions) {
    callback(todos)
  }
}

export async function fetchTodo(sortField, sortDirection, page) {
  const response = await api.commonAxios.get('', {
    params: {
      sort_field: sortField,
      sort_direction: sortDirection,
      page
    }
  })
  if (response.data.status !== 'ok' || !('message' in response.data)) {
    throw Error
  }
  pollSubscribers(response.data.message.tasks)
  return response.data.message.total_task_count
}

export async function createTodo(username, email, text) {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('email', email)
  formData.append('text', text)
  const response = await api.adminAxios.post('/create', formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  if (response.data.status !== 'ok' || !('message' in response.data)) {
    throw Error
  }
}