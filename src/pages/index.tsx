import r from '@/util/request'
import moment, { Moment } from 'moment'
import { Col, Row, Card, DatePicker, Tabs, Empty } from 'antd'
import { formatMoney } from 'evian'
import React, { useEffect, useState } from 'react'
import { Area } from '@ant-design/charts'
import FlowImage from '@/assets/img/home-flow.png'
import OneImage from '@/assets/img/index/1.png'
import TwoImage from '@/assets/img/index/2.png'
import ThreeImage from '@/assets/img/index/3.png'
import FourImage from '@/assets/img/index/4.png'
import './index.sass'

interface Statistics {
  appNum: number
  capacityNum: number
  offlineAppNum: number
  offlineCapacityNum: number
  offlineServiceNum: number
  onlineAppNum: number
  onlineCapacityNum: number
  onlineServiceNum: number
  serviceNum: number
  yesterdayInvokeNum: number
  dayInvokeList: any[]
}

interface AbilityItem {
  recNum: number
  serviceName: string
  capacityName: string
  invokeNum: number
  avgCostTime: number
}

interface ChartItem {
  xField: string
  invokeNum: number
}

const index: React.FC = () => {
  const [ statistics, setStatistics ] = useState<Statistics>({
    appNum: 0,
    capacityNum: 0,
    offlineAppNum: 0,
    offlineCapacityNum: 0,
    offlineServiceNum: 0,
    onlineAppNum: 0,
    onlineCapacityNum: 0,
    onlineServiceNum: 0,
    serviceNum: 0,
    yesterdayInvokeNum: 0,
    dayInvokeList: []
  })

  const [ rsList, setRsList ] = useState<AbilityItem[]>([])
  const [ rsHistoryList, setRsHistoryList ] = useState<ChartItem[]>([])
  const [ costList, setCostList ] = useState<AbilityItem[]>([])

  const getStatistics = () => {
    r().get('IndexStatistics').then((res: Statistics) => {
      setStatistics(res)
      const rsHistoryOrgList: ChartItem[] = res.dayInvokeList.map((item: any) => {
        return {
          xField: item.recordDate,
          invokeNum: item.dayInvokeNum,
        }
      })
      setRsHistoryList(rsHistoryOrgList)
    })
  }

  const getAbilityCost = (payload?: Moment | null) => {
    const params = {
      recordDate: payload?.format('YYYYMMDD') || moment().subtract(1, 'days').format('YYYYMMDD')
    }
    r().get('IndexAbilityCost', { params }).then((res: AbilityItem[]) => {
      setCostList(res)
    })
  }

  const getAbilityRs = (payload?: Moment | null) => {
    const params = {
      recordDate: payload?.format('YYYYMMDD') || moment().subtract(1, 'days').format('YYYYMMDD')
    }
    r().get('IndexAbilityRs', { params }).then((res: AbilityItem[]) => {
      setRsList(res)
    })
  }

  useEffect(() => {
    getStatistics()
    getAbilityCost()
    getAbilityRs()
  }, [])

  const tabList = [
    {
      key: '能力聚合流程',
      tab: '能力聚合流程',
    },
  ]

  const config = {
    data: rsHistoryList,
    smooth: true,
    height: 56,
    xField: 'xField',
    yField: 'invokeNum',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
    },
    xAxis: {
      line: null,
      grid: null,
      label: null,
      tickLine: null,
    },
    yAxis: {
      grid: null,
      label: null,
      tickLine: null,
    },
    tooltip: {
      showTitle: false,
      formatter: (datum: any) => {
        return { name: datum.xField, value: datum.invokeNum }
      },
    },
  }

  const GreenCircleSVG: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 8 8" style={{ width: '8px', marginRight: '8px' }}>
      <circle cx="0" cy="0" r="4" strokeWidth="0" fill="#65B01B"/>
    </svg>
  )

  const RedCircleSVG: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 8 8" style={{ width: '8px', marginRight: '8px' }}>
      <circle cx="0" cy="0" r="4" strokeWidth="0" fill="#DD4547FF"/>
    </svg>
  )

  return (
    <div className="home-warp">
      <Row gutter={ 16 }>
        <Col span={ 6 }>
          <Card bodyStyle={{ padding: '20px 24px 8px' }} bordered={ false }>
            <div className="index-card">
              <div className="index-card-top">
                <div className="index-card-circle">
                  <img src={ OneImage } alt="index-icon"/>
                </div>
                <div className="index-card-title">服务总量</div>
                <div className="index-card-total">{ formatMoney(statistics.serviceNum) }</div>
              </div>
              <div className="index-card-content">
                <div className="index-card-content-fixed">
                  <div className="index-card-content-fixed-item" style={{ marginRight: '16px' }}>
                    <GreenCircleSVG />上线：<span>{ formatMoney(statistics.onlineServiceNum) }</span>
                  </div>
                  <div className="index-card-content-fixed-item">
                    <RedCircleSVG />下线：<span>{ formatMoney(statistics.offlineServiceNum) }</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={ 6 }>
          <Card bodyStyle={{ padding: '20px 24px 8px' }} bordered={ false }>
            <div className="index-card">
              <div className="index-card-top">
                <div className="index-card-circle orange">
                  <img src={ TwoImage } alt="index-icon"/>
                </div>
                <div className="index-card-title">能力总量</div>
                <div className="index-card-total">{ formatMoney(statistics.capacityNum) }</div>
              </div>
              <div className="index-card-content">
                <div className="index-card-content-fixed">
                  <div className="index-card-content-fixed-item" style={{ marginRight: '16px' }}>
                    <GreenCircleSVG />上线：<span>{ formatMoney(statistics.onlineCapacityNum) }</span>
                  </div>
                  <div className="index-card-content-fixed-item">
                    <RedCircleSVG />下线：<span>{ formatMoney(statistics.offlineCapacityNum) }</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={ 6 }>
          <Card bodyStyle={{ padding: '20px 24px 8px' }} bordered={ false }>
            <div className="index-card">
              <div className="index-card-top">
                <div className="index-card-circle green">
                  <img src={ ThreeImage } alt="index-icon"/>
                </div>
                <div className="index-card-title">已注册应用</div>
                <div className="index-card-total">{ formatMoney(statistics.appNum) }</div>
              </div>
              <div className="index-card-content">
                <div className="index-card-content-fixed">
                  <div className="index-card-content-fixed-item" style={{ marginRight: '16px' }}>
                    <GreenCircleSVG />上架：<span>{ formatMoney(statistics.onlineAppNum) }</span>
                  </div>
                  <div className="index-card-content-fixed-item">
                    <RedCircleSVG />下架：<span>{ formatMoney(statistics.offlineAppNum) }</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={ 6 }>
          <Card bodyStyle={{ padding: '20px 24px 8px' }} bordered={ false }>
            <div className="index-card">
              <div className="index-card-top">
                <div className="index-card-circle purple">
                  <img src={ FourImage } alt="index-icon"/>
                </div>
                <div className="index-card-title">昨日转发量</div>
                <div className="index-card-total">{ formatMoney(statistics.yesterdayInvokeNum) }</div>
              </div>
              <div className="index-card-content">
                <div className="index-card-content-fixed">
                  <div style={{ height: '100%' }}>
                    <div className="index-card-minichart">
                      <div className="index-card-minichart-content">
                        <Area { ...config } />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={ 16 } style={{ marginTop: '16px' }}>
        <Col span={ 12 }>
          <Card bodyStyle={{ padding: '20px 24px' }} bordered={ false }>
            <h4 className="index-h4">TOP5 能力转发</h4>
            <ul className="index-ranklist">
              {
                rsList.map((item, index) => (
                  <li key={ index }>
                    {
                      index < 3 ? (
                        <span className="item-number active">{ index + 1 }</span>
                      ) : (
                        <span className="item-number">{ index + 1 }</span>
                      )
                    }
                    <span className="item-title">{ item.serviceName } { item.capacityName }</span>
                    <span>{ formatMoney(item.invokeNum)}</span>
                  </li>
                ))
              }
              {
                rsList && rsList.length === 0 ? (
                  <Empty />
                ) : null
              }
            </ul>
            <DatePicker className="index-datepicker" defaultValue={ moment().subtract(1, 'days') } format="YYYYMMDD" onChange={ getAbilityRs } disabledDate={ (current) => current && current >= moment().subtract(1, 'days') } />
          </Card>
        </Col>
        <Col span={ 12 }>
          <Card bodyStyle={{ padding: '20px 24px' }} bordered={ false }>
            <h4 className="index-h4">TOP5 平均耗时</h4>
            <ul className="index-ranklist">
              {
                costList.map((item, index) => (
                  <li key={ index }>
                    {
                      index < 3 ? (
                        <span className="item-number active">{ index + 1 }</span>
                      ) : (
                        <span className="item-number">{ index + 1 }</span>
                      )
                    }
                    <span className="item-title">{ item.serviceName } { item.capacityName }</span>
                    <span>{ formatMoney(item.avgCostTime)}</span>
                  </li>
                ))
              }
              {
                costList && costList.length === 0 ? (
                  <Empty />
                ) : null
              }
            </ul>
            <DatePicker className="index-datepicker" defaultValue={ moment().subtract(1, 'days') } format="YYYYMMDD" onChange={ getAbilityCost } disabledDate={ (current) => current && current >= moment().subtract(1, 'days') } />
          </Card>
        </Col>
      </Row>
      <Card
        style={{ marginTop: '16px' }}
        bodyStyle={{ padding: '20px 24px ' }}
        bordered={ false }
        tabList={ tabList }
      >
        <div className="index-flow-warp">
          <img src={ FlowImage } alt="flow" style={{ width: '100%' }} />
        </div>
      </Card>
    </div>
  )
}

export default index