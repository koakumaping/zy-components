import React, { ReactNode } from 'react'
import { Layout } from 'antd'
import defaultLogo from './image/logo.png'
import './index.sass'

const { Header } = Layout

interface Props {
  title: string | ReactNode | ReactNode[]
  logo?: string
  children?: ReactNode | ReactNode[]
  style?: React.CSSProperties
  loading?: boolean
}

const ZyHeader: React.FC<Props> = ({title, logo, loading, children}) => {
  return (
    <Header className="header">
      <div className="left header-logo">
        {
          loading ? (
            <div className="logo-space"></div>
          ) : (
            <img src={ logo || defaultLogo } alt="logo" />
          )
        }
        <span>{ title }</span>
      </div>
      { children }
    </Header>
  )
}

export default ZyHeader
