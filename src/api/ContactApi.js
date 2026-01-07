import { apiFetch } from './ApiFetch'

async function parseJsonSafely(response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function getContacts(carId) {
  const url = `/api/cars/${carId}/contacts`
  const options = { method: 'GET' }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function registerContact(request, carId) {
  const url = `/api/cars/${carId}/contacts`
  const options = {
    method: 'POST',
    body: JSON.stringify(request),
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function updateContact(request, contactId) {
  const url = '/api/contacts/' + contactId
  const options = {
    method: 'PATCH',
    body: JSON.stringify(request),
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function deleteContact(carId, contactId) {
  const url = `/api/contacts/${contactId}?carId=${carId}`
  const options = { method: 'DELETE' }

  return parseJsonSafely(await apiFetch(url, options))
}
