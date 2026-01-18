let accessToken: string | null = null

export const getAccessToken = () => accessToken

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const clearAccessToken = () => {
  accessToken = null
}
