import * as api from '../../services/api'

export function checkAuthed(context) {
  const isAuthed = api.checkToken()
  context.commit('isAuthedMutation', isAuthed)
}

export async function login(context, {username, password}) {
  await api.login(username, password)
  context.commit('isAuthedMutation', true)
}

export function logout(context) {
  api.logout()
  context.commit('isAuthedMutation', false)
}