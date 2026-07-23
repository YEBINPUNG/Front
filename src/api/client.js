// 데이터 접근 계층(Data Access Layer)의 공통 통신 코드.
// 이 파일만 fetch/토큰/에러 포맷을 알고, 나머지 api/* 모듈은 이 client의 request()만 사용한다.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

let accessToken = null
let refreshPromise = null
let onAuthFailure = null

export function setAccessToken(token) {
  accessToken = token
}

// 인증 갱신이 최종 실패했을 때 호출된다. AuthProvider가 세션을 정리하도록 등록한다.
export function setAuthFailureHandler(fn) {
  onAuthFailure = fn
}

export function getAccessToken() {
  return accessToken
}

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

async function parseResponse(res) {
  if (res.status === 204) return null
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new ApiError(data?.error?.message ?? '요청 처리 중 오류가 발생했습니다.', {
      status: res.status,
      code: data?.error?.code,
      details: data?.error?.details,
    })
  }
  return data
}

function rawRequest(path, { method = 'GET', body, skipAuth = false } = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(!skipAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', { method: 'POST', skipAuth: true })
      .then(parseResponse)
      .then((data) => {
        setAccessToken(data.accessToken)
        return data
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// refresh는 회전(rotation) 방식이라 동시에 두 번 호출되면 하나는 실패한다.
// React StrictMode의 effect 이중 실행 등으로 동시에 여러 번 불려도 실제 네트워크 요청은
// 하나만 나가도록 refreshAccessToken의 in-flight 프로미스를 그대로 공유한다.
export function restoreSession() {
  return refreshAccessToken()
}

// 401을 받으면 refresh 쿠키로 access token을 한 번 재발급받아 재시도한다.
export async function request(path, options = {}) {
  let res = await rawRequest(path, options)
  if (res.status === 401 && !options.skipAuth) {
    try {
      await refreshAccessToken()
      res = await rawRequest(path, options)
    } catch {
      // refresh도 실패하면 세션을 정리하고(로그인 화면으로) 원래의 401을 그대로 던진다.
      setAccessToken(null)
      onAuthFailure?.()
    }
  }
  return parseResponse(res)
}

export function toQueryString(query = {}) {
  const params = new URLSearchParams(query)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
