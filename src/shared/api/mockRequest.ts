import { DUMMY_DATA } from '@/shared/config/env'
import { request } from './request'
import type { AxiosRequestConfig } from 'axios'

type MockDataMap = {
  [key: string]: unknown
}

const mockDataRegistry: MockDataMap = {}

export function registerMockData(endpoint: string, method: string, data: unknown) {
  const key = `${method.toUpperCase()}:${endpoint}`
  mockDataRegistry[key] = data
}

function findMockData(config: AxiosRequestConfig): unknown | undefined {
  const method = (config.method || 'GET').toUpperCase()
  const url = config.url || ''

  const exactKey = `${method}:${url}`
  if (mockDataRegistry[exactKey]) {
    return mockDataRegistry[exactKey]
  }

  for (const key of Object.keys(mockDataRegistry)) {
    const colonIndex = key.indexOf(':')
    const registeredMethod = key.slice(0, colonIndex)
    const registeredUrl = key.slice(colonIndex + 1)
    if (registeredMethod !== method) continue

    const pattern = registeredUrl.replace(/:\w+/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    if (regex.test(url)) {
      return mockDataRegistry[key]
    }
  }

  return undefined
}

export async function mockRequest<TResponse>(config: AxiosRequestConfig): Promise<TResponse> {
  if (DUMMY_DATA) {
    const mockData = findMockData(config)
    if (mockData) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockData as TResponse
    }
  }
  return request<TResponse>(config)
}
