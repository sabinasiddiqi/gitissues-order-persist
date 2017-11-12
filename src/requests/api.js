import { apiFetch, API_PATH } from './util'

export const getUser = async (key) => {
  return await apiFetch(`${API_PATH}user?access_token=${key}`)
}
export const getRepos = async () => {
  const key = window.sessionStorage.getItem('key')
  // return await apiFetch(`${API_PATH}user/repos?access_token=${key}`)
  let url = 'users/goodbotai/repos'
  return await apiFetch(`${API_PATH}${url}`)
}

export const getIssues = async (repo) => {
  const key = window.sessionStorage.getItem('key'),
    user = window.sessionStorage.getItem('login')
  // return await apiFetch(`${API_PATH}repos/${user}/${repo}/issues?access_token=${key}`)
  let url = `repos/goodbotai/${repo}/issues?state=closed`
  return await apiFetch(`${API_PATH}${url}`)
}
