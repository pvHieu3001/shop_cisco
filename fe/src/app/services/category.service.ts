import http from '../http-common'

function getCategories(search: string) {
  return http.get('/api/v1/user/category?search=' + search)
}
function getAdminCategories(search: string) {
  return http.get('/api/v1/admin/category?search=' + search)
}
function getCategoryById(id: string) {
  return http.get(`/api/v1/admin/category/${id}`)
}

function getCategoryBySlug(slug: string) {
  return http.get(`/api/v1/user/category/slug/${slug}`)
}
function updateCategory(id?: string, data?: FormData) {
  return http.put(`/api/v1/admin/category/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function createCategory(data: FormData) {
  return http.post(`/api/v1/admin/category`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function deleteCategory(id: string) {
  return http.delete(`/api/v1/admin/category/${id}`)
}
function getPageCategory(page: string, size: string, sort: string) {
  return http.get(`/api/v1/user/category/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

export const categoryServices = {
  getCategories,
  getAdminCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  createCategory,
  deleteCategory,
  getPageCategory
}
