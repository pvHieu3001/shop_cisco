import { Navigate, Route, Routes } from 'react-router-dom'
import Manager from '../page/admin/index'
import Dashboard from '../page/admin/dashboard/Dashboard'
import Layout from '../page'
import Base from '../page/user'
import PageHome from '../page/user/PageHome'
import UserManagement from '../page/admin/user'
import AddUser from '../page/admin/user/_components/add'
import EditUser from '../page/admin/user/_components/edit'
import CategoryManagement from '@/page/admin/category'
import AddCategory from '@/page/admin/category/_components/add'
import EditCategory from '@/page/admin/category/_components/edit'
import ProductManagement from '@/page/admin/products'
import AddProduct from '@/page/admin/products/_components/add'
import EditProduct from '@/page/admin/products/_components/edit'
import GuardPage from '@/middleware/GuardPage'
import ProductDetailPage from '../page/user/ProductDetailPage/index'
import CategoryDetailPage from '../page/user/CategoryDetailPage/index'
import PageBlog from '../page/user/PageBlog'
import ProductOrdersManagement from '@/page/admin/orders'
import SignUp from '@/page/auth/signup'
import Login from '@/page/auth/login'
import BlogManagement from '@/page/admin/blogs'
import AddBlog from '@/page/admin/blogs/_components/add'
import EditBlog from '@/page/admin/blogs/_components/edit'
import PageSearch from '@/page/user/PageSearch'
import NetworkErrorPage from '@/page/error/NetworkErrorPage'
import NotFoundPage from '@/page/error/NotFoundPage'
import PageCourse from '@/page/user/PageCourse'
import BlogDetailPage from '@/page/user/BlogDetailPage'

export default function Router() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='' element={<Base />}>
            <Route index element={<PageHome />} />
            <Route path='tim-kiem' element={<PageSearch />} />
            <Route path='tat-ca-khoa-hoc' element={<PageCourse />} />
            <Route path='chi-tiet-khoa-hoc/:slug' element={<ProductDetailPage />} />
            <Route path='khoa-hoc-theo-chu-de/:slug' element={<CategoryDetailPage />} />
            <Route path='game' element={<PageBlog />} />
            <Route path='san-pham-cong-nghe' element={<PageBlog />} />
            <Route path='thu-thuat-huu-ich' element={<PageBlog />} />
            <Route path='suu-tam' element={<PageBlog />} />
            <Route path='bai-viet/:slug' element={<BlogDetailPage />} />
          </Route>
          <Route element={<GuardPage />}>
            <Route path='admin' element={<Manager />}>
              <Route index element={<Navigate to='/admin/dashboard' />} />
              <Route path='dashboard' element={<Dashboard />} />

              <Route path='users' element={<UserManagement />}>
                <Route path='add' element={<AddUser />} />
                <Route path=':id' element={<EditUser />} />
              </Route>

              <Route path='products' element={<ProductManagement />}>
                <Route path='add' element={<AddProduct />} />
                <Route path=':flug' element={<EditProduct />} />
              </Route>

              <Route path='orders' element={<ProductOrdersManagement />}>
                <Route path='add' element={<AddProduct />} />
                <Route path=':flug' element={<EditProduct />} />
              </Route>

              <Route path='categories' element={<CategoryManagement />}>
                <Route path='add' element={<AddCategory />} />
                <Route path=':id' element={<EditCategory />} />
              </Route>

              <Route path='blogs' element={<BlogManagement />}>
                <Route path='add' element={<AddBlog />} />
                <Route path=':id' element={<EditBlog />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/network-error' element={<NetworkErrorPage />} />
      </Routes>
    </>
  )
}
