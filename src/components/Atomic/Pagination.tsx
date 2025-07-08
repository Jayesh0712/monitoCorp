import React from 'react';
import { Pagination, Select } from 'antd';

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  style?: React.CSSProperties;
}

const defaultOptions = [25, 50, 100];

export default function AtomicPagination({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = defaultOptions,
  style = {},
}: PaginationProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end', ...style }}>
      <span style={{ fontSize: 14 }}>Rows per page:</span>
      <Select
        value={pageSize}
        onChange={ps => onChange(1, ps)}
        options={pageSizeOptions.map(opt => ({ value: opt, label: opt }))}
        style={{ width: 80 }}
        size="small"
      />
      <Pagination
        size="small"
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        style={{ marginLeft: 8 }}
      />
    </div>
  );
}
