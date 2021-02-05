import * as React from 'react'
import enzyme, { mount, shallow } from 'enzyme'
import enzymeAdapterReact16 from 'enzyme-adapter-react-16'
import ZySearchForm from '../index'
import { Button, Input, Select } from 'antd'
import { ColumnItem } from '@/types'

enzyme.configure({
  adapter: new enzymeAdapterReact16(),
})

const btnItem = <Button type="primary" htmlType="submit">查询</Button>

const inputItem = <Input placeholder="应用名称" allowClear />
const selectItem = (
  <Select placeholder="应用状态" allowClear>
    <Select.Option value="">全部</Select.Option>
    <Select.Option value={ 0 }>启用</Select.Option>
    <Select.Option value={ 1 }>禁用</Select.Option>
  </Select>
)

const searchColums: ColumnItem[] = [
  {
    dataIndex: 'name',
    formItem: inputItem,
  },
  {
    dataIndex: 'status',
    formItem: selectItem,
  },
]

describe('<ZySearchForm />', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    })
  })

  it('no children', () => {
    const instance = shallow(<ZySearchForm items={ [] } onFinish={ () => {} } />)
    expect(instance.contains(btnItem)).toBeFalsy()
    expect(instance.contains(inputItem)).toBeFalsy()
    expect(instance.contains(selectItem)).toBeFalsy()
  })

  it('has children', () => {
    const instance = shallow(<ZySearchForm items={ searchColums } onFinish={ () => {} } />)
    expect(instance.contains(btnItem)).toBeTruthy()
    expect(instance.contains(inputItem)).toBeTruthy()
    expect(instance.contains(selectItem)).toBeTruthy()
  })

  it('click search btn', () => {
    const clickMock = jest.fn()
    const instance = mount(<ZySearchForm items={ searchColums } onFinish={ clickMock() } />)
    expect(instance.contains(btnItem)).toBeTruthy()
    const btn = instance.find('button').at(0)
    // 触发 btnItem 的click事件
    btn.simulate('click')
		// 判断click事件是否被触发
    expect(clickMock).toBeCalledTimes(1)
  })
})