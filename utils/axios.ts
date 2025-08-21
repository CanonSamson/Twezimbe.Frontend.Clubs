import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { NEXT_PUBLIC_API_URL } from './contants'

// Create an axios instance with a base URL
const axiosServices = axios.create({
  baseURL: NEXT_PUBLIC_API_URL
})

// ==============================|| AXIOS - INTERCEPTORS ||============================== //

// Add a request interceptor to include the Authorization header
axiosServices.interceptors.request.use(
  async config => {
    const token = Cookies.get('access-token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // Handle request errors
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle specific HTTP status codes
axiosServices.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(
      (error.response && error.response.data) || 'An unexpected error occurred'
    )
  }
)

export default axiosServices

// ==============================|| FETCH HELPERS ||============================== //

// Helper function for GET requests
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args]
  const res = await axiosServices.get(url, { ...config })
  return res.data // Return the response data directly
}

// Helper function for POST requests
export const fetcherPost = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args]
  const res = await axiosServices.post(url, { ...config })
  return res.data // Return the response data directly
}
