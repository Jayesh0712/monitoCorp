import React from 'react';
import { Table, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ServiceStatusTag from '../Atomic/ServiceStatusTag';

import { Service } from '@/mocks/data';

export default function ServiceTable({ services, onEdit, onDelete, onRowClick }: {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onRowClick: (service: Service) => void;
}) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Service) => (
        <a onClick={() => onRowClick(record)}>{text}</a>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <ServiceStatusTag status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Service) => (
        <>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} style={{ marginRight: 8 }} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record)} />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={services}
      rowKey="id"
      pagination={false}
      bordered
      size="middle"
    />
  );
}
