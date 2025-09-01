import { Dispatch } from '@reduxjs/toolkit'
import { courseServices } from '../services/course.service'
import {
  isFetching,
  fetchedDone,
  reset,
  getCoursesSuccessFully,
  getCoursesFailure,
  deleteSuccessfully,
  deleteFailure,
  updateSuccessfully,
  updateFailure,
  createFailure,
  createSuccessfully,
  getByIdFailure,
  getByIdSuccessFully,
  getCoursesByCategorySuccessFully,
  getCoursesByCategoryFailure,
  getRecommendCoursesSuccessFully,
  getQuickViewCoursesSuccessFully
} from '../slices/course.reducer'

export const getCourses = (status?: string, search?: string, isDisplayHot?: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getCourses(status, search, isDisplayHot)
    .then((res) => {
      dispatch(getCoursesSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getCoursesFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getAdminCourses = (status?: string, search?: string, isDisplayHot?: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getAdminCourses(status, search, isDisplayHot)
    .then((res) => {
      dispatch(getCoursesSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getCoursesFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getRecommendCourses = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getRecommendCourses()
    .then((res) => {
      dispatch(getRecommendCoursesSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getCoursesFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getQuickViewCourses = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getQuickViewCourses()
    .then((res) => {
      dispatch(getQuickViewCoursesSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getCoursesFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getCourseById = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getCourseById(id)
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

export const getCourseBySlug = (slug: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getCourseBySlug(slug)
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

export const createCourse = (data: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .createCourse(data)
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

export const updateCourse = (id: string, data: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .updateCourse(id, data)
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

export const deleteCourse = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .deleteCourse(id)
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

export const getCoursesByCategory = (categoryId: number) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return courseServices
    .getCoursesByCategory(categoryId)
    .then((res) => {
      dispatch(getCoursesByCategorySuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getCoursesByCategoryFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const resetCourse = () => (dispatch: Dispatch) => {
  dispatch(reset())
}

export const courseActions = {
  getCourses,
  getAdminCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  resetCourse,
  getRecommendCourses,
  getQuickViewCourses
}
