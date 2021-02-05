export interface MenuItem {
  label: string
  key: string
  value?: string
  path?: string
  icon?: string
  pid?: string | null
  children?: MenuItem[]
}