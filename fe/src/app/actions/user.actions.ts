import { Dispatch } from '@reduxjs/toolkit'
import { userService } from '../services'
import {
  createFailure,
  createSuccessfully,
  deleteFailure,
  deleteSuccessfully,
  fetchedDone,
  getUsersFailure,
  getUsersSuccess,
  isFetching,
  loginSuccess,
  updateFailure,
  updateSuccessfully,
  getByIdFailure,
  getByIdSuccess,
  loginFailure,
  signupSuccess,
  signupFailure
} from '../slices/user.reducer'
import { ILogin, IRegister, IUser } from '@/common/types.interface'

// Get all users
export const getUsers = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .getUsers()
    .then((res) => {
      dispatch(getUsersSuccess(res))
      return res
    })
    .catch((error) => {
      dispatch(getUsersFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Get user by ID
export const getUserById = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .getUserById(id)
    .then((res) => {
      dispatch(getByIdSuccess(res))
      return res
    })
    .catch((error) => {
      dispatch(getByIdFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Create user
export const createUser = (data: IUser) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .createUser(data)
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

// Update user
export const updateUser = (id: string, data: IUser) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .updateUser(id, data)
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

// Delete user
export const deleteUser = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .deleteUser(id)
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

// Login user
export const login = (token: ILogin) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .login(token)
    .then((res) => {
      dispatch(loginSuccess(res))
      return res
    })
    .catch((error) => {
      dispatch(loginFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Signup user
export const signup = (data: IRegister) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return userService
    .register(data)
    .then((res) => {
      dispatch(signupSuccess(res))
      return res
    })
    .catch((error) => {
      dispatch(signupFailure(error))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

// Logout user (sync action)
function logout() {
  userService.logout()
  return { type: 'LOGOUT' } // ⛔ userConstants.LOGOUT không thấy được import
}

// Export actions
export const userActions = {
  login,
  signup,
  getUsers,
  logout,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}
