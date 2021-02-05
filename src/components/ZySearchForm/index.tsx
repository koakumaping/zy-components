import React, { useMemo, ReactNode, useImperativeHandle, forwardRef } from 'react'
import { history } from 'umi'
import { Form, Button } from 'antd'
import { ColumnItem } from '@/types'
import './styles.sass'
import { queryForm } from 'evian'

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
  // ref?: string | ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined
}

const ZySearchForm = forwardRef((props: Props, ref) => {
  const { items, onFinish, children, render } = props
  const [ formInstance ] = Form.useForm()

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
      console.log("this is child value.")
    },
    setFields: (payload: FieldData[]) => {
      formInstance.setFields(payload)
    },
  }))

  return (
    <div className="search-form">
      <div className="search-form__actions">
        { children }
      </div>
      <div className="search-form__form">
        <Form
          layout="inline"
          form={ formInstance }
          onFinish={ onFinish }
          initialValues={ searchQuery }
        >
          {
            list?.map((item) => (
              <Form.Item
                name={ item.dataIndex }
                key={ item.key || (item.dataIndex as string) }
                rules={ item.rules || [] }
                validateTrigger={ ['onChange', 'onBlur'] }
                style={{ minWidth: '80px' }}
              >{ item.formItem }</Form.Item>
            ))
          }
          { render }
          {
            list?.length || render ? <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item> : null
          }
        </Form>
      </div>
    </div>
  )
})

export default ZySearchForm