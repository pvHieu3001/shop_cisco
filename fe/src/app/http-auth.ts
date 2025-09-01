import axios from 'axios'
import { LOCAL_STORAGE_USER, LOCAL_STORAGE_TOKEN, DOMAIN_URL } from '../common/constants'

const onSuccessInterceptorRequest = async (config: any) => {
  return config
}
const onErrorInterceptorRequest = (rs: any) => Promise.reject(rs)

const goToWorkspace = () => {
  localStorage.removeItem(LOCAL_STORAGE_USER)
  localStorage.removeItem(LOCAL_STORAGE_TOKEN)
  const url = `${DOMAIN_URL}login`
  window.location.href = url
}

const onErrorInterceptorResponse = (error) => {
  if (error) {
    if (!error.response.ok) {
      if (error.response.status === 401) {
        goToWorkspace()
      }
    }
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log('Error', error.message)
  }
  return Promise.reject(error)
}
const onSuccessInterceptorResponse = (rs) => {
  return rs
}

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.post.Accept = 'application/json'
axios.defaults.headers.Accept = 'application/json'

const axsAuth = axios.create({
  baseURL: import.meta.env.VITE_EXTERNAL_BASE_API,
  timeout: 120 * 1000
})

axsAuth.interceptors.request.use(onSuccessInterceptorRequest, onErrorInterceptorRequest)

axsAuth.interceptors.response.use(onSuccessInterceptorResponse, onErrorInterceptorResponse)

export default axsAuth
