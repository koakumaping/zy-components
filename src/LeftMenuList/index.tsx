import React from 'react'
import './index.sass'

interface Props {
  title: string | React.ReactNode | React.ReactNode[]
  extra: string | React.ReactNode | React.ReactNode[]
  children: React.ReactNode | React.ReactNode[]
}

const ZyLeftMenuList: React.FC<Props> = props => {
  return (
    <div className="left-menu-list">
      <div className="left-menu-warp">
        <div className="left-menu-head">
          <div className="left-menu-head-wrapper">
            <div className="left-menu-head-title">{ props.title }</div>
            <div className="left-menu-head-extra">{ props.extra }</div>
          </div>
        </div>
        <ul>{ props.children }</ul>
      </div>
    </div>
  )
}

export default ZyLeftMenuList
