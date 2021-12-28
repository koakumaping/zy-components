import { Button } from 'antd'
import React from 'react'
import { history } from 'umi'
import './index.sass'

interface Props {
  title: string
  children?: React.ReactNode | React.ReactNode[]
}

const PageHeader: React.FC<Props> = (props) => {
  return (
    <div className="zy-page-header">
      <div className="zy-page-header-heading">
        <div className="zy-page-header-heading-left">
          <span className="zy-page-header-heading-title">{ props.title }</span>
        </div>
        <div className="zy-page-header-heading-right">
          <Button onClick={ () => history.goBack() }>返回</Button>
        </div>
      </div>
      {
        props.children ? (
          <div className="zy-page-header-footer">
            { props.children }
          </div>
        ) : null
      }
    </div>
  )
}

export default PageHeader