import http from '../http-common'
import httpauth from '../http-auth'
import { LOCAL_STORAGE_USER, LOCAL_STORAGE_TOKEN, DOMAIN_URL } from '../../common/constants'
import axs from '../http-common'
import { ILogin, IRegister, IUser } from '@/common/types.interface'

function getUsers() {
  return http.get(`/api/v1/user`)
}

async function login(data: ILogin) {
  const res = await httpauth.post(`/api/v1/auth/login`, data)
  const token = res.data.access_token
  axs.defaults.headers.common.Authorization = `Bearer ${token}`

  localStorage.setItem(LOCAL_STORAGE_TOKEN, token)
  return res.data
}

async function register(data: IRegister) {
  const res = await httpauth.post(`/api/v1/auth/register`, data)
  const token = res.data.access_token
  axs.defaults.headers.common.Authorization = `Bearer ${token}`

  localStorage.setItem(LOCAL_STORAGE_TOKEN, token)
  return res.data
}

function logout() {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN)
  localStorage.removeItem(LOCAL_STORAGE_USER)
  const url = `${DOMAIN_URL}login`
  window.location.href = url
}

function getUserById(id: string) {
  return http.get(`/api/v1/user/${id}`)
}
function updateUser(id: string, data: IUser) {
  return http.put(`/api/v1/user/${id}`, data)
}
function createUser(data: IUser) {
  return http.post(`/api/v1/user`, data)
}
function deleteUser(id: string) {
  return http.delete(`/api/v1/user/${id}`)
}
function getPageUser(page: string, size: string, sort: string) {
  return http.get(`/api/v1/user/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

export const userService = {
  getUsers,
  login,
  register,
  logout,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  getPageUser
}
