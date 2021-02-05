import React from 'react'
import { IRouteComponentProps } from '@umijs/types'

export default function proxyHOC(WrappedComponent: React.ComponentType<IRouteComponentProps>) {
  return class Component extends React.Component<IRouteComponentProps> {
    render() {
      return <WrappedComponent { ...this.props } />
    }
  }
}