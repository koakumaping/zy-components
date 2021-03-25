import React, { useState } from 'react'
import { Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import './index.sass'

const ZyLeftSide: React.FC = props => {
  const [ collapsed, setCollapsed ] = useState(false)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout.Sider style={{ overflow: 'auto' }} width={208} trigger={null} collapsible collapsed={collapsed}>
      {
        React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'zy-side-trigger',
          onClick: toggleCollapsed,
        })
      }
      { props.children }
    </Layout.Sider>
  )
}

export default ZyLeftSide