import React, { useState, useEffect, useMemo } from 'react'
import { history } from 'umi'
import { Tooltip, Space, Input, Popconfirm, Tag, Select, Row, Col, Button,  Form, Modal, InputNumber } from 'antd'
import { toNumber } from 'evian'
import { ipValidator, noEmptyValidator, noSpecialInput } from '@/util/validators'
import ZySearchForm from '@/components/ZySearchForm/index'
import useZoo from '@/hooks/useZoo'
import { ColumnItem, RowItem } from '@/types'
import Auth from '@/components/auth'
import r from '@/util/request'
import dict, { formatter } from '@/util/dict'
import Modular from '@/components/Modular'
import ZyImage from '@/components/ZyImage'
import ZyTable from '@/components/ZyTable'
import ZyUpload from '@/components/ZyUpload'
import ZyLeftMenuList from '@/components/ZyLeftMenuList'

const { Option } = Select

const AbilityService: React.FC = () => {
  const [ treeLoading, setTreeLoading ] = useState(false)
  const [ sdevList, setSdevList ] = useState<any[]>([])

  const [ limitVisible, setLimitVisible ] = useState(false)
  const [ limitInputVisible, setLimitInputVisible ] = useState(false)
  const [ statusVisible, setStatusVisible ] = useState(false)
  const [ record, setRecord ] = useState<RowItem>({ recNum: 0 })
  const [ perfixVisible, setPerfixVisible ] = useState(false)

  const sdevId = useMemo(() => toNumber(history.location.query?.sdevId), [ history.location ])
  const getList = () => {
    if (!sdevId) return
    setLoading(true)
    const params = {
      serviceDevRecNum: sdevId,
      page: currentPage,
      limit: currentPageSize,
      ...searchQuery,
    }

    r().get('AbilityService' , { params }).then((res: any) => {
      setList(res.records)
      setTotal(res.total)
    }).finally(() => {
      setLoading(false)
    })
  }

  const {
    rowId,
    currentPage,
    currentPageSize,
    searchQuery,
    loading,
    list,
    setLoading,
    onSearch,
    form,
    showModular,
    pagination,
    modularProps,
    handleSubmit,
    handleDelete,
    setList,
    setTotal,
  } = useZoo(true, () => { getList() })

  const handleStatus = (payload: RowItem) => {
    setRecord(payload)
    setStatusVisible(true)
  }

  const handleLimit = (payload: RowItem) => {
    setRecord(payload)
    setLimitVisible(true)
    setLimitInputVisible(payload.rateLimiterType === 1)
  }

  const setStatus = (payload: RowItem) => {
    console.log(payload)
    setLoading(true)

    const formdata = {
      recNum: record.recNum,
      resCode: 'service-ud',
      resName: '上线或下线',
      onlineStatus: toNumber(!record.onlineStatus),
      content: payload.content,
    }

    r().post('AbilityServiceChangeStatus', formdata).then(() => {
      setStatusVisible(false)
      getList()
    }).finally(() => {
      setLoading(false)
    })
  }

  const setLimit = (payload: RowItem) => {
    console.log(payload)
    setLoading(true)

    const params = {
      id: record.recNum
    }
    r().put('AbilityServiceLimit', payload, { params }).then(() => {
      setLimitVisible(false)
      getList()
    }).finally(() => {
      setLoading(false)
    })
  }

  const getLeftMenuData = () => {
    if (treeLoading) return
    setTreeLoading(true)
    r().get('AbilityServiceLeftMenu').then((res: any[]) => {
      setSdevList(res)
      if (sdevId) return
      try {
        const { pathname } = history.location
        history.replace({
          pathname,
          query: {
            page: '1',
            sdevId: res[0].serviceDevId,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }).finally(() => {
      setTreeLoading(false)
    })
  }

  useEffect(() => {
    getLeftMenuData()
  }, [])

  useEffect(() => {
    getList()
  }, [currentPage, currentPageSize, searchQuery, sdevId])

  const handlePerfixVisible = (payload: number) => {
    setPerfixVisible(!!payload)
  }

  useEffect(() => {
    setPerfixVisible(!!form.addPrefixion)
  }, [ form ])

  const searchColums: ColumnItem[] = [
    {
      dataIndex: 'serviceName',
      formItem: <Input placeholder="服务名称" allowClear />,
      rules: [{ required: false, validator: noSpecialInput }],
    },
  ]

  const columns: ColumnItem<RowItem>[] = [
    {
      title: 'LOGO',
      dataIndex: 'logo',
      render: (text: string) => (
        <ZyImage src={ text } alt="logo" style={{ height: '32px' }} />
      ),
    },
    {
      title: '服务名称',
      dataIndex: 'serviceName',
    },
    {
      title: '沙箱环境',
      dataIndex: 'sandboxEnv',
    },
    {
      title: '状态',
      dataIndex: 'onlineStatus',
      width: 80,
      render: ((text: number) => (
        <Tag color={ text ? 'green ' : 'red ' }>
          {text ? '上线 ' : '下线 '}
        </Tag>)
      ),
    },
    {
      title: '限流',
      dataIndex: 'rateLimiterType',
      render: (type: number, item) => (
        <>
          {
            type === 0 ? <span>{ formatter('rate_limiter', type) }</span> : null
          }
          {
            type === 1 ? <span>{ item.rateLimiter }次/秒</span> : null
          }
        </>
      ),
    },
    {
      title: '操作',
      width: 200,
      render: (text: number, item) => (
        <Space size="middle">
          <Auth name="ud"><span className="pointer text-main" onClick={ () => { handleStatus(item) } }>{ !item.onlineStatus ? '上线 ' : '下线 ' }</span></Auth>
          <Auth name="mod">
            {
              !item.onlineStatus ? (
                <span className="pointer text-main" onClick={ () => { showModular(item) } }>修改</span>
              ) : (
                <Tooltip placement="top" title={ '上线状态无法修改' }>
                  <span className="pointer text-main" onClick={ () => { showModular(item) } }>修改</span>
                </Tooltip>
              )
            }
          </Auth>
          <Auth name="lt"><span className="pointer text-green" onClick={ () => { handleLimit(item) } }>限流</span></Auth>
          <Auth name="del">
            <Popconfirm
              placement="topRight"
              title={ '确定删除 ' + item.serviceName + '?'}
              okText="确定"
              cancelText="取消"
              onConfirm={ () => { handleDelete(item) } }
            >
              <span className="pointer text-red">删除</span>
            </Popconfirm>
          </Auth>
        </Space>
      ),
    },
  ]

  const onSubmit = (payload: any) => {
    // 不需要前缀 => 清空处理
    if (payload.addPrefixion === 0) payload.prefixion = ''
    if (!payload.serviceDevRecNum) payload.serviceDevRecNum = sdevId
    handleSubmit(payload)
  }

  return <div className="list-warp">
    <Row className="height-max">
      <Col span={ 6 }>
        <ZyLeftMenuList title="服务开发商">
          {
            sdevList.map(item => {
              return <li
                key={ item.id }
                onClick={ () => {
                  const { pathname } = history.location
                  history.replace({
                    pathname,
                    query: {
                      page: '1',
                      sdevId: item.serviceDevId,
                    },
                  })
                } }
                className={ sdevId === item.serviceDevId ? 'active' : '' }
              >{ item.name }</li>
            })
          }
        </ZyLeftMenuList>
      </Col>
      <Col span={ 18 }>
        <ZyTable
          rowKey={ 'recNum' }
          columns={ columns }
          dataSource={ list }
          loading={ loading }
          pagination={ pagination }
        >
          <ZySearchForm items={ searchColums } onFinish={ onSearch } >
            <Auth name="add"><Button onClick={ () => { showModular() } }>新增</Button></Auth>
          </ZySearchForm>
        </ZyTable>
      </Col>
    </Row>

    <Modular { ...modularProps } width={ 600 } onSubmit={ onSubmit }>
      <Form.Item
        label="LOGO"
        name="logo"
        rules={[{ required: true, validator: noEmptyValidator }]}
        extra="支持jpg、png格式，建议320*320像素，小于500KB"
      >
        <ZyUpload />
      </Form.Item>
      <Form.Item
        label="服务名称"
        name="serviceName"
        rules={[{ required: true, validator: noEmptyValidator }]}
      >
        <Input placeholder="服务名称" maxLength={ 16 } />
      </Form.Item>
      <Form.Item
        label="前缀"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        required={ true }
      >
        <Input.Group compact>
          <Form.Item
            name="addPrefixion"
            noStyle
            rules={[{ required: true, validator: noEmptyValidator }]}
          >
            <Select style={{ width: perfixVisible ? '30%' : '100%' }} onChange={ handlePerfixVisible }>
              <Option value={ 1 }>需要</Option>
              <Option value={ 0 }>不需要</Option>
            </Select>
          </Form.Item>
          {
            perfixVisible ? (
              <Form.Item
                name="prefixion"
                noStyle
                rules={[{ required: true, validator: noEmptyValidator }]}
              >
                <Input style={{ width: '70%' }} maxLength={ 20 } />
              </Form.Item>
            ) : null
          }
        </Input.Group>
      </Form.Item>
      <Form.Item
        label="服务描述"
        name="instruction"
        rules={[{ required: false, validator: noSpecialInput }]}
      >
        <Input.TextArea autoSize placeholder="服务描述" maxLength={ 200 } />
      </Form.Item>
      <Form.Item
        label="沙箱环境"
        name="sandboxEnv"
        rules={[{ required: true, validator: ipValidator }]}
      >
        <Input.TextArea autoSize placeholder="沙箱环境" maxLength={ 200 } />
      </Form.Item>
      <Form.Item
        label="生产环境"
        name="productionEnv"
        rules={[{ required: true, validator: ipValidator }]}
      >
        <Input.TextArea autoSize placeholder="生产环境" maxLength={ 200 } />
      </Form.Item>
      <Form.Item
        label="版本信息"
        name="ver"
        rules={[{ required: false, validator: noSpecialInput }]}
      >
        <Input placeholder="版本信息" maxLength={ 20 } />
      </Form.Item>
      <Form.Item
        label="服务认证方式"
        name="authType"
        rules={[{ required: true, validator: noEmptyValidator }]}
      >
        <Select placeholder="服务认证方式" allowClear>
          {
            dict.service_auth_type.map(item => {
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
        label="签名方式"
        name="signatureType"
        rules={[{ required: true, validator: noEmptyValidator }]}
      >
        <Select placeholder="签名方式" allowClear>
          {
            dict.sign_mode.map(item => {
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
        rowId === 0 ? (
          <Form.Item
            label="限流设置"
            required
          >
            <Input.Group compact>
              <Form.Item
                name="rateLimiterType"
                noStyle
                rules={[{ required: true, validator: noEmptyValidator }]}
              >
                <Select style={{ width: limitInputVisible ? '25%' : '100%' }} onChange={ (value: number) => setLimitInputVisible(value === 1) }>
                  {
                    dict.rate_limiter.map(item => {
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
                limitInputVisible ? (
                  <Form.Item
                    name="rateLimiter"
                    noStyle
                    rules={[{ required: true, validator: noEmptyValidator }]}
                  >
                    <InputNumber min={ 1 } max={ 999 } style={{ width: '60%' }} />
                  </Form.Item>
                ) : null
              }
              {
                limitInputVisible ? (
                  <span style={{ width: '12%', lineHeight: '32px', marginLeft: '11px' }}> 次/秒</span>
                ) : null
              }
            </Input.Group>
          </Form.Item>
        ) : null
      }
    </Modular>

    {
      statusVisible ? (
        <Modal
          title={ record.serviceName }
          visible={ true }
          footer={ null }
          closable={ false }
          destroyOnClose
        >
          {
            record.onlineStatus ? (
              <Form
                onFinish={ setStatus }
              >
                <Form.Item
                  label="下线原因"
                  name="content"
                  rules={[{ required: true, validator: noEmptyValidator }]}
                >
                  <Input.TextArea maxLength={ 200 }/>
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
                <Form.Item>确定将该服务上线吗？</Form.Item>
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

    {
      limitVisible ? (
        <Modal
          title={ record.serviceName }
          visible={ true }
          footer={ null }
          closable={ false }
          destroyOnClose
          width={ 400 }
        >
          <Form
            onFinish={ setLimit }
            layout="vertical"
            initialValues={ record }
          >
            <Form.Item
              label="限流设置"
            >
              <Input.Group compact>
                <Form.Item
                  name="rateLimiterType"
                  noStyle
                  rules={[{ required: true, validator: noEmptyValidator }]}
                >
                  <Select style={{ width: limitInputVisible ? '25%' : '100%' }} onChange={ (value: number) => setLimitInputVisible(value === 1) }>
                    {
                      dict.rate_limiter.map(item => {
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
                  limitInputVisible ? (
                    <Form.Item
                      name="rateLimiter"
                      noStyle
                      rules={[{ required: true, validator: noEmptyValidator }]}
                    >
                      <InputNumber min={ 1 } max={ 999 } style={{ width: '60%' }} />
                    </Form.Item>
                  ) : null
                }
                {
                  limitInputVisible ? (
                    <span style={{ width: '12%', lineHeight: '32px', marginLeft: '11px' }}> 次/秒</span>
                  ) : null
                }
              </Input.Group>
            </Form.Item>
            <Form.Item className="action text-right">
              <Space>
                <Button onClick={ () => setLimitVisible(false) } disabled={ loading }>取消</Button>
                <Button type="primary" htmlType="submit" disabled={ loading }>确定</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      ) : null
    }
  </div>
}

export default AbilityService