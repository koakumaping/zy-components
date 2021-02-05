import React, { useEffect, useMemo, useState } from 'react'
import { history } from 'umi'
import {
  Button,
  Space,
  Input,
  Select,
  Popconfirm,
  Form,
  Row,
  Col,
  Tabs,
  Radio,
  Tag,
  Tree,
  Modal,
  Tooltip,
} from 'antd'
import { hasOwn, randomString, toNumber } from 'evian'
import moment from 'moment'
import { noEmptyValidator, noSpecialInput } from '@/util/validators'
import useZoo from '@/hooks/useZoo'
import { ColumnItem, RowItem } from '@/types'
import r from '@/util/request'
import dict from '@/util/dict'
import ZySearchForm from '@/components/ZySearchForm/index'
import ZyDatePicker from '@/components/ZyDatePicker/index'
import Modular from '@/components/Modular/index'
import JsonSchema from '@/components/JsonSchema/index'
import Auth from '@/components/auth'
import Instruction from '@/components/Instruction'
import ZyTable from '@/components/ZyTable'
import ZyLeftMenuList from '@/components/ZyLeftMenuList'
import PtFormList from './form-list'
import PtQueryList from './query-list'
import PtHeaderList from './header-list'

import './index.sass'

const { Option } = Select
const { TabPane } = Tabs
const hasBodyList = [2, 3]

const AbilityManage: React.FC = () => {
  const [ treeLoading, setTreeLoading ] = useState(false)
  const [ treeList, setTreeList ] = useState<any[]>([])
  const [ statusVisible, setStatusVisible ] = useState(false)
  const [ record, setRecord ] = useState<RowItem>({ recNum: 0 })
  const [ endTimeVisible, setEndTimeVisible ] = useState(false)
  const [ formOrJsonn, setformOrJsonn ] = useState('form')
  const [ bodyVisible, setbodyVisible ] = useState(false)
  const [ functionDictList, setFunctionDictList ] = useState<any[]>([])
  const [ startTime, setStartTime ] = useState<string>()

  const treeId = useMemo(() => toNumber(history.location.query?.treeId), [ history.location ])
  const getList = () => {
    if (!treeId) return
    setLoading(true)
    const params = {
      serviceRecNum: treeId,
      page: currentPage,
      limit: currentPageSize,
      ...searchQuery,
    }

    r().get('AbilityManage' , { params }).then((res: any) => {
      setList(res.records)
      setTotal(res.total)
    }).finally(() => {
      setLoading(false)
    })
  }

  const {
    currentPage,
    currentPageSize,
    searchQuery,
    loading,
    list,
    setLoading,
    onSearch,
    form,
    setForm,
    showModular,
    pagination,
    modularProps,
    handleSubmit,
    setList,
    setTotal,
    handleDelete,
  } = useZoo(true, () => { getList() })

  const handlebodyVisible = (payload: number) => {
    const showBody = hasBodyList.indexOf(payload) > -1
    if (showBody) {
      form.paramType = 1
      setForm(form)
      setformOrJsonn('form')
    }
    setbodyVisible(showBody)
  }

  const handlePerfixVisible = (payload: number) => {
    setEndTimeVisible(payload === 1)
  }

  const handleformOrJsonn = (e: any) => {
    const flag = e.target.value
    setformOrJsonn(flag === 1 ? 'form': 'json')
  }

  const handleStartTime = (payload: string | null) => {
    setStartTime(payload || '')
  }

  useEffect(() => {
    setEndTimeVisible(form.validityType === 1)
    setbodyVisible(hasBodyList.indexOf(form.requestMethod) > -1)
    setformOrJsonn(form.paramType === 1 ? 'form': 'json')
  }, [ form ])

  const handleStatus = (payload: RowItem) => {
    setRecord(payload)
    setStatusVisible(true)
  }

  const setStatus = (payload: RowItem) => {
    setLoading(true)

    const formdata = {
      recNum: record.recNum,
      resCode: 'manager-ud',
      resName: '上线或下线',
      enableStatus: toNumber(!record.enableStatus),
      content: payload.content,
    }

    r().put('AbilityManageChangeStatus', formdata).then(() => {
      setStatusVisible(false)
      getList()
    }).finally(() => {
      setLoading(false)
    })
  }

  const getLeftMenuData = () => {
    setTreeLoading(true)
    r().get('AbilityServiceLeftMenu').then((res: any[]) => {
      let breakFlag = false
      res.forEach((item, index) => {
        item.key = randomString(12)
        item.title = item.name
        item.selectable = false
        if (hasOwn(item, 'children') && item.children) {
          item.children.forEach((child: any) => {
            if (index === 0 && !treeId && !breakFlag) {
              breakFlag = true
              const { pathname } = history.location
              history.replace({
                pathname,
                query: {
                  page: '1',
                  treeId: child.id + '',
                },
              })
            }
            child.key = child.id
            child.title = child.name
          })
        }
      })
      setTreeList(res)
    }).finally(() => {
      setTreeLoading(false)
    })
  }

  const getDictList = () => {
    r().get('AbilityDictAll').then((res: any[]) => {
      res.forEach((item) => {
        item.key = randomString(12)
        item.label = item.funcName
        item.value = item.recNum
      })
      setFunctionDictList(res)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getLeftMenuData()
    getDictList()
  }, [])

  useEffect(() => {
    getList()
  }, [currentPage, currentPageSize, searchQuery, treeId])

  const searchColums: ColumnItem[] = [
    {
      dataIndex: 'shortName',
      formItem: <Input placeholder="能力名称" allowClear />,
      rules: [{ required: false, validator: noSpecialInput }],
    },
    {
      dataIndex: 'funcRecNum',
      formItem: (
        <Select placeholder="功能类型" allowClear>
          {
            functionDictList.map(item => {
              return (
                <Option key={ item.key } value={ item.value }>
                  { item.label }
                </Option>
              )
            })
          }
        </Select>
      ),
      rules: [{ required: false, validator: noSpecialInput }],
    },
  ]

  const columns: ColumnItem<RowItem>[] = [
    {
      title: '能力名称',
      dataIndex: 'shortName',
    },
    {
      title: '功能类型',
      dataIndex: 'funcName',
    },
    {
      title: '能力描述',
      dataIndex: 'instruction',
      render: (text: string) => (
        <Instruction>{ text }</Instruction>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enableStatus',
      width: 80,
      render: ((text: number) => (
        <Tag color={ text ? 'green ' : 'red ' }>
          {text ? '上线 ' : '下线 '}
        </Tag>)
      ),
    },
    {
      title: '操作',
      width: 160,
      render: (text, item) => (
        <Space size="middle">
          <Auth name="ud"><span className="pointer text-main" onClick={ () => { handleStatus(item) } }>{ !item.enableStatus ? '上线 ' : '下线 ' }</span></Auth>
          <Auth name="mod">
            {
              !item.enableStatus ? (
                <span className="pointer text-main" onClick={ () => { showModular(item) } }>修改</span>
              ) : (
                <Tooltip placement="top" title={ '上线状态无法修改' }>
                  <span className="pointer text-main" onClick={ () => { showModular(item) } }>修改</span>
                </Tooltip>
              )
            }
          </Auth>
          <Auth name="del">
            <Popconfirm
              placement="topRight"
              title={ '确定删除' + item.shortName + '?'}
              okText="确定"
              cancelText="取消"
              onConfirm={ () => { handleDelete(item) }}
            >
              <span className="pointer text-red">删除</span>
            </Popconfirm>
          </Auth>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    // 设置上线日期
    setStartTime(form.beginTime)
  }, [ form ])

  const disabledDate = (current: moment.Moment) => {
    // Can not select days before today and today
    return current && current < moment(startTime).endOf('day')
  }

  const onSubmit = (payload: any) => {
    payload.serviceRecNum = treeId
    handleSubmit(payload)
  }

  return <div className="list-warp">
    <Row className="height-max">
      <Col span={ 6 }>
        <ZyLeftMenuList title="服务列表">
          {
            treeLoading ? null : (
              <Tree
                defaultExpandAll
                defaultSelectedKeys={ [ treeId ] }
                treeData={ treeList }
                blockNode
                onSelect={(selectedKeys, info) => {
                  const { pathname } = history.location
                  if (info.selected) {
                    history.replace({
                      pathname,
                      query: {
                        page: '1',
                        treeId: info.node.key as string,
                      },
                    })
                  } else {
                    history.replace({
                      pathname,
                      query: {
                        page: '1',
                        treeId: '',
                      },
                    })
                  }
                }}
              />
            )
          }
        </ZyLeftMenuList>
      </Col>
      <Col span={ 18 }>
        {
          treeId ? (
            <ZyTable
              rowKey={ 'recNum' }
              columns={ columns }
              dataSource={ list }
              loading={ loading }
              pagination={ pagination }
            >
              {
                <ZySearchForm items={ searchColums } onFinish={ onSearch } >
                  <Auth name="add"><Button onClick={ () => { showModular() } }>新增</Button></Auth>
                </ZySearchForm>
              }
            </ZyTable>
          ) : (
            <div className="text-center text-big" style={{ paddingTop: '10%' }}>请选择左侧服务</div>
          )
        }
        
      </Col>
    </Row>
    <Modular { ...modularProps } width={ 1200 } onSubmit={ onSubmit }>
      <Row>
        <Col span={ 8 }>
          <Form.Item
            label="能力名称"
            name="shortName"
            rules={[{ required: true, validator: noEmptyValidator }]}
          >
            <Input maxLength={ 16 } />
          </Form.Item>
        </Col>
        <Col span={ 8 }>
          <Form.Item
            label="能力类别"
            name="capacityType"
            rules={[{ required: true, validator: noEmptyValidator }]}
          >
            <Select placeholder="能力类别">
              {
                dict.capacity_type.map(item => {
                  return (
                    <Option key={ item.key } value={ item.value }>
                      { item.label }
                    </Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={ 8 }>
          <Form.Item
            label="功能类型"
            name="funcRecNum"
            rules={[{ required: true, validator: noEmptyValidator }]}
          >
            <Select placeholder="功能类型">
              {
                functionDictList.map(item => {
                  return (
                    <Option key={ item.key } value={ item.value }>
                      { item.label }
                    </Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={ 8 }>
          <Form.Item
            label="上线日期"
            name="beginTime"
            rules={[{ required: true, validator: noEmptyValidator }]}
          >
            <ZyDatePicker onChange={ handleStartTime } disabledDate={ (current: moment.Moment) => current && current < moment().subtract(1, 'days') } />
          </Form.Item>
        </Col>
        <Col span={ 8 }>
          <Form.Item
            label="失效日期"
            required
          >
            <Input.Group compact>
              <Form.Item
                name="validityType"
                noStyle
                rules={[{ required: true, validator: noEmptyValidator }]}
                initialValue={ 0 }
              >
                <Select placeholder="有效期至" style={{ width: '50%' }} onChange={ handlePerfixVisible }>
                  {
                    dict.invalid_type.map(item => {
                      return (
                        <Option key={ item.key } value={ item.value }>
                          { item.label }
                        </Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              {
                endTimeVisible ? (
                  <Form.Item
                    name="endTime"
                    noStyle
                    rules={[{ required: true, validator: noEmptyValidator }]}
                  >
                    <ZyDatePicker style={{ width: '50%' }} disabledDate={ disabledDate } />
                  </Form.Item>
                ) : null
              }
            </Input.Group>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="接口路径"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        required
      >
        <Input.Group compact>
          <Form.Item
            name="interfaceType"
            noStyle
            rules={[{ required: true, validator: noEmptyValidator }]}
            initialValue={ 1 }
          >
            <Select placeholder="接口类型" style={{ width: '10%' }}>
              {
                dict.interface_type.map(item => {
                  return (
                    <Option key={ item.key } value={ item.value }>
                      { item.label }
                    </Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="requestMethod"
            noStyle
            rules={[{ required: true, validator: noEmptyValidator }]}
            initialValue={ 1 }
          >
            <Select style={{ width: '10%' }} onChange={ handlebodyVisible }>
              {
                dict.request_method.map(item => {
                  return (
                    <Option key={ item.key } value={ item.value }>
                      { item.label }
                    </Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="link"
            noStyle
            rules={[{ required: true, validator: noEmptyValidator }]}
          >
            <Input style={{ width: '80%' }} maxLength={ 256 } />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item
        label="能力描述"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        name="instruction"
        rules={[{ required: false, validator: noSpecialInput }]}
      >
        <Input.TextArea maxLength={ 200 } />
      </Form.Item>

      <h3>请求参数设置</h3>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Query" key="1" forceRender={ true }>
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            name="reqQuery"
          >
            <PtQueryList />
          </Form.Item>
        </TabPane>
        {
          bodyVisible ? (
            <TabPane tab="Body" key="2" forceRender={ true }>
              <Form.Item
                label="传参方式"
                name="paramType"
                rules={[{ required: true, validator: noEmptyValidator }]}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
              >
                <Radio.Group onChange={ handleformOrJsonn }>
                  {
                    dict.interface_param_format.map((item: any) => <Radio key={ item.key } value={ item.value }>{ item.label }</Radio>)
                  }
                </Radio.Group>
              </Form.Item>
              {
                formOrJsonn === 'form' ? (
                  <Form.Item
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    name="reqBodyForm"
                  >
                    <PtFormList />
                  </Form.Item>
                ) : (
                  <Form.Item
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    name="reqBodyJson"
                  >
                    <JsonSchema />
                  </Form.Item>
                )
              }
            </TabPane>
          ) : null
        }
        <TabPane tab="Headers" key="3" forceRender={ true }>
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            name="reqHeader"
          >
            <PtHeaderList />
          </Form.Item>
        </TabPane>
      </Tabs>

      <h3 style={{ marginBottom: '8px' }}>返回参数设置</h3>
      <Form.Item
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        name="resBodyJson"
      >
        <JsonSchema />
      </Form.Item>
    </Modular>

    {
      statusVisible ? (
        <Modal
          title={ record.shortName }
          visible={ true }
          footer={ null }
          closable={ false }
          destroyOnClose
        >
          {
            record.enableStatus ? (
              <Form
                onFinish={ setStatus }
              >
                <Form.Item
                  label="下线原因"
                  name="content"
                  rules={[{ required: true, validator: noEmptyValidator }]}
                >
                  <Input.TextArea maxLength={ 200 } />
                </Form.Item>
                <Form.Item className="action text-right">
                  <Space>
                    <Button onClick={ () => setStatusVisible(false) } disabled={ loading }>取消</Button>
                    <Button type="primary" htmlType="submit" disabled={ loading }>确定</Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <Form
                onFinish={ setStatus }
              >
                <Form.Item>确定将该能力上线吗？</Form.Item>
                <Form.Item className="action text-right">
                  <Space>
                    <Button onClick={ () => setStatusVisible(false) } disabled={ loading }>取消</Button>
                    <Button type="primary" htmlType="submit" disabled={ loading }>确定</Button>
                  </Space>
                </Form.Item>
              </Form>
            )
          }
        </Modal>
      ) : null
    }
  </div>
}

export default AbilityManage