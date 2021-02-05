import React, { useState, useEffect } from 'react'
import store from 'store'
import { history, useModel } from 'umi'
import { ConfigProvider, Layout, Menu, Dropdown, Modal, Avatar } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { CaretDownOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons'
import { IRouteComponentProps } from '@umijs/types'
import r from '@/util/request'
import proxyHOC from '@/components/hoc/warpper'
import ZyLeftSide from '@/components/ZyLeftSide'
import ZyHeader from '@/components/ZyHeader'
import './index.sass'

const { Content } = Layout

function logout() {
  r().delete('LoginOut').finally(() => {
    store.clearAll()
    history.replace('/login')
  })
}

const layout: React.FC<IRouteComponentProps> = (props) => {
  if (props.location.pathname === '/login') return <ConfigProvider locale={ zhCN }>{ props.children }</ConfigProvider>

  const [ logoutVisible, setLogoutVisible ] = useState(false)
  const showLogout = () => {
    setLogoutVisible(true)
  }

  const [user, setUser] = useState(useModel('user').user)
  useEffect(() => {
    console.log('userinfo change')
    setUser(user)
  }, [ user ])

  const dropmenu = (
    <Menu className="user-info-dropdown" style={{ width: '120px' }}>
      <div className="user-info">
        <dl>{ user.name }</dl>
        <p>{ user.account }</p>
      </div>
      <ul className="droplist">
        <li className="pointer">
          <UserOutlined />修改信息
        </li>
        <li className="pointer">
          <SafetyOutlined />修改密码
        </li>
      </ul>
      <Menu.Item onClick={ showLogout } className="login-out text-center text-red pointer">退出登录</Menu.Item>
    </Menu>
  )

  return (
    <ConfigProvider locale={ zhCN } input={{ autoComplete: 'off' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <ZyLeftSide />
        <Layout>
          <ZyHeader title="能力开放平台">
            <Dropdown overlay={ dropmenu } className="right" placement="bottomRight">
              <div className="right pointer" style={{ height: 'inherit' }}>
                <div className="header-avater"><Avatar size={ 36 } icon={<UserOutlined />} /></div>
                <div className="header-name">{ user.name } <CaretDownOutlined /></div>
              </div>
            </Dropdown>
          </ZyHeader>

          {/* TODO 权限判断 */}
          <Content>
            { props.children }
          </Content>
        </Layout>
      </Layout>

      {
        logoutVisible ? (
          <Modal
            title="登出确认"
            visible={ true }
            onOk={ logout }
            onCancel={ () => setLogoutVisible(false) }
          >
            <p>确定要登出能力开放平台吗？</p>
          </Modal>
        ) : ''
      }
    </ConfigProvider>
  )
}

export default proxyHOC(layout)