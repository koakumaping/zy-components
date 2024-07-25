import React from 'react'

import './index.sass'

interface Props {
  style?: React.CSSProperties
  className?: string
  name: string
}

const ZyMenuIcon: React.FC<Props> = ({ className, style, name }) => {
  return (
    <span className={ `zymenu-icon zymenufont ${name}${className ? ' ' : ''}${className ? className : ''}` } style={ style }></span>
  )
}

export default ZyMenuIcon