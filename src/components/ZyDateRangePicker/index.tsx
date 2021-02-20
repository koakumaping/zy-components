import React, { CSSProperties } from 'react'
import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'

interface Props {
  value?: [string, string]
  onChange?: (value: [string, string] | null) => void
  style?: CSSProperties
  format?: string
  disabledDate?: (payload: Moment) => boolean
}

const ZyDateRangePicker: React.FC<Props> = (props) => {
  const { value, onChange, style, format, disabledDate } = props
  const triggerChange = (changedValue: any[] | null) => {
    console.log(changedValue)
    if (onChange) {
      const changeData = changedValue ? [changedValue[0].format(format || 'YYYY-MM-DD'), changedValue[1].format(format || 'YYYY-MM-DD')] : null
      onChange(changeData)
    }
  }

  return (
    <DatePicker.RangePicker
      value={ value ? [moment(value[0]), moment(value[1])] : null }
      onChange={ triggerChange }
      allowClear={ false }
      style={ style }
      format={ format }
      disabledDate={ disabledDate }
    />
  )
}

export default ZyDateRangePicker