export const getImageUrl = (url: string): string => {
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  const domain = import.meta.env.VITE_DOMAIN_URL
  return url.startsWith('/') ? `${domain}uploads/${url}` : `${domain}/uploads/${url}`
}
