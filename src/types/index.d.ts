import { FormItemProps } from 'antd/lib/form/FormItem'
import { Rule } from 'antd/lib/form'
import { ColProps } from 'antd/lib/grid/col'

export interface KVItem {
  key: string | number
  value: string | number
}

export interface Item {
  key: string
  label:string
  value: any
}

export interface NodeItem {
  key: string
  parentKey: string
  label:string
  value: any
  children: NodeItem[]
}

export interface RowItem {
  id?: number
  recNum: number
  [propName: string]: any
}

export interface ColumnItem<RecordType = unknown> {
  key?: React.ReactText
  dataIndex?: string | number | (string | number)[]
  name?: string
  title?: string
  width?: string | number
  fieldProps?: Record<string, any>
  hidden?: boolean,
  formItem?: FormItemProps['children'] | ColumnItem[]
  render?: (value: any, record: RecordType, index: number) => React.ReactNode
  rules?: Rule[]
}

export interface LayoutProps {
  labelCol?: ColProps
  wrapperCol: ColProps
}

export interface AbilityItem {
  serviceName: string
  serviceDevName: string
  capacityRecNum: string
  capacityName: string
  capacityInstruction: string
  status?: string
}