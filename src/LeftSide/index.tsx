import React from 'react'
import { Layout } from 'antd'
import './index.sass'

const ZyLeftSide: React.FC = props => {
  return (
    <Layout.Sider style={{ overflow: 'auto' }} width={208} collapsible={true}>
      { props.children }
    </Layout.Sider>
  )
}

export default ZyLeftSide