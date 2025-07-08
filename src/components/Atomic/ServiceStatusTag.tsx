import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

export default function ServiceStatusTag({ status }: { status: string }) {
  switch (status) {
    case 'Online':
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Online
        </Tag>
      );
    case 'Degraded':
      return (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Degraded
        </Tag>
      );
    case 'Offline':
    default:
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Offline
        </Tag>
      );
  }
}
