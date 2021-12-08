import React, { ReactNode } from 'react'
import { Layout } from 'antd'
import defaultLogo from './image/logo.png'

const { Header } = Layout

interface Props {
  title: string | ReactNode | ReactNode[]
  logo?: string
  children?: ReactNode | ReactNode[]
  style?: React.CSSProperties
}

const ZyHeader: React.FC<Props> = ({title, logo, children}) => {
  return (
    <Header className="header">
      <div className="left header-logo">
        <img src={ logo || defaultLogo } alt="logo" />
        <span>{ title }</span>
      </div>
      { children }
    </Header>
  )
}

export default ZyHeader
