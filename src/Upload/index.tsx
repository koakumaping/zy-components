import React, { CSSProperties, useEffect, useState } from 'react'
import store from 'store'
import { message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './index.sass'

interface Props {
  value?: string
  onChange?: (value: string | null) => void
  style?: CSSProperties
}

function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    // message.error('You can only upload JPG/PNG file!')
    message.error('只能上传JPG/PNG 文件')
  }
  const isLt500KB = file.size < 1024 * 500
  if (!isLt500KB) {
    // message.error('Image must smaller than 500KB!')
    message.error('必须小于500KB！')
  }
  return isJpgOrPng && isLt500KB
}

const ZyUpload: React.FC<Props> = props => {
  const { value, onChange, style } = props

  const [currentValue, setCurrentValue] = useState(value)
  const [loading, setLoading] = useState(false)
  const [fileList] = useState([])

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const uploadButton = (
    <>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </>
  )

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
    }
    if (info.file.status === 'error') {
      message.error('上传失败')
      setLoading(false)
    }
    if (info.file.status === 'done') {
      let res = info.file.response
      if (info.file.response.code === -1) {
        setLoading(false)
        message.error(info.file.response.msg)
        res = ''
      }
      setCurrentValue(res)
      if (onChange) {
        onChange(res)
      }
      setLoading(false)
    }
  }

  return (
    <Upload
      showUploadList={ false }
      listType="picture-card"
      action="/ocp/manager/common/upload"
      beforeUpload={ beforeUpload }
      onChange={ handleChange }
      accept=".jpg, .jpeg, .png"
      fileList={ fileList }
      headers={{
        Authorization: store.get('token'),
      }}
      style={ style }
    >
      <div>
        { currentValue ? <img src={currentValue} alt="avatar" /> : uploadButton }
      </div>
    </Upload>
  )
}

export default ZyUpload
