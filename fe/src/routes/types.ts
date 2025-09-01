import { ComponentType } from 'react'

export interface LocationStates {
  '/'?: object
  '/chi-tiet-khoa-hoc'?: object
  '/login'?: object
  '/signup'?: object
  '/forgot-pass'?: object
  '/page404'?: object
}

export type PathName = keyof LocationStates

export interface Page {
  path: PathName
  component: ComponentType<unknown>
}
