import { Dispatch } from '@reduxjs/toolkit'
import { blogServices } from '../services'
import {
  fetchedDone,
  getBlogSuccessFully,
  getBlogSuccessFailure,
  isFetching,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully,
  getByIdSuccessFailure,
  getByIdSuccessFully,
  getByTypeSuccessFully,
  getByTypeSuccessFailure,
  getBySlugSuccessFully,
  getBySlugSuccessFailure
} from '../slices/blog.reducer'

export const getBlogs = (searchValue: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .getBlogs(searchValue)
    .then((res) => {
      dispatch(getBlogSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getBlogSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getAdminBlogs = (status: string, search: string, isDisplayHot: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .getAdminBlogs(status, search, isDisplayHot)
    .then((res) => {
      dispatch(getBlogSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getBlogSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getBlogById = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .getBlogById(id)
    .then((res) => {
      dispatch(getByIdSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getByIdSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getBlogBySlug = (slug: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .getBlogBySlug(slug)
    .then((res) => {
      dispatch(getBySlugSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getBySlugSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getBlogByType = (slug: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .getBlogByType(slug)
    .then((res) => {
      dispatch(getByTypeSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getByTypeSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const createBlog = (data: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .createBlog(data)
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

export const updateBlog = (id?: string, data?: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .updateBlog(id, data)
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

export const deleteBlog = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return blogServices
    .deleteBlog(id)
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

export const blogActions = {
  getBlogs,
  getAdminBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogByType
}
