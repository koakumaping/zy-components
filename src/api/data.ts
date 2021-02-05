import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const data: ApiItem[] = [
  {
    name: '能力转发汇总',
    eng: 'DataAfa',
    url: `${baseUrl}/manager/reports/service/invoke`,
  },
  {
    name: '能力转发明细',
    eng: 'DataAfd',
    url: `${baseUrl}/manager/reports/capacity/invoke`,
  },
  {
    name: '能力转发明细-图表',
    eng: 'DataAfdChart',
    url: `${baseUrl}/manager/reports/capacity/invoke/{searchMethod}`,
  },
  {
    name: '应用调取汇总',
    eng: 'DataAra',
    url: `${baseUrl}/manager/reports/app/invoke`,
  },
]

export default data