import React, { CSSProperties } from 'react';
import { DatePicker } from 'antd';
import { RangeValue } from 'rc-picker/lib/interface';
import moment, { Moment } from 'moment';

declare type ValueItem = [string, string] | null;
interface Props {
  value?: ValueItem;
  onChange?: (value: ValueItem) => void;
  style?: CSSProperties;
  format?: string;
  disabledDate?: (payload: Moment) => boolean;
}

const ZyDateRangePicker: React.FC<Props> = props => {
  const { value, onChange, style, format, disabledDate } = props;
  const triggerChange = (changedValue: RangeValue<Moment>) => {
    console.log(changedValue);
    if (onChange) {
      let changeData: ValueItem = null;
      if (
        changedValue !== null &&
        changedValue[0] !== null &&
        changedValue[1] !== null
      ) {
        changeData = [
          changedValue[0].format(format || 'YYYY-MM-DD'),
          changedValue[1].format(format || 'YYYY-MM-DD'),
        ];
      }
      onChange(changeData);
    }
  };

  return (
    <DatePicker.RangePicker
      value={value ? [moment(value[0]), moment(value[1])] : null}
      onChange={triggerChange}
      allowClear={false}
      style={style}
      format={format}
      disabledDate={disabledDate}
    />
  );
};

export default ZyDateRangePicker;
