import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8000/',
})

client.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('coplur_tokens')
  if (tokens) {
    const { accessToken } = JSON.parse(tokens)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})

export default client
