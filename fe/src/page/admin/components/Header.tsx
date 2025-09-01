import React, { useState, useEffect } from 'react'

import { Badge, Button, List, Avatar, Drawer, Space, Flex, Menu, Dropdown } from 'antd'
import { StarOutlined, LikeOutlined, MessageOutlined, HomeOutlined } from '@ant-design/icons'
import { setMiniSidenav, setNotification } from '../../../app/slices/web.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '@/app/store'
import { userActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'

function Header() {
  const { notification } = useSelector((state: RootState) => state.web)
  const [showSidenav, setShowSidenav] = useState(false)
  const dispatch = useDispatch()

  const data = Array.from({ length: 2 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  }))

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  const handleLogout = () => {
    dispatch(userActions.logout() as unknown as AnyAction)
  }

  const menu = (
    <Menu>
      <Menu.Item key='0'>
        <Link to='/admin/profile'>Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key='1'>
        <Link to='/admin/settings'>Cài đặt</Link>
      </Menu.Item>
      <Menu.Item key='2'>
        <Button type='link' onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Menu.Item>
    </Menu>
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setShowSidenav(true)
      } else {
        setShowSidenav(false)
        dispatch(setMiniSidenav(true))
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
  })

  return (
    <>
      <Drawer
        className='settings-drawer'
        mask={true}
        width={1000}
        onClose={() => dispatch(setNotification(false))}
        open={notification}
      >
        <List
          itemLayout='vertical'
          size='large'
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[
                <IconText icon={StarOutlined} text='156' key='list-vertical-star-o' />,
                <IconText icon={LikeOutlined} text='156' key='list-vertical-like-o' />,
                <IconText icon={MessageOutlined} text='2' key='list-vertical-message' />
              ]}
              extra={
                <img width={272} alt='logo' src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' />
              }
            >
              <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={<a href={item.href}>{item.title}</a>} />
              {item.content}
            </List.Item>
          )}
        />
      </Drawer>
      <Flex gap={10} justify='space-between' align='center'>
        <Link to='/' className='flex items-center gap-2 text-black hover:text-blue-500 transition-colors duration-200'>
          <HomeOutlined className='text-black text-xl' />
          <span>Trang chủ</span>
        </Link>
        <Flex align='center' gap={20}>
          <Badge size='small' count={4}>
            <a href='#pablo' className='ant-dropdown-link' onClick={() => dispatch(setNotification(true))}>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' key={0}>
                <path
                  d='M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z'
                  fill='#111827'
                ></path>
                <path d='M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z' fill='#111827'></path>
              </svg>
            </a>
          </Badge>
          <Flex align='center' gap={10} justify='center' className='rounded-[999px]'>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type='text' className='flex items-center gap-2'>
                <Avatar
                  src='https://api.dicebear.com/7.x/miniavs/svg?seed=1'
                  className=' bg-gray-200 w-[28px] h-[28px]'
                />
                <span className='hidden md:inline'>Xin chào, User</span>
              </Button>
            </Dropdown>
          </Flex>
          {showSidenav && (
            <Button type='link' className='sidebar-toggler' onClick={() => dispatch(setMiniSidenav(false))}>
              <svg width='20' height='20' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' key={0}>
                <path d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'></path>
              </svg>
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default Header
