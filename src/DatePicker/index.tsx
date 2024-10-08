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
  allowClear?: boolean
  showTime?: any
  disabled?: boolean
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
    allowClear,
    showTime,
    disabled
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
      style= {style }
      format={ format }
      disabledDate={ disabledDate }
      placeholder={ placeholder }
      picker={ picker }
      allowClear={ allowClear }
      showTime={ showTime }
      disabled={ disabled }
    />
  )
}

export default ZyDatePicker
