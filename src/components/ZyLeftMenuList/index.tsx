import React from 'react'

interface Props {
  title: string
  children: React.ReactNode | React.ReactNode[]
}

const ZyLeftMenuList: React.FC<Props> = (props) => {
  return (
    <div className="left-menu-list">
      <dl className="left-menu-warp">
        <dt className="left-menu-title">{ props.title }</dt>
        <ul>
          { props.children }
        </ul>
      </dl>
    </div>
  )
}

export default ZyLeftMenuList