import React from 'react'
import errorImage from './image-error.png'

interface Props {
  src: string
  alt: string
  style?: React.CSSProperties
}

const ZyImage: React.FC<Props> = props => {
  return (
    <img
      src={ props.src }
      alt={ props.alt }
      style={ props.style }
      onError={(e: any) => {
        e.target.onerror = null
        e.target.src = errorImage
      }}
    />
  )
}

export default ZyImage
