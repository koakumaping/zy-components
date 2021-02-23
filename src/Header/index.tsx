import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import logo from './image/logo.png';

const { Header } = Layout;

interface Props {
  title: string | ReactNode | ReactNode[];
  children?: ReactNode | ReactNode[];
  style?: React.CSSProperties;
}

const ZyHeader: React.FC<Props> = props => {
  return (
    <Header className="header">
      <div className="left header-logo">
        <img src={logo} alt="logo" />
        <span>{props.title}</span>
      </div>
      {props.children}
    </Header>
  );
};

export default ZyHeader;
