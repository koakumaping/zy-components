import { useState, useEffect, useMemo } from 'react'
import { message } from 'antd'
import { isEmpty, isObject, hasOwn, clone, toNumber, queryForm } from 'evian'
import { useLocation, history } from 'umi'
import r from '@/util/request'
import { LayoutProps, RowItem } from '@/types'
import { PaginationProps } from 'antd/lib/pagination'
import { FormLayout } from 'antd/lib/form/Form'

interface FormData {
  [key: string]: any
}

export interface ModularProps<RecordType = RowItem> {
  rowId: string | number
  form: any
  setForm: (payload: Record<string, any>) => void
  loading: boolean
  handleSubmit: (payload: RecordType) => void
  onSubmit?: (payload: RecordType) => void
  visible: boolean,
  setVisible: (payload: boolean) => void
  layout?: LayoutProps
  tailLayout?: LayoutProps
  width?: number | string
  children?: React.ReactNode | React.ReactNode[]
  title?: string[]
  formLayout?: FormLayout
}

export default function useZoo(manual?: boolean, manualGetList?: Function) {
  const location = useLocation()
  const initName = useMemo(() => {
    const tmp = location.pathname.replace('/', '').split('/')
    return tmp.map(item => {
      return item.replace(/^./, function(str){
        return str.toUpperCase()
      })
    }).toString().replaceAll(',', '')
  }, [ location ])

  const currentPage = useMemo(() => {
    return toNumber(history.location.query?.page) || 1
  }, [ history.location ])

  const currentPageSize = useMemo(() => {
    return toNumber(history.location.query?.pageSize) || 10
  }, [ history.location ])

  const searchQuery = useMemo(() => {
    const query = queryForm(history.location.query || {})
    delete query.page
    delete query.pageSize
    return query
  }, [ history.location ])

  const initFormData: FormData = {}
  const [ name ] = useState(initName)
  const [ loading, setLoading ] = useState(false)
  const [ visible, setVisible ] = useState(false)
  const [ total, setTotal ] = useState(0)
  const [ list, setList ] = useState<any[]>([])
  const [ form, setForm ] = useState(initFormData)
  const [ rowId, setRowId ] = useState(0)

  function clearEmptyFormData(payload: Record<string, any> = {}) {
    Object.keys(payload).forEach(item => {
      if (isEmpty(payload[item])) {
        delete payload[item]
      }
    })
  }

  const getList = () => {
    if (manual && manualGetList) {
      manualGetList()
      return
    }
    setLoading(true)
    const params = {
      page: currentPage,
      limit: currentPageSize,
      ...searchQuery,
    }

    r().get(name , { params }).then((res: any) => {
      if (currentPage > 1 && res.records.length === 0) {
        const { pathname } = history.location
        let query = history.location.query || {}
        query.page = '1'
        history.replace({
          pathname,
          query,
        })

        return
      }
      setList(res.records)
      setTotal(res.total)
    }).finally(() => {
      setLoading(false)
    })
  }

  if (!manual) {
    useEffect(() => {
      getList()
    }, [currentPage, currentPageSize, searchQuery])
  }

  const showModular = (payload?: Record<string, any> | void) => {
    const id = payload ? payload.recNum : 0
    setRowId(id)
    // 弹出详情框
    setVisible(true)
    // 详情获取
    window.setTimeout(() => {
      getDetail(id)
    }, 0)
  }

  const onPageChange = (current: number) => {
    const { pathname } = history.location
    const query = history.location.query || {}
    query.page = current + ''
    history.replace({
      pathname,
      query,
    })
  }

  const onPageSizeChange = (current: number, size: number) => {
    const { pathname } = history.location
    const query = history.location.query || {}
    query.page = '1'
    query.pageSize = size + ''
    history.replace({
      pathname,
      query,
    })
  }

  const onSearch = (payload: Record<string, any>) => {
    const { pathname } = history.location
    const query = queryForm(history.location.query || {})
    query.page = 1
    Object.assign(query, payload)
    history.replace({
      pathname,
      query,
    })
  }

  const getDetail = (id: number) => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      const params: any = { ...searchQuery }
      params.id = id

      if (id > 0) {
        r().get(name, { params }).then((res: any) => {
          if (isObject(res)) {
            if (hasOwn(res, 'id')) delete res.id
            setForm(clone(res))
          }
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        }).finally(() => {
          setLoading(false)
        })
      } else {
        setForm({})
        setLoading(false)
        resolve({})
      }
    })
  }

  const handleDelete = (payload: RowItem, extra?: Record<string, any>) => {
    setLoading(true)

    let params = {
      id: payload.recNum,
    }

    if (extra) params = Object.assign(params, extra)

    r().delete(name, { params }).then(() => {
      message.success('删除成功')
      if (currentPage > 1 && list.length === 1) {
        const { pathname } = history.location
        const query = history.location.query || {}
        query.page = '1'
        history.replace({
          pathname,
          query,
        })
      }
    }).finally(() => {
      setLoading(false)
      if (manual && manualGetList) {
        manualGetList()
        return
      }
      getList()
    })
  }

  const handleSubmit = (payload: any | void) => {
    if (loading) return
    setLoading(true)
    const id = rowId
    // 利用id来判断是新增还是修改
    const formdata = payload
    let params = {}
    clearEmptyFormData(formdata)

    const f = id ? r().put : r().post
    if (id) params = { id }

    f(name, formdata, { params }).then(() => {
      setVisible(false)
      message.success(id ? '修改成功' : '新增成功')
      setForm(initFormData)
      if (manual && manualGetList) {
        manualGetList()
        return
      }
      getList()
    }).finally(() => {
      setLoading(false)
    })
  }

  const modularProps: ModularProps = {
    rowId,
    loading,
    visible,
    setVisible,
    form,
    setForm,
    handleSubmit,
  }

  const pagination: PaginationProps = {
    size: 'small',
    current: currentPage,
    pageSize: currentPageSize,
    total: total,
    onChange: onPageChange,
    showSizeChanger: true,
    onShowSizeChange: onPageSizeChange,
    showTotal: (all) => `共${all}条`,
  }

  return {
    initName,
    currentPage,
    currentPageSize,
    searchQuery,
    loading,
    setLoading,
    rowId,
    setRowId,
    visible,
    setVisible,
    list,
    setList,
    getList,
    onSearch,
    handleSubmit,
    handleDelete,
    form,
    setForm,
    showModular,
    total,
    setTotal,
    pagination,
    modularProps,
  }
}