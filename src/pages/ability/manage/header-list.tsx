import FieldInput from '@/components/JsonSchema/FieldInput'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Col, Row, Select } from 'antd'
import { randomString } from 'evian'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { reorder } from './util'

interface HeaderItem extends Record<string, any> {
  key: string
  name: string
  value: string
  example: string
  desc: string
}

const { Option } = Select

const HTTP_REQUEST_HEADER = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Datetime',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Cookie',
  'Content-Disposition',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'Expect',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Max-Forwards',
  'Origin',
  'Pragma',
  'Proxy-Authorization',
  'Range',
  'Referer',
  'TE',
  'User-Agent',
  'Upgrade',
  'Via',
  'Warning',
  'X-Requested-With',
  'DNT',
  'X-Forwarded-For',
  'X-Forwarded-Host',
  'X-Forwarded-Proto',
  'Front-End-Https',
  'X-Http-Method-Override',
  'X-ATT-DeviceId',
  'X-Wap-Profile',
  'Proxy-Connection',
  'X-UIDH',
  'X-Csrf-Token'
]

interface Props {
  value?: string,
  onChange?: (payload: string) => void
}

interface Data {
  list: HeaderItem[]
}

const HeaderList: React.FC<Props> = (props) => {
  let data = []

  try {
    data = props.value ? JSON.parse(props.value) : []
  } catch (error) {
    console.log(error.toString())
  }

  const [ state, setState ] = useState<Data>({
    list: data || [],
  })

  const add2HeaderList = () => {
    const list = state.list
    list.push({
      key: randomString(8),
      name: '',
      value: '',
      example: '',
      desc: '',
    })
    setState({
      list: list,
    })
  }

  const save2HeaderList = (name: string, index: number, value: React.ChangeEvent<HTMLInputElement>) => {
    const list = state.list
    list[index][name] = value?.target?.value
    setState({
      list: list,
    })
  }

  const saveSelect2HeaderList = (name: string, index: number, value: string | number) => {
    const list = state.list
    list[index][name] = value
    setState({
      list: list,
    })
  }

  const del4HeaderList = (index: number) => {
    const list = state.list
    list.splice(index, 1)
    setState({
      list: list,
    })
  }

  const formDropEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const items = reorder(
      state.list,
      result.source.index,
      result.destination.index
    )
    setState({
      list: items,
    })
  }

  const headerTemlate = (data: HeaderItem, index: number, payload: any) => {
    return (
      <div
        ref={ payload.innerRef }
        {...payload.draggableProps}
        {...payload.dragHandleProps}
        className="form-row"
      >
        <Row gutter={ 2 }>
          <Col span={ 1 } className="form-row-drag">
            <UnorderedListOutlined />
          </Col>
          <Col span={ 4 }>
            <AutoComplete
              style={{ width: '100%' }}
              filterOption={
                (inputValue, option) => {
                  return option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              }
              placeholder="参数名称"
              onSelect={ (value) => { saveSelect2HeaderList('name', index, value) } }
              onChange={ (value) => { saveSelect2HeaderList('name', index, value) } }
              defaultValue={ data.name }
            >
              {
                HTTP_REQUEST_HEADER.map((name: string) => (
                  <Option key={ name } value={ name }>
                    { name }
                  </Option>
                ))
              }
            </AutoComplete>
          </Col>
          <Col span={ 2 }>
            <FieldInput placeholder="参数值" defaultValue={ data.value } onChange={ (value) => { save2HeaderList('value', index, value) } } />
          </Col>
          <Col span={ 8 }>
            <FieldInput placeholder="参数示例"  defaultValue={ data.example } onChange={ (value) => { save2HeaderList('example', index, value) } } />
          </Col>
          <Col span={ 8 }>
            <FieldInput placeholder="备注"  defaultValue={ data.desc } onChange={ (value) => { save2HeaderList('desc', index, value) } } />
          </Col>
          <Col span={ 1 }>
            <DeleteOutlined className="form-row-del" onClick={ () => { del4HeaderList(index) } }/>
          </Col>
        </Row>
      </div>
    )
  }

  useEffect(() => {
    if (props.onChange) props.onChange(JSON.stringify(state.list))
  }, [ state ])

  useEffect(() => {
    console.log('form-list props.value change', props.value)
    try {
      setState({
        list: props.value ? JSON.parse(props.value) : [],
      })
    } catch (error) {
      console.log(error.toString())
    }
  }, [ props.value ])

  return (
    <DragDropContext onDragEnd={ formDropEnd }>
      <Button onClick={ add2HeaderList } style={{ marginBottom: '16px' }}>添加Header参数</Button>
      <Droppable
        droppableId={ 'form' }
      >
        {(provided, snapshot) => (
          <div
            { ...provided.droppableProps }
            ref={provided.innerRef}
          >
            {
              state.list.map((item, index) => (
                <Draggable key={ item.key } draggableId={ item.key } index={ index }>
                  {(provided, snapshot) => (
                    headerTemlate(item, index, provided)
                  )}
                </Draggable>
              )) 
            }
            { provided.placeholder }
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default HeaderList