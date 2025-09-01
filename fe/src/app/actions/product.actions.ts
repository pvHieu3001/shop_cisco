import { Dispatch } from '@reduxjs/toolkit'
import { productServices } from '../services/product.service'
import {
  isFetching,
  fetchedDone,
  reset,
  getProductsSuccessFully,
  getProductsFailure,
  deleteSuccessfully,
  deleteFailure,
  updateSuccessfully,
  updateFailure,
  createFailure,
  createSuccessfully,
  getByIdFailure,
  getByIdSuccessFully,
  getProductsByCategorySuccessFully,
  getProductsByCategoryFailure,
  getRecommendProductsSuccessFully,
  getQuickViewProductsSuccessFully
} from '../slices/product.reducer'

export const getProducts = (status?: string, search?: string, isDisplayHot?: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getProducts(status, search, isDisplayHot)
    .then((res) => {
      dispatch(getProductsSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getProductsFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getAdminProducts = (status?: string, search?: string, isDisplayHot?: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getAdminProducts(status, search, isDisplayHot)
    .then((res) => {
      dispatch(getProductsSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getProductsFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getRecommendProducts = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getRecommendProducts()
    .then((res) => {
      dispatch(getRecommendProductsSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getProductsFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getQuickViewProducts = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getQuickViewProducts()
    .then((res) => {
      dispatch(getQuickViewProductsSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getProductsFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getProductById = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getProductById(id)
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

export const getProductBySlug = (slug: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getProductBySlug(slug)
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

export const createProduct = (data: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .createProduct(data)
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

export const updateProduct = (id: string, data: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .updateProduct(id, data)
    .then((res) => {
      dispatch(updateSuccessfully(res.data))
      return res
    })
    .catch((err) => {
      dispatch(updateFailure())
      throw err
    })
    .finally(() => dispatch(fetchedDone()))
}

export const deleteProduct = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .deleteProduct(id)
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

export const getProductsByCategory = (categoryId: number) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return productServices
    .getProductsByCategory(categoryId)
    .then((res) => {
      dispatch(getProductsByCategorySuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getProductsByCategoryFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const resetProduct = () => (dispatch: Dispatch) => {
  dispatch(reset())
}

export const productActions = {
  getProducts,
  getAdminProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  resetProduct,
  getRecommendProducts,
  getQuickViewProducts
}
