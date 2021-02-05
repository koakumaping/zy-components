import React from 'react'
import { Menu, Layout } from 'antd'
import store from 'store'
import { AppstoreOutlined, DashboardOutlined, MergeCellsOutlined, DeploymentUnitOutlined, CloudOutlined, HomeOutlined, SettingOutlined, AreaChartOutlined, BlockOutlined, AlertOutlined } from '@ant-design/icons'
import { useModel, history } from 'umi'

import './index.sass'

interface IconType {
  [key: string]: any
}

const { Sider } = Layout
const { SubMenu } = Menu

function onSelect(payload: any) {
  const path = payload.item.props['data-path']
  store.set('currentMenu', payload.key)
  if (path) history.push(path)
}

const icons: IconType = {
  'HomeOutlined': HomeOutlined,
  'SettingOutlined': SettingOutlined,
  'DashboardOutlined': DashboardOutlined,
  'AppstoreOutlined': AppstoreOutlined,
  'MergeCellsOutlined': MergeCellsOutlined,
  'DeploymentUnitOutlined': DeploymentUnitOutlined,
  'CloudOutlined': CloudOutlined,
  'AreaChartOutlined': AreaChartOutlined,
  'BlockOutlined': BlockOutlined,
  'AlertOutlined': AlertOutlined,
}

function getIcon(name: string | void): any {
  if (!name) return null
  const Icon: any = icons[name] || DashboardOutlined
  return <Icon />
}

const LeftSide: React.FC = () => {
  const currentMenu = store.get('currentMenu')
  const { menuList, getMenuList, pList } = useModel('menu')
  if (pList.length === 0) getMenuList()

  return (
    <Sider
      style={{ overflow: 'auto' }}
      width={ 208 }
      collapsible={ true }
    >
      <Menu
        defaultSelectedKeys={[ currentMenu || 'home' ]}
        defaultOpenKeys={[ currentMenu ? currentMenu.split('-')[0] : '' ]}
        mode="inline"
        theme="dark"
        onSelect={ onSelect }
      >
        {
          menuList.map(menu => {
            if (menu.children) return <SubMenu key={ menu.key } title={ menu.label } icon={ getIcon(menu.icon) }>
              {
                menu.children.map(submenu => {
                  return <Menu.Item key={ submenu.key } data-path={ submenu.path } disabled={ !submenu.path }>{ submenu.label }</Menu.Item>
                })
              }
            </SubMenu>
            return <Menu.Item
              key={ menu.key }
              title={ menu.label }
              data-path={ menu.path }
              disabled={ !menu.path }
              icon={ getIcon(menu.icon) }
            >
              { menu.label }
            </Menu.Item>
          })
        }
      </Menu>
    </Sider>
  )
}

export default LeftSide