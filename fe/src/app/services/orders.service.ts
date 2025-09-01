import { IOrder } from '@/common/types.interface'
import http from '../http-common'

function getOrder() {
  return http.get('/api/v1/order')
}
function getOrderById(id: string) {
  return http.get(`/api/v1/order/${id}`)
}
function updateOrder(id: string, data: IOrder) {
  return http.put(`/api/v1/order/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function createOrder(data: IOrder) {
  return http.post(`/api/v1/order`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function deleteOrder(id: string) {
  return http.delete(`/api/v1/order/${id}`)
}
function getPageOrder(page: string, size: string, sort: string) {
  return http.get(`/api/v1/order/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

export const orderServices = {
  getOrder,
  getOrderById,
  updateOrder,
  createOrder,
  deleteOrder,
  getPageOrder
}
