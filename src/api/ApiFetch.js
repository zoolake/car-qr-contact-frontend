import router from '@/router'

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include', // 세션 쿠키 필수
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  // 🔥 전역 인증 처리
  if (response.status === 401) {
    if (router.currentRoute.value.path !== '/login') {
      router.replace({
        path: '/login',
        query: { expired: 'true' },
      })
    }

    localStorage.removeItem('loggedIn')
    throw new Error('UNAUTHORIZED')
  }

  if (response.status === 403) {
    router.replace('/forbidden')
    throw new Error('FORBIDDEN')
  }

  // 에러 응답 처리
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody)
  }

  return response
}
