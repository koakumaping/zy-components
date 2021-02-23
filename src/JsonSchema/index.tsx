import React, { useRef, useEffect, useState } from 'react'
import {
  Row,
  Col,
  Input,
  Select,
  Tooltip,
  Checkbox,
  message,
  Dropdown,
  Menu,
} from 'antd'
import { PlusOutlined, CloseOutlined, CaretDownOutlined } from '@ant-design/icons'
import * as util from './util'
import { clone, randomString } from 'evian'
import FieldInput from './FieldInput'
import './index.sass'

const { Option } = Select

interface PropItem {
  [propName: string]: {
    type: string
    description?: string
    required?: number
    format?: string
    items?: ArrayItem
    properties?: PropItem
  }
}

interface ArrayItem {
  type: string
}

interface JsonSchema {
  $schema?: string
  type: string
  title?: string
  description: string
  required: string[]
  format?: string
  items?: ArrayItem
  properties?: PropItem
  checked: boolean
}

interface State {
  checked: boolean
  data: JsonSchema
}

interface Props {
  value?: string,
  onChange?: (payload: string) => void
}

const defaultData: JsonSchema = {
  title: 'json-schema',
  $schema: 'https://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {},
  required: [],
  checked: false,
  description: '',
}

const defaultDataString = '{"title":"json-schema","$schema":"https://json-schema.org/draft-04/schema#","type":"object","properties":{},"required":[],"checked":false,"description":""}'

const JsonSchema: React.FC<Props> = (props) => {
  let data = clone(defaultData)

  const prevValueRef = useRef(props.value)
  try {
    data = props.value ? JSON.parse(props.value) : clone(defaultData)
  } catch (error) {
    console.log(error.toString())
  }

  const [state, setState] = useState<State>({
    checked: false,
    data: data,
  })

  useEffect(() => {
    if (props.value !== prevValueRef.current) {
      prevValueRef.current = props.value || defaultDataString
      try {
        data = props.value ? JSON.parse(props.value) : clone(defaultData)
      } catch (error) {
        console.log(error.toString())
      }
      setState({
        checked: false,
        data: data,
      })
    }
  }, [ props.value ])

  useEffect(() => {
    if (props.onChange) props.onChange(JSON.stringify(state.data))
  }, [ state ])


  const SchemaArray = (prefix: string[], data: any, index: number) => {
    const prefixArray = [...prefix, 'items']
    const items = data.items
    const tabLength = prefixArray.length

    // 修改数据类型
    // 修改数据类型
    const handleChangeType = (e: any) => {
      console.log(prefixArray)
      let keys = [...prefixArray, 'type']
      const value = e
  
      let parentKeys = util.getParentKeys(keys)
      let oldData = json
      let parentData = util.getData(oldData, parentKeys)
      if (parentData.type === value) {
        return
      }
      // let newParentData = utils.defaultSchema[value];
      let newParentDataItem = util.defaultSchema[value]
  
      // 将备注过滤出来
      let parentDataItem = parentData.description ? { description: parentData.description } : {}
      let newParentData = Object.assign({}, newParentDataItem, parentDataItem)
  
      let newKeys = [...parentKeys]
      console.log(newKeys, newParentData)
      util.setData(json, newKeys, newParentData)
      setState({
        checked: state.checked,
        data: json,
      })
      console.log(json)
    }

    //  增加子节点
    const handleAddChildField = () => {
      console.log('handleAddChildField', [...prefixArray, 'properties'])
      const json = util.addChildFieldAction(state, [...prefixArray, 'properties'])
      setState({
        checked: state.checked,
        data: json,
      })
    }

    return(
      <div key={ index } >
        <Row gutter={ 2 } className="json-schema__row">
          <Col span={ 10 } style={{ paddingLeft: `${tabLength * 8}px` }}>
            <Row>
              <Col span={ 2 } className="json-schema__row-caret">
                { items.type === 'object' ? <CaretDownOutlined /> : null }
              </Col>
              <Col span={ 22 }>
                <FieldInput defaultValue="Items" disabled addonAfter={ <div style={{ width: '16px' }}></div> } maxLength={ 64 }/>
              </Col>
            </Row>
          </Col>
          <Col span={ 4 }>
            <Select style={{ width: '100%' }} defaultValue={ items.type } onChange={ handleChangeType }>
              {
                util.SCHEMA_TYPE.map((item, index) => {
                  return <Option value={ item } key={ index }>{ item }</Option>
                })
              }
            </Select>
          </Col>
          <Col span={ 8 }>
            <FieldInput placeholder="备注" defaultValue={ items.description } maxLength={ 200 } />
          </Col>
          <Col span={ 2 }>
            {
              items.type === 'object' ? (
                <PlusOutlined className="json-schema__row-add" onClick={ handleAddChildField } />
              ) : null
            }
          </Col>
        </Row>
        <div className="children-item">
          { mapping(prefixArray, items) }
        </div>
      </div>
    )
  }
  
  const SchemaItem = (prefix: string[], name: string, data: any,  index: number | string) => {
    const value = data.properties[name]
    const prefixArray = [...prefix, name]
    // console.log('SchemaItem', prefixArray, name, value)
    const tabLength = prefixArray.length
  
    // 修改节点字段名
    const handleChangeName = (e: any) => {
      const keys = prefix
      const value = e.target.value
      if (data.properties[value] && typeof data.properties[value] === 'object') {
        message.error(`字段 "${value}" 已经存在`)
        return
      }

      let oldData = json
      let parentKeys = util.getParentKeys(keys)
      let parentData = util.getData(oldData, parentKeys)
      let requiredData: any[] = [].concat(parentData.required || [])
      let propertiesData = util.getData(oldData, keys)
      let newPropertiesData: Record<string, any> = {}
  
      let curData = propertiesData[name];
      let openKeys = [...keys, value, 'properties'].join(util.JSONPATH_JOIN_CHAR);
      let oldOpenKeys = [...keys, name, 'properties'].join(util.JSONPATH_JOIN_CHAR);
      if (curData && curData.properties) {
        // delete json.open[oldOpenKeys]
        // json.open[openKeys] = true
        console.log(openKeys, oldOpenKeys)
      }

      if (propertiesData[value] && typeof propertiesData[value] === 'object') {
        return
      }
  
      requiredData = requiredData.map(item => {
        if (item === name) return value
        return item
      })
  
      parentKeys.push('required')
      util.setData(json, parentKeys, requiredData)
  
      for (let i in propertiesData) {
        if (i === name) {
          newPropertiesData[value] = propertiesData[i]
        } else newPropertiesData[i] = propertiesData[i]
      }
  
      util.setData(json, keys, newPropertiesData)
      console.log(json)
      setState({
        checked: state.checked,
        data: json,
      })
    }
  
    // 修改数据类型
    const handleChangeType = (e: any) => {
      console.log(prefixArray)
      let keys = [...prefixArray, 'type']
      const value = e
  
      let parentKeys = util.getParentKeys(keys)
      let oldData = json
      let parentData = util.getData(oldData, parentKeys)
      if (parentData.type === value) {
        return
      }
      // let newParentData = utils.defaultSchema[value];
      let newParentDataItem = util.defaultSchema[value]
  
      // 将备注过滤出来
      let parentDataItem = parentData.description ? { description: parentData.description } : {}
      let newParentData = Object.assign({}, newParentDataItem, parentDataItem)
  
      let newKeys = [...parentKeys]
      console.log(newKeys, newParentData)
      util.setData(json, newKeys, newParentData)
      setState({
        checked: state.checked,
        data: json,
      })
      console.log(json)
    }

    // 修改是否必须
    const handleEnableRequire = (e: any) => {
      const required = e.target.checked
      console.log('need remove', required)
      const keys = prefix
      let parentKeys = util.getParentKeys(keys)
      let oldData = json
      let parentData = util.getData(oldData, parentKeys)
      console.log('parentData', parentData)
      let requiredData: string[] = parentData?.required ? [...parentData.required] : []
      const index = requiredData.indexOf(name)
      console.log('requiredData', requiredData, name)
      if (!required && index >= 0) {
        requiredData.splice(index, 1)
        parentKeys.push('required')
        if (requiredData.length === 0) {
          util.deleteData(state.data, parentKeys)
        } else {
          util.setData(state.data, parentKeys, requiredData)
        }
      } else if (required && index === -1) {
        requiredData.push(name)
        parentKeys.push('required')
        util.setData(state.data, parentKeys, requiredData)
      }
      setState({
        checked: state.checked,
        data: json,
      })
      console.log(json)
    }

    //  增加子节点
    const handleAddField = () => {
      console.log('handleAddField', [...prefixArray])
      const json = util.addFieldAction(state, prefix, name)
      setState({
        checked: state.checked,
        data: json,
      })
    }

    // 删除节点
    const handleDeleteItem = () => {
      console.log('handleDeleteItem')
      setState({
        checked: state.checked,
        data: util.deleteItemAction(state, prefixArray),
      })
      setState({
        checked: state.checked,
        data: util.enableRequireAction(state, { keys: prefixArray, name, required: false }),
      })
    }

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setState({
        checked: state.checked,
        data: util.changeValueAction(state, [...prefixArray, 'description'], value),
      })
    }

    const DropPlus = () => {
      const menu = (
        <Menu>
          <Menu.Item>
            <span onClick={() => {
              setState({
                checked: state.checked,
                data: util.addFieldAction(state, prefix, name),
              })
            }}>兄弟节点</span>
          </Menu.Item>
          <Menu.Item>
            <span
              onClick={() => {
                setState({
                  checked: state.checked,
                  data: util.addChildFieldAction(state, [...prefix, name, 'properties']),
                })
              }}
            >子节点</span>
          </Menu.Item>
        </Menu>
      )

      return (
        <Tooltip placement="top" title={ '添加节点' }>
          <Dropdown overlay={menu}>
            <PlusOutlined className="json-schema__row-add" />
          </Dropdown>
        </Tooltip>
      )
    }

    return(
      <div key={ index } >
        <Row gutter={ 2 } className="json-schema__row">
          <Col span={ 10 } style={{ paddingLeft: `${tabLength * 8}px` }}>
            <Row>
              <Col span={ 2 } className="json-schema__row-caret">
                { value.type === 'object' ? <CaretDownOutlined /> : null }
              </Col>
              <Col span={ 22 }>
                <FieldInput value={ name } maxLength={ 64 } addonAfter={
                  <Tooltip placement="top" title="是否必须">
                    <Checkbox
                      onChange={ handleEnableRequire }
                      checked={
                        data.required === undefined ? false : data.required.indexOf(name) != -1
                      }
                    />
                  </Tooltip>
                } onChange={ handleChangeName }/>
              </Col>
            </Row>
          </Col>
          <Col span={ 4 }>
            <Select style={{ width: '100%' }} defaultValue={ value.type } onChange={ handleChangeType }>
              {
                util.SCHEMA_TYPE.map((item, index) => {
                  return <Option value={ item } key={ index }>{ item }</Option>
                })
              }
            </Select>
          </Col>
          <Col span={ 8 }>
            <FieldInput placeholder="备注" value={ value.description } onChange={ handleChangeValue } maxLength={ 200 } />
          </Col>
          <Col span={ 2 }>
            { value.type === 'object' ? (
              <DropPlus />
            ) : <PlusOutlined className="json-schema__row-add" onClick={ handleAddField } />}
            <CloseOutlined className="json-schema__row-del" onClick={ handleDeleteItem }/>
          </Col>
        </Row>
        <div className="children-item">
          { mapping(prefixArray, value) }
        </div>
      </div>
    )
  }

  const SchemaObject = (perfix: string[], data: any) => {
    // console.log('data.properties', data.properties)
    return (
      <div className="json-schema__object-item">
        {
          Object.keys(data.properties).map((c, index) => SchemaItem(perfix, c, data, randomString(12)))
        }
      </div>
    );
  }

  const mapping = (perfix: string[], data: any, disabled = false) => {
    if (!data?.type) return null
    switch (data.type) {
      case 'array':
        return SchemaArray(perfix, data, Math.random())
      case 'object':
        const nameArray = [...perfix, 'properties']
        return SchemaObject(nameArray, clone(data))
      default:
        return null
    }
  }

  const json = state.data

  // 选择或者取消全部必填
  const changeCheckBox = (e: any) => {
    const required = e?.target?.checked || false
    console.log(required)
    util.requireAllAction(state.data, required)
    setState({
      checked: required,
      data: state.data,
    })
  }

  // 修改数据类型
  const handleChangeType = (payload: string) => {
    const value = payload
    let parentData = json
    const defaultItem = util.defaultSchema[value]
    // 将备注过滤出来
    const description = parentData.description || ''

    parentData = Object.assign({
      title: 'json-schema',
      $schema: 'https://json-schema.org/draft-04/schema#',
      required: [],
      checked: false,
      description: description,
    }, defaultItem)

    setState({
      checked: state.checked,
      data: parentData,
    })
    console.log(json)
  }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let parentData = json
    const value = e.target.value
    if (parentData.description !== value) {
      parentData.description = value
      setState({
        checked: state.checked,
        data: parentData,
      })
      console.log('change description')
    }
  }

  return (
    <div className="json-schema__object-item">
      <Row key={ json.$schema } gutter={ 2 } className="json-schema__row">
        <Col span={ 10 }>
          <Row>
            <Col span={ 2 } className="json-schema__row-caret">
              { json.type === 'object' ? <CaretDownOutlined /> : null }
            </Col>
            <Col span={ 22 }>
              <Input defaultValue="root" disabled addonAfter={
                <Tooltip placement="top" title={ state.checked ? '全部不必须' : '全部必须'}>
                  <Checkbox onChange={ changeCheckBox } checked={ state.checked } />
                </Tooltip>
              } className="field-input" />
            </Col>
          </Row>
        </Col>
        <Col span={ 4 }>
          <Select style={{ width: '100%' }} value={ json.type } onChange={ handleChangeType }>
            {
              util.SCHEMA_TYPE.map((item, index) => {
                return <Option value={ item } key={ index }>{ item }</Option>
              })
            }
          </Select>
        </Col>
        <Col span={ 8 }>
          <Input placeholder="备注" value={ json.description } onChange={ (e) => { handleChangeValue(e) } }  maxLength={ 200 } />
        </Col>
        <Col span={ 2 }>
          {
            json.type === 'object' ? (
              <PlusOutlined className="json-schema__row-add"
                onClick={ () => { setState({
                  checked: state.checked,
                  data: util.addChildFieldAction(state, ['properties']),
                }) } }
              />
            ) : null
          }
        </Col>
      </Row>
      <div>
        {
          mapping([], json)
        }
      </div>
    </div>
  )
}

export default JsonSchema