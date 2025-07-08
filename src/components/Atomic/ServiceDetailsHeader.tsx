import React from 'react';
import { Card, Tag, Typography } from 'antd';
import ServiceStatusTag from './ServiceStatusTag';
import { Service } from '@/mocks/data';

export default function ServiceDetailsHeader({ service }: { service: Service }) {
  return (
    <Card variant="outlined" style={{ marginBottom: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 0 }}>
        {service.name}
      </Typography.Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
        <span>Type: <Tag color="blue">{service.type}</Tag></span>
        <span>Status: <ServiceStatusTag status={service.status} /></span>
      </div>
    </Card>
  );
}
