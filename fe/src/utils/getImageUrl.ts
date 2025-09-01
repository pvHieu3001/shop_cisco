export const getImageUrl = (url: string): string => {
  const domain = import.meta.env.VITE_DOMAIN_IMAGE_URL
  return url.startsWith('/') ? `${domain}${url}` : `${domain}/${url}`
}
