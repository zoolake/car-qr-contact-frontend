import { apiFetch } from './ApiFetch'

async function parseJsonSafely(response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function getCarInfoByScanningQR(serialNo) {
  const url = `/api/qrs/${serialNo}`
  const options = {
    method: 'GET',
  }

  return parseJsonSafely(await apiFetch(url, options))
}
