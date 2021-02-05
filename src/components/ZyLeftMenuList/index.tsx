import React from 'react'

interface Props {
  title: string
  children: React.ReactNode | React.ReactNode[]
}

const ZyLeftMenuList: React.FC<Props> = (props) => {
  return (
    <div className="left-menu-list">
      <dl className="left-menu-warp">
        <dt className="left-menu-title">服务开发商</dt>
        <ul>
          { props.children }
        </ul>
      </dl>
    </div>
  )
}

export default ZyLeftMenuList