import { Outlet } from 'react-router-dom'
import ListAffiliate from './_components/list'

export default function AffiliateManagement() {
  return (
    <div>
      <ListAffiliate />
      <Outlet />
    </div>
  )
}
