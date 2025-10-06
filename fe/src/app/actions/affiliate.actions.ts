import { Dispatch } from '@reduxjs/toolkit'
import { affiliateServices } from '../services'
import {
  fetchedDone,
  getAffiliatesSuccessFully,
  getAffiliatesSuccessFailure,
  isFetching,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully,
  getByIdSuccessFailure,
  getByIdSuccessFully,
  getRandomAffiliateSuccessFully,
  getRandomAffiliateSuccessFailure
} from '../slices/affiliate.reducer'

export const getAffiliates = (searchValue: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .getAffiliates(searchValue)
    .then((res) => {
      dispatch(getAffiliatesSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getAffiliatesSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getAdminAffiliates = (searchValue: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .getAdminAffiliates(searchValue)
    .then((res) => {
      dispatch(getAffiliatesSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getAffiliatesSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const getAffiliateById = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .getAffiliateById(id)
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

export const getRandomAffiliate = () => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .getRandomAffiliate()
    .then((res) => {
      dispatch(getRandomAffiliateSuccessFully(res.data))
      return res
    })
    .catch((error) => {
      dispatch(getRandomAffiliateSuccessFailure(error.toString()))
      throw error
    })
    .finally(() => dispatch(fetchedDone()))
}

export const createAffiliate = (data: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .createAffiliate(data)
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

export const updateAffiliate = (id?: string, data?: FormData) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .updateAffiliate(id, data)
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

export const deleteAffiliate = (id: string) => (dispatch: Dispatch) => {
  dispatch(isFetching())

  return affiliateServices
    .deleteAffiliate(id)
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

export const affiliateActions = {
  getAffiliates,
  getAdminAffiliates,
  getAffiliateById,
  getRandomAffiliate,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate
}
