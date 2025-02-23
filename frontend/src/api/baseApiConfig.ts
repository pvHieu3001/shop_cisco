import { fetchBaseQuery } from '@reduxjs/toolkit/query'

export const baseApiConfig = {
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Use getState to access your redux store
      //const token = getState().auth.token;

      //console.log('token will prepare in here')
      headers.set('authorization', `Bearer ${localStorage.getItem('access_token')}`)

      return headers
    }
  }),

  endpoints: () => ({})
}
