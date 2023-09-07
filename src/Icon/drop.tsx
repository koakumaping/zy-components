import React from 'react'

interface Props {
  style?: React.CSSProperties
  className?: string
}

const Drop: React.FC<Props> = ({ className, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      stroke="currentColor"
      fill="none"
      style={{ ...style }}
      className={ className }
    >
      <g transform="translate(-3.744 0)">
        <rect width="16" height="16" transform="translate(3.744 0)" style={{ fill: 'none', stroke: 'none' }} />
        <path
          style={{
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth:1.5,
          }}
          d="M5.494,5.5l6.25,5,6.25-5"
        />
      </g>
    </svg>
  )
}

export default Drop