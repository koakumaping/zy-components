import React from 'react'

import './index.sass'

interface Props {
  style?: React.CSSProperties
  className?: string
  name: string
}

const ZyIcon: React.FC<Props> = ({ className, style, name }) => {
  return (
    <span className={ `zy-icon zyfont zyfont-${name}${className ? ' ' : ''}${className ? className : ''}` } style={ style }></span>
  )
}

export default ZyIcon