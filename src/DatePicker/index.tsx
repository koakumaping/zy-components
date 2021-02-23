import React, { CSSProperties } from 'react'
import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { isEmpty } from 'evian'
import './index.sass'

interface Props {
  value?: string
  onChange?: (value: string | null) => void
  style?: CSSProperties
  format?: string
  disabledDate?: (payload: Moment) => boolean
  placeholder?: string
  picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined
}

const ZyDatePicker: React.FC<Props> = props => {
  const {
    value,
    onChange,
    style,
    format,
    disabledDate,
    placeholder,
    picker,
  } = props

  const triggerChange = (changedValue: Moment | null) => {
    if (onChange) {
      onChange(changedValue ? changedValue.format(format || 'YYYY-MM-DD') : '')
    }
  }

  return (
    <DatePicker
      value={ isEmpty(value) ? null : moment(value + '') }
      onChange={ triggerChange }
      allowClear={ false }
      style= {style }
      format={ format }
      disabledDate={ disabledDate }
      placeholder={ placeholder }
      picker={ picker }
    />
  )
}

export default ZyDatePicker
