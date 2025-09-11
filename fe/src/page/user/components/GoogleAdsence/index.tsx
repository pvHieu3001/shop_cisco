import { useEffect } from 'react'

const GoogleAdsence = ({ client, slot, format = 'auto' }: { client: string; slot: string; format?: string }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.error('Adsense error', e)
    }
  }, [])

  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive='true'
    />
  )
}

export default GoogleAdsence
