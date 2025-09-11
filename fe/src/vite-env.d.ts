/// <reference types="vite/client" />

import type * as React from 'react'

declare namespace JSX {
  interface IntrinsicElements {
    'amp-ad': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      type?: string
      width?: string | number
      height?: string | number
      layout?: string
      'data-ad-client'?: string
      'data-ad-slot'?: string
      [key: string]: unknown
    }
  }
}
