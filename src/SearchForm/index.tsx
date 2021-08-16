import React, {
  useMemo,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  useState,
  cloneElement,
} from 'react'
import { history } from 'umi'
import { Form, Button, FormItemProps, Row, Col, Space } from 'antd'
import { queryForm } from 'evian'
import { Rule } from 'antd/lib/form'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import './index.sass'

interface ColumnItem<RecordType = unknown> {
  key?: React.ReactText
  dataIndex?: string | number | (string | number)[]
  name?: string
  title?: string
  width?: string | number
  fieldProps?: Record<string, any>
  hidden?: boolean
  formItem?: FormItemProps['children'] | ColumnItem[]
  render?: (value: any, record: RecordType, index: number) => React.ReactNode
  rules?: Rule[]
}

interface FieldData {
  name: string | number | (string | number)[]
  value?: any
  touched?: boolean
  validating?: boolean
  errors?: string[]
}

interface Props {
  items?: ColumnItem[]
  onFinish?: (values: FormData) => void
  children?: ReactNode | ReactNode[]
  render?: ReactNode | ReactNode[]
  // 是否独立搜索区
  discrete?: boolean
  // 独立搜索区的栅格
  span?: number
  name?: string
  // 重置时额外的数据
  resetData?: Record<string, any>
  onReset?: (values: Record<string, any>) => void
}

const ZySearchForm = forwardRef((props: Props, ref) => {
  const { items, onFinish, resetData, children, render, discrete, name, onReset } = props
  const span = props.span || 6
  const [formInstance] = Form.useForm()

  // 是否独立搜索区
  const isDiscrete = useMemo(() => {
    return items && items.length > 3 ? true : discrete ? true : render ? false : false
  }, [ discrete ])

  // 是否展开
  const [ expand, setExpand ] = useState(false)

  const list = useMemo(() => {
    return items
  }, [ items ])

  const searchQuery = useMemo(() => {
    const query = queryForm(history.location.query || {})
    delete query.page
    delete query.pageSize
    window.setTimeout(() => {
      if (formInstance) formInstance.resetFields()
    }, 80)
    return query
  }, [ history.location ])

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // 暴露给父组件的方法
    getValuefromChild: () => {
      console.log('this is child value.')
    },
    setFields: (payload: FieldData[]) => {
      formInstance.setFields(payload)
    },
  }))

  const handleReset = () => {
    if (onReset) {
      onReset(resetData || {})
      return
    }

    const { pathname } = history.location
    const query = {
      page: '1'
    }

    Object.assign(query, resetData || {})
    history.replace({
      pathname,
      query,
    })
  }

  return (
    <div className={ isDiscrete ? 'search-form discrete' : 'search-form' }>
      {
        isDiscrete ? (
          <>
            <div className="search-form__discrete">
              <Form
                layout="inline"
                form={ formInstance }
                onFinish={ onFinish }
                initialValues={ searchQuery }
                name={ name || 'discrete' }
              >
                <Row style={{ width: '100%' }} gutter={ 16 }>
                  {
                    list?.map((item, index) => (
                      index < (24 / span - 1) ? (
                        <Col span={ span } key={ item.key || (item.dataIndex as string) }>
                          <Form.Item
                            name={ item.dataIndex }
                            rules={item.rules || []}
                            validateTrigger={['onChange', 'onBlur']}
                          >
                            { item.formItem }
                          </Form.Item>
                        </Col>
                      ) : (
                        expand === false ? (
                          <Form.Item
                            hidden
                            name={ item.dataIndex }
                            key={ item.key || (item.dataIndex as string) }
                            rules={item.rules || []}
                            validateTrigger={['onChange', 'onBlur']}
                          >
                            { item.formItem }
                          </Form.Item>
                        ) : (
                          <Col span={ span } key={ item.key || (item.dataIndex as string) }>
                            <Form.Item
                              name={ item.dataIndex }
                              rules={ item.rules || [] }
                              validateTrigger={[ 'onChange', 'onBlur' ]}
                            >
                              { item.formItem }
                            </Form.Item>
                          </Col>
                        )
                      )
                    ))
                  }
                  { render }
                  {
                    list?.length || render ? (
                      <Col span={ span } offset={ expand ? ((24 / span - 1) - (list && list.length % (24 / span) || 0)) * span : 0 }>
                        <Form.Item>
                          <Space>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button htmlType="button" onClick={ handleReset }>重置</Button>
                            <span
                              className="pointer text-main"
                              onClick={ () => { setExpand(!expand) } }
                            >
                              { expand ? '收起' : '展开' }
                              { expand ? <UpOutlined /> : <DownOutlined /> }
                            </span>
                          </Space>
                        </Form.Item>
                        </Col>
                    ) : null
                  }
                </Row>
              </Form>
            </div>
            <div className="search-form__spare"></div>
          </>
        ) : null
      }
      <div className="search-form__actions">{ children }</div>
      {
        isDiscrete ? null : (
          <div className="search-form__form">
            <Form
              layout="inline"
              form={ formInstance }
              onFinish={ onFinish }
              initialValues={ searchQuery }
              name={ name || 'inline' }
            >
              {
                list?.map(item => (
                  <Form.Item
                    name={item.dataIndex}
                    key={item.key || (item.dataIndex as string)}
                    rules={item.rules || []}
                    validateTrigger={['onChange', 'onBlur']}
                    style={{ minWidth: '80px' }}
                  >
                    { cloneElement(item.formItem as any, {
                      style: { width: item.width || 200 }
                    }) }
                  </Form.Item>
                ))
              }
              { render }
              {
                list?.length || render ? (
                  <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Form.Item>
                ) : null
              }
            </Form>
          </div>
        )
      }
    </div>
  )
})

export default ZySearchForm