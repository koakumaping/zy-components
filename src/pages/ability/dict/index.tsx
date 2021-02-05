import React from 'react'
import { Button, Space, Input, Popconfirm, Form } from 'antd'
import { noEmptyValidator, noSpecialInput } from '@/util/validators'
import Instruction from '@/components/Instruction/index'
import ZySearchForm from '@/components/ZySearchForm/index'
import Modular from '@/components/Modular/index'
import useZoo from '@/hooks/useZoo'
import { ColumnItem, RowItem } from '@/types'
import Auth from '@/components/auth'
import ZyImage from '@/components/ZyImage'
import ZyTable from '@/components/ZyTable'
import ZyUpload from '@/components/ZyUpload'

const AbilityDict: React.FC = () => {
  const {
    loading,
    list,
    showModular,
    pagination,
    modularProps,
    handleSubmit,
    handleDelete,
  } = useZoo()

  const columns: ColumnItem<RowItem>[] = [
    {
      title: 'LOGO',
      dataIndex: 'logo',
      render: (text: string) => (
        <ZyImage src={ text } alt="logo" style={{ height: '32px' }} />
      ),
    },
    {
      title: '类型名称',
      dataIndex: 'funcName',
    },
    {
      title: '类型描述',
      dataIndex: 'instruction',
      render: (text: string) => (
        <Instruction>{ text }</Instruction>
      ),
    },
    {
      title: '操作',
      width: 160,
      render: (text: number, record) => (
        <Space size="middle">
          <Auth name="mod"><span className="pointer text-main" onClick={ () => { showModular(record) } }>修改</span></Auth>
          <Auth name="del">
            <Popconfirm
              placement="topRight"
              title={ '确定删除 ' + record.funcName + '?'}
              okText="确定"
              cancelText="取消"
              onConfirm={ () => { handleDelete(record) } }
            >
              <span className="pointer text-red">删除</span>
            </Popconfirm>
          </Auth>
        </Space>
      ),
    },
  ]

  return <div className="list-warp">
    <ZyTable
      rowKey={ 'recNum' }
      columns={ columns }
      dataSource={ list }
      loading={ loading }
      pagination={ pagination }
    >
      <ZySearchForm>
        <Auth name="add"><Button onClick={ () => { showModular() } }>新增</Button></Auth>
      </ZySearchForm>
    </ZyTable>

    <Modular { ...modularProps } width={ 600 } onSubmit={ handleSubmit }>
      <Form.Item
        label="LOGO"
        name="logo"
        rules={[{ required: true, validator: noEmptyValidator }]}
        extra="支持jpg、png格式，建议320*320像素，小于500KB"
      >
        <ZyUpload />
      </Form.Item>
      <Form.Item
        label="类型名称"
        name="funcName"
        rules={[{ required: true, validator: noEmptyValidator }]}
      >
        <Input placeholder="类型名称" maxLength={ 16 } />
      </Form.Item>
      <Form.Item
        label="类型描述"
        name="instruction"
        rules={[{ required: false, validator: noSpecialInput }]}
      >
        <Input.TextArea autoSize placeholder="类型描述" maxLength={ 200 } />
      </Form.Item>
    </Modular>
  </div>
}

export default AbilityDict