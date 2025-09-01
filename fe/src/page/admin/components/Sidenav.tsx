import { Menu, Flex } from 'antd'
import UseSidenav from '../../../utils/UseSidenav'
import { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import {
  ReadOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  ShoppingCartOutlined,
  DashboardOutlined
} from '@ant-design/icons'

function Sidenav() {
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([])

  const useSidenav = UseSidenav({
    components: [
      {
        label: (
          <Flex align='center' gap={10} justify='center' className='children-menu'>
            <ReadOutlined className='text-[18px] text-[#344767]' />
            <span className='label font-bold text-[#344767]'>Khóa học</span>
          </Flex>
        ),
        link: '/admin/products'
      },
      {
        label: (
          <Flex align='center' gap={10} justify='center' className='children-menu'>
            <TagsOutlined className='text-[18px] text-[#344767]' />
            <span className='label font-bold text-[#344767]'>Danh mục</span>
          </Flex>
        ),
        link: '/admin/categories'
      },
      {
        label: (
          <Flex align='center' gap={10} justify='center' className='children-menu'>
            <TagsOutlined className='text-[18px] text-[#344767]' />
            <span className='label font-bold text-[#344767]'>Bài viết</span>
          </Flex>
        ),
        link: '/admin/blogs'
      },
      {
        label: (
          <Flex align='center' gap={10} justify='center' className='children-menu'>
            <UsergroupAddOutlined className='text-[18px] text-[#344767]' />
            <span className='label font-bold text-[#344767]'>Người dùng</span>
          </Flex>
        ),
        link: '/admin/users'
      },
      {
        label: (
          <Flex align='center' gap={10} justify='center' className='children-menu'>
            <ShoppingCartOutlined className='text-[18px] text-[#344767]' />
            <span className='label font-bold text-[#344767]'>Order</span>
          </Flex>
        ),
        link: '/admin/orders'
      },
      {
        label: (
          <Flex align='center' gap={10} justify='center' className='children-menu'>
            <DashboardOutlined className='text-[18px] text-[#344767]' />
            <span className='label font-bold text-[#344767]'>Dashboard</span>
          </Flex>
        ),
        link: '/admin/dashboard'
      }
    ]
  })

  interface LevelKeysProps {
    key?: string
    children?: LevelKeysProps[]
  }

  const items = useSidenav.getMenu()

  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {}
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level
        }
        if (item.children) {
          func(item.children, level + 1)
        }
      })
    }
    func(items1)
    return key
  }

  const levelKeys = getLevelKeys(items as LevelKeysProps[])

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1)
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey])

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      )
    } else {
      // close
      setStateOpenKeys(openKeys)
    }
  }

  useEffect(() => {
    const defaultActiveString = useSidenav.getKeyActive().map((num) => num.toString())
    setStateOpenKeys(defaultActiveString)
  }, [])

  return (
    <>
      <Flex align='center' gap={10}>
        <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-black' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2L1 7l11 5 9-4.09V17h2V7L12 2z' />
          <path d='M11 12.83L3.26 9.26 2 9.91l9 4.09 9-4.09-1.26-.65L13 12.83V20h-2v-7.17z' />
        </svg>

        <span className='text-black font-semibold text-lg'>Chia Sẻ Khóa Học</span>
      </Flex>

      <Menu
        theme='light'
        mode='inline'
        triggerSubMenuAction='click'
        openKeys={stateOpenKeys}
        defaultSelectedKeys={stateOpenKeys}
        items={items}
        onOpenChange={onOpenChange}
        className='mt-2'
      />
    </>
  )
}

export default Sidenav
