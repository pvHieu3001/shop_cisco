export const getImageUrl = (url: string): string => {
  const domain = import.meta.env.VITE_DOMAIN_URL
  return url.startsWith('/') ? `${domain}uploads/${url}` : `${domain}/uploads/${url}`
}
