import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Spin, message, Space } from 'antd'
import { LayoutProps } from '@/types'
import { ModularProps } from '@/hooks/useZoo'
import { isEmptyObject } from 'evian'

const defaultLayout: LayoutProps = Object.defineProperties(
  {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
  {
    labelCol: {
      writable: false,
      configurable: false,
    },
    wrapperCol: {
      writable: false,
      configurable: false,
    },
  }
)

const defaultTailLayout: LayoutProps = Object.defineProperties(
  {
    wrapperCol: { offset: 0, span: 24 },
  },
  {
    wrapperCol: {
      writable: false,
      configurable: false,
    },
  }
)

const Modular: React.FC<ModularProps> = (props) => {
  const {
    rowId,
    form,
    setForm,
    loading,
    onSubmit,
    visible,
    setVisible,
    width,
    children,
    title,
    formLayout,
  } = props

  const [ modalVisible, setModalVisible ] = useState(false)
  const layout = formLayout === 'vertical' ? {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  } : props.layout || defaultLayout
  const tailLayout = props.tailLayout || defaultTailLayout

  const [ formInstance ] = Form.useForm()
  const onClose = () => {
    setForm({})
    setVisible(false)
  }

  const onFormCheckFailed = () => {
    message.error('请检查表单数据，有信息未按要求填写')
  }

  useEffect(() => {
    setModalVisible(visible)
  }, [ visible ])

  useEffect(() => {
    if (!modalVisible) return
    if (isEmptyObject(form)) {
      formInstance.resetFields()
      return
    }
    formInstance.setFieldsValue(form)
  }, [ form ])

  let newTitle = '新增'
  let modTitle = '修改'

  if (title?.length === 2) {
    newTitle = title[0]
    modTitle = title[1]
  }

  return (
    modalVisible ?
    <Modal
      title={ rowId > 0 ? modTitle : newTitle }
      visible={ true }
      footer={ null }
      width={ width ? width : 520 }
      destroyOnClose={ true }
      onCancel={ onClose }
      maskClosable={ false }
    >
      <Spin spinning={ loading }>
        <Form
          initialValues={ form }
          form={ formInstance }
          { ...layout }
          onFinish={ onSubmit }
          onFinishFailed={ onFormCheckFailed }
          layout={ formLayout }
        >
          { children }
          <Form.Item { ...tailLayout } className="action text-right">
            <Space>
              <Button onClick={ onClose } disabled={ loading }>取消</Button>
              <Button type="primary" htmlType="submit" disabled={ loading }>保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
    :
    null
  )
}

export default Modular