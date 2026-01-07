import { apiFetch } from './ApiFetch'

async function parseJsonSafely(response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function getCars() {
  const url = '/api/cars'
  const options = {
    method: 'GET',
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function getCarInfo(carId) {
  const url = `/api/cars/${carId}`
  const options = {
    method: 'GET',
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function registerCar(request) {
  const url = '/api/cars'
  const options = {
    method: 'POST',
    body: JSON.stringify(request),
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function updateCarInfo(request, carId) {
  const url = `/api/cars/${carId}`
  const options = {
    method: 'PATCH',
    body: JSON.stringify(request),
  }

  return parseJsonSafely(await apiFetch(url, options))
}

export async function deleteCar(carId) {
  const url = `/api/cars/${carId}`
  const options = {
    method: 'DELETE',
  }

  return parseJsonSafely(await apiFetch(url, options))
}
