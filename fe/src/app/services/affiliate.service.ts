import http from '../http-common'

function getAffiliates(search: string) {
  return http.get('/api/v1/user/affiliate?search=' + search)
}
function getAdminAffiliates(search: string) {
  return http.get('/api/v1/admin/affiliate?search=' + search)
}
function getAffiliateById(id: string) {
  return http.get(`/api/v1/admin/affiliate/${id}`)
}
function getRandomAffiliate() {
  return http.get(`/api/v1/user/affiliate/random`)
}
function updateAffiliate(id?: string, data?: FormData) {
  return http.put(`/api/v1/admin/affiliate/${id}`, data)
}
function createAffiliate(data: FormData) {
  return http.post(`/api/v1/admin/affiliate`, data)
}
function deleteAffiliate(id: string) {
  return http.delete(`/api/v1/admin/affiliate/${id}`)
}
function getPageAffiliate(page: string, size: string, sort: string) {
  return http.get(`/api/v1/user/affiliate/pageable/?page=${page}&size=${size}&sort=${sort}`)
}

export const affiliateServices = {
  getAffiliates,
  getAdminAffiliates,
  getAffiliateById,
  getRandomAffiliate,
  updateAffiliate,
  createAffiliate,
  deleteAffiliate,
  getPageAffiliate
}
