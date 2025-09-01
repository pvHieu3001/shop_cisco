import http from '../http-common'

function getBlogs(search: string) {
  return http.get('/api/v1/user/blog?search=' + search)
}
function getAdminBlogs(status: string, search: string, isDisplayHot: string) {
  return http.get('/api/v1/admin/blog?status=' + status + '&search=' + search + '&isDisplayHot=' + isDisplayHot)
}
function getBlogById(id: string) {
  return http.get(`/api/v1/admin/blog/${id}`)
}

function getBlogBySlug(slug: string) {
  return http.get(`/api/v1/user/blog/slug/${slug}`)
}
function getBlogByType(type: string) {
  return http.get(`/api/v1/user/blog/type/${type}`)
}
function updateBlog(id?: string, data?: FormData) {
  return http.put(`/api/v1/admin/blog/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function createBlog(data: FormData) {
  return http.post(`/api/v1/admin/blog`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function deleteBlog(id: string) {
  return http.delete(`/api/v1/admin/blog/${id}`)
}
function getPageBlog(page: string, size: string, sort: string) {
  return http.get(`/api/v1/user/blog/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

export const blogServices = {
  getBlogs,
  getAdminBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  createBlog,
  deleteBlog,
  getPageBlog,
  getBlogByType
}
