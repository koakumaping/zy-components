import { ExclamationCircleFilled } from '@ant-design/icons'
import { Button, Modal, Space } from 'antd'
import { ButtonProps } from 'antd/es/button'
import React, { useState } from 'react'
import './index.sass'

interface Props {
  width?: number
  title: string
  children: React.ReactNode | React.ReactNode[]
  onConfirm: (e: React.MouseEvent) => void
  onCancel?: (e: React.MouseEvent) => void
  okText?: string
  okType?: 'text' | 'link' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined
  okButtonProps?: ButtonProps
  cancelText?: string
  cancelButtonProps?: ButtonProps
  icon?: React.ReactNode
  disabled?: boolean
  extra?: string | React.ReactNode | React.ReactNode[]
}

const Modalconfirm: React.FC<Props> = (props) => {
  const [ innervisible, setInnervisible ] = useState(false)
  const {
    width,
    title,
    children,
    onConfirm,
    onCancel,
    okText,
    okType,
    okButtonProps,
    cancelText,
    cancelButtonProps,
    icon,
    disabled,
    extra,
  } = props

  const handleOk = (e: React.MouseEvent) => {
    onConfirm(e)
    setInnervisible(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    if (onCancel) onCancel(e)
    setInnervisible(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      onConfirm(e)
      return
    }
    setInnervisible(true)
  }

  return (
    <>
      { React.cloneElement(children as any, { onClick: (e) => handleClick(e) } ) }
      <Modal
        visible={ innervisible }
        footer={ null }
        destroyOnClose={ true }
        maskClosable={ false }
        width={ width ? width : 320 }
        closable={ false }
      >
        <div className="zy-modalconfirm-content">
          <div className="zy-modalconfirm-message">
            { icon }
            <div className="zy-modalconfirm-title">{ title }</div>
          </div>
          {
            extra ? <div className="zy-modalconfirm-extra">{ extra }</div> : null
          }
          <div className="zy-modalconfirm-action">
            <Space>
              <Button onClick={ (e) => { handleCancel(e) } } { ...cancelButtonProps }>{ cancelText }</Button>
              <Button type={ okType } onClick={ (e) => { handleOk(e) } } { ...okButtonProps }>{ okText }</Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  )
}

Modalconfirm.defaultProps = {
  okType: 'primary',
  okText: '确定',
  cancelText: '取消',
  icon: <ExclamationCircleFilled />,
  disabled: false,
}

export default Modalconfirm