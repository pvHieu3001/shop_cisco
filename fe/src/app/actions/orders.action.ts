import { Dispatch } from '@reduxjs/toolkit'
import { orderServices } from '../services/orders.service'
import {
  isFetching,
  fetchedDone,
  getOrdersSuccessFully,
  getOrdersFailure,
  deleteSuccessfully,
  deleteFailure,
  updateSuccessfully,
  updateFailure,
  createFailure,
  createSuccessfully,
  getByIdFailure,
  getByIdSuccessFully
} from '../slices/order.reducer'
import { IOrder } from '@/common/types.interface'

// Get all orders
export const getOrder = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return orderServices
    .getOrder()
    .then((res) => {
      dispatch(getOrdersSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getOrdersFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Get order by ID
export const getOrderById = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return orderServices
    .getOrderById(id)
    .then((res) => {
      dispatch(getByIdSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getByIdFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Create order
export const createOrder = (data: IOrder) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return orderServices
    .createOrder(data)
    .then((res) => {
      dispatch(createSuccessfully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(createFailure())
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Update order
export const updateOrder = (id: string, data: IOrder) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return orderServices
    .updateOrder(id, data)
    .then((res) => {
      dispatch(updateSuccessfully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(updateFailure())
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Delete order
export const deleteOrder = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return orderServices
    .deleteOrder(id)
    .then((res) => {
      dispatch(deleteSuccessfully())
      return res
    })
    .catch((error) => {
      dispatch(deleteFailure())
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Export all order actions
export const OrderActions = {
  getOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}
