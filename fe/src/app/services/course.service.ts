import http from '../http-common'

function getCourses(status?: string, search?: string, isDisplayHot?: string) {
  return http.get('/api/v1/user/course?status=' + status + '&search=' + search + '&isDisplayHot=' + isDisplayHot)
}
function getAdminCourses(status?: string, search?: string, isDisplayHot?: string) {
  return http.get('/api/v1/admin/course?status=' + status + '&search=' + search + '&isDisplayHot=' + isDisplayHot)
}
function getRecommendCourses() {
  return http.get('/api/v1/user/course/recommend')
}
function getQuickViewCourses() {
  return http.get('/api/v1/user/course/quick_view')
}
function getCourseById(id: string) {
  return http.get(`/api/v1/admin/course/${id}`)
}
function getCourseBySlug(slug: string) {
  return http.get(`/api/v1/user/course/slug/${slug}`)
}
function updateCourse(id: string, data: FormData) {
  return http.put(`/api/v1/admin/course/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function createCourse(data: FormData) {
  return http.post(`/api/v1/admin/course`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
function deleteCourse(id: string) {
  return http.delete(`/api/v1/admin/course/${id}`)
}
function getPageCourse(page: string, size: string, sort: string) {
  return http.get(`/api/v1/user/course/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

function getCoursesByCategory(categoryId: number) {
  return http.get(`/api/v1/user/course/category/${categoryId}`)
}

export const courseServices = {
  getCourses,
  getAdminCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  createCourse,
  deleteCourse,
  getPageCourse,
  getCoursesByCategory,
  getRecommendCourses,
  getQuickViewCourses
}
