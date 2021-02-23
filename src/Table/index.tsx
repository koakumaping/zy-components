import React, { ReactNode } from 'react';
import { TableProps } from 'antd/lib/table';
import { Table } from 'antd';

import './index.sass';

interface ZyTableProps extends TableProps<any> {
  children?: ReactNode | ReactNode[];
  style?: React.CSSProperties;
}

const ZyTable: React.FC<ZyTableProps> = props => {
  return (
    <div className="pt-table" style={props.style}>
      {props.children ? (
        <div className="pt-table-action clear">{props.children}</div>
      ) : null}
      <Table {...props} />
    </div>
  );
};

export default ZyTable;
