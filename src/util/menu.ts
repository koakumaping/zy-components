import { MenuItem } from '@/types/menu'

const menu: Array<MenuItem> = [
  {
    icon: 'DashboardOutlined',
    key: 'home',
    label: '首页',
    value: 'Home',
    path: '/home',
  },
  {
    icon: 'SettingOutlined',
    key: 'config',
    label: '参数管理',
    children: [
      {
        key: 'config-safe',
        label: '参数设置',
        value: 'ConfigSafe',
        path: '/config/safe',
      },
      {
        key: 'config-pact',
        label: '协议管理',
        value: 'ConfigPact',
        path: '/config/pact',
      },
    ],
  },
  {
    icon: 'AppstoreOutlined',
    key: 'ability',
    label: '能力聚合',
    children: [
      {
        key: 'ability-sdev',
        label: '服务开发商',
        value: 'AbilitySdev',
        path: '/ability/sdev',
      },
      {
        key: 'ability-dict',
        label: '功能类型管理',
        value: 'AbilityDict',
        path: '/ability/dict',
      },
      {
        key: 'ability-service',
        label: '服务管理',
        value: 'AbilityService',
        path: '/ability/service',
      },
      {
        key: 'ability-manage',
        label: '能力管理',
        value: 'AbilityManage',
        path: '/ability/manage',
      },
    ],
  },
  {
    icon: 'GoldOutlined',
    key: 'open',
    label: '能力开放',
    children: [
      {
        key: 'open-devman',
        label: '应用开发者管理',
        value: 'OpenDevman',
        path: '/open/devman?checkFlag=0',
      },
      {
        key: 'open-app',
        label: '应用申请管理',
        value: 'OpenApp',
        path: '/open/app?checkFlag=0',
      },
      {
        key: 'open-ipauth',
        label: '应用IP授权',
        value: 'OpenIpauth',
        path: '/open/ipauth?envType=2',
      },
    ],
  },
  {
    icon: 'BlockOutlined',
    key: 'app',
    label: '应用集成',
    children: [
      {
        key: 'app-onoff',
        label: ' 应用上架管理',
        value: 'AppOnOff',
        path: '/app/onoff?checkFlag=0',
      },
      {
        key: 'app-manage',
        label: ' 应用管理',
        value: 'AppManage',
        path: '/app/manage',
      },
    ],
  },
  {
    icon: 'AreaChartOutlined',
    key: 'data',
    label: '数据统计',
    children: [
      {
        key: 'data-afa',
        label: '能力转发汇总',
        value: 'DataAfa',
        path: '/data/afa',
      },
      {
        key: 'data-afd',
        label: '能力转发明细',
        value: 'DataAfd',
        path: '/data/afd',
      },
      {
        key: 'data-ara',
        label: '应用调取汇总',
        value: 'DataAra',
        path: '/data/ara',
      },
    ],
  },
  {
    icon: 'AlertOutlined',
    key: 'watch',
    label: '服务监控',
    children: [
      {
        key: 'watch-error',
        label: '异常警告',
        value: 'WatchError',
        path: '/watch/error',
      },
    ],
  },
]

export default menu