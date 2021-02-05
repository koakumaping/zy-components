import store from 'store'

interface DictItem {
  key: string
  label: string
  value: number | string
}

const dict: Record<string, DictItem[]> = store.get('dict', {})

const formatter = (name: string, value: string | number) => {
  return dict[name].find(item => item.value === value)?.label
}

export default dict

export {
  formatter,
}