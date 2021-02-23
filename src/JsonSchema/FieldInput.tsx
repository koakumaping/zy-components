import React, { useRef, useEffect, useState } from 'react'
import { Input } from 'antd'
import { InputProps } from 'antd/lib/input'

const FieldInput: React.FC<InputProps> = props => {
  const { onChange } = props
  const [value, setValue] = useState(props.value)

  const prevValueRef = useRef(props.value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return
    if (e.target.value !== prevValueRef.current) onChange(e)
  }

  useEffect(() => {
    if (props.value !== prevValueRef.current && value !== props.value) {
      prevValueRef.current = value
      setValue(props.value)
    }
  }, [value])

  return (
    <Input
      { ...props }
      value={ value }
      onBlur={ handleBlur }
      onChange={ handleChange }
      className="field-input"
    />
  )
}

export default FieldInput
