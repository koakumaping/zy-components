import FieldInput from '@/components/JsonSchema/FieldInput'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Col, Row, Select } from 'antd'
import { randomString } from 'evian'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { reorder } from './util'

interface FormItem extends Record<string, any> {
  key: string
  name: string
  type: string | number
  required: number
  example: string
  desc: string
}

const { Option } = Select

interface Props {
  value?: string,
  onChange?: (payload: string) => void
}

interface Data {
  list: FormItem[]
}

const FormList: React.FC<Props> = (props) => {
  let data = []

  try {
    data = props.value ? JSON.parse(props.value) : []
  } catch (error) {
    console.log(error.toString())
  }

  const [ state, setState ] = useState<Data>({
    list: data || [],
  })

  const add2FormList = () => {
    const list = state.list
    list.push({
      key: randomString(8),
      name: '',
      type: 'text',
      required: 1,
      example: '',
      desc: '',
    })
    setState({
      list: list,
    })
  }

  const save2FormList = (name: string, index: number, value: React.ChangeEvent<HTMLInputElement>) => {
    const list = state.list
    list[index][name] = value?.target?.value
    setState({
      list: list,
    })
  }

  const saveSelect2FormList = (name: string, index: number, value: string | number) => {
    const list = state.list
    list[index][name] = value
    setState({
      list: list,
    })
  }

  const del4FormList = (index: number) => {
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

  const formTemlate = (data: FormItem, index: number, payload: any) => {
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
            <FieldInput placeholder="name" defaultValue={ data.name } onChange={ (value) => { save2FormList('name', index, value) } }/>
          </Col>
          <Col span={ 2 }>
            <Select style={{ width: '100%' }} defaultValue={ data.type } onChange={ (value) => { saveSelect2FormList('type', index, value) } }>
              <Option value="text">text</Option>
              <Option value="file">file</Option>
            </Select>
          </Col>
          <Col span={ 2 }>
            <Select style={{ width: '100%' }} defaultValue={ data.required } onChange={ (value) => { saveSelect2FormList('required', index, value) } }>
              <Option value={ 1 }>必需</Option>
              <Option value={ 0 }>非必需</Option>
            </Select>
          </Col>
          <Col span={ 7 }>
            <FieldInput placeholder="参数示例" defaultValue={ data.example } onChange={ (value) => { save2FormList('example', index, value) } } />
          </Col>
          <Col span={ 7 }>
            <FieldInput placeholder="备注" defaultValue={ data.desc } onChange={ (value) => { save2FormList('desc', index, value) } } />
          </Col>
          <Col span={ 1 }>
            <DeleteOutlined className="form-row-del" onClick={ () => { del4FormList(index) } }/>
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
      <Button onClick={ add2FormList } style={{ marginBottom: '16px' }}>添加Form参数</Button>
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
                    formTemlate(item, index, provided)
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

export default FormList