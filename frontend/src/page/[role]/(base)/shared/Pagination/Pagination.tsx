import { CustomLink } from '../../../../../data/types'
import { FC } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import twFocusClass from '../../../../../utils/twFocusClass'

export type Page = {
  label: string
  url: string
  active: boolean
}

export interface PaginationProps {
  className?: string
  dataLinks: Page[]
  onChangePage: (keyword: string | null, page: string) => void
}

const Pagination: FC<PaginationProps> = ({ className = '', dataLinks, onChangePage }) => {
  const [searchParams] = useSearchParams()

  const renderItem = (pag: Page, index: number) => {
    if (!pag.url || isNaN(+pag.label)) {
      return
    }
    if (pag.active) {
      // RETURN ACTIVE PAGINATION
      return (
        <span
          key={index}
          className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`}
        >
          {pag.label}
        </span>
      )
    }
    // RETURN UNACTIVE PAGINATION
    return (
      <Link
        key={index}
        className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
        to={`/page-search?keyword=${searchParams.get('keyword')}&page=${pag.label}`}
        onClick={() => onChangePage(searchParams.get('keyword'), pag.label)}
      >
        {pag.label}
      </Link>
    )
  }

  return (
    <nav className={`nc-Pagination inline-flex space-x-1 text-base font-medium ${className}`}>
      {dataLinks?.map(renderItem)}
    </nav>
  )
}

export default Pagination
