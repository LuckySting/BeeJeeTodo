export function updateParamInDocumentUrl(paramName, paramValue) {
  const url = new URL(window.location)
  url.searchParams.delete(paramName)
  if (paramValue) {
    url.searchParams.append(paramName, paramValue)
  }
  window.history.pushState(
    null,
    document.title,
    url.toString()
  )
}

export function getParamFromDocumentUrl(paramName, defaultValue = null) {
  const windowData = Object.fromEntries(
    new URL(window.location).searchParams.entries()
  )
  if (paramName in windowData) {
    return windowData[paramName]
  } else {
    return defaultValue
  }
}