export function currentUrlMutation(state, payload) {
  state.currentUrl = payload
  window.location.href = payload
}