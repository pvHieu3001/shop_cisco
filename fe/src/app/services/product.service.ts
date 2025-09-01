import http from '../http-common'

function getProducts(status?: string, search?: string, isDisplayHot?: string) {
  return http.get('/api/v1/user/product?status=' + status + '&search=' + search + '&isDisplayHot=' + isDisplayHot)
}
function getAdminProducts(status?: string, search?: string, isDisplayHot?: string) {
  return http.get('/api/v1/admin/product?status=' + status + '&search=' + search + '&isDisplayHot=' + isDisplayHot)
}
function getRecommendProducts() {
  return http.get('/api/v1/user/product/recommend')
}
function getQuickViewProducts() {
  return http.get('/api/v1/user/product/quick_view')
}
function getProductById(id: string) {
  return http.get(`/api/v1/admin/product/${id}`)
}
function getProductBySlug(slug: string) {
  return http.get(`/api/v1/user/product/slug/${slug}`)
}
function updateProduct(id: string, data: FormData) {
  return http.put(`/api/v1/admin/product/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function createProduct(data: FormData) {
  return http.post(`/api/v1/admin/product`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function deleteProduct(id: string) {
  return http.delete(`/api/v1/admin/product/${id}`)
}
function getPageProduct(page: string, size: string, sort: string) {
  return http.get(`/api/v1/user/product/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

function getProductsByCategory(categoryId: number) {
  return http.get(`/api/v1/user/product/category/${categoryId}`)
}

export const productServices = {
  getProducts,
  getAdminProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  createProduct,
  deleteProduct,
  getPageProduct,
  getProductsByCategory,
  getRecommendProducts,
  getQuickViewProducts
}
