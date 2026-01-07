import { apiFetch } from './ApiFetch'

async function parseJsonSafely(response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function login(request) {
  const url = '/api/users/login'
  const options = {
    method: 'POST',
    body: JSON.stringify(request),
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function signup(request) {
  const url = '/api/users/signup'
  const options = {
    method: 'POST',
    body: JSON.stringify(request),
  }

  return parseJsonSafely(await apiFetch(url, options))
}
