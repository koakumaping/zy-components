import React, {
  useMemo,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react'
import { history } from 'umi'
import { Form, Button, FormItemProps } from 'antd'
import { queryForm } from 'evian'
import { Rule } from 'antd/lib/form'
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
}

const ZySearchForm = forwardRef((props: Props, ref) => {
  const { items, onFinish, children, render, discrete } = props
  const [formInstance] = Form.useForm()

  // 是否独立搜索区
  const isDiscrete = useMemo(() => {
    return items && items.length > 3 ? true : discrete ? true : render ? true : false
  }, [ discrete ])

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
                      {item.formItem}
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
              form={formInstance}
              onFinish={onFinish}
              initialValues={searchQuery}
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
                    {item.formItem}
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