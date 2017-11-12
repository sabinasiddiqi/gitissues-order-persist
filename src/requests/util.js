
export const API_PATH = 'https://api.github.com/'

export const apiFetch = async (url, options = {}) => {
  const body = options.body ? JSON.stringify(options.body) : undefined
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options,
    body
  })
  let json = response.json()
  if (response.status >= 200 && response.status < 300) {
    return json
  } else {
    return json.then(Promise.reject.bind(Promise))
  }
}
