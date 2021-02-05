import React from 'react'
import { Tooltip } from 'antd'

interface Props {
  children: string
}

const Instruction: React.FC<Props> = (props) => {
  return <Tooltip title={ props.children }>
    <span>
      { props.children?.substring(0, 20) }
      {
        props.children.length >= 20 ? '...' : null
      }
    </span>
  </Tooltip>
}

export default Instruction