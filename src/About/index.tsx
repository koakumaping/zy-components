import React from 'react'
import { Modal } from 'antd'
import './index.sass'

interface Prop {
  name: string
  version: string
  visible: boolean
  onCancel: (e: React.MouseEvent) => void
}

const About: React.FC<Prop> = (prop) => {
  return (
    <Modal
      title="关于"
      visible={ prop.visible }
      onCancel={ (e) => prop.onCancel(e) }
      footer={ null }
      width={ 472 }
    >
      <div className="uias-system-info">
        <h2>{ prop.name }</h2>
        <p>版本 { prop.version }</p>
      </div>
    </Modal>
  )
}

export default About