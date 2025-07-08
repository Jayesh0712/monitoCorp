import React from 'react';
import { Card } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  AlertOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const cards = [
  {
    key: 'services',
    label: 'Services',
    icon: <AppstoreOutlined style={{ fontSize: 32 }} />,
    enabled: true,
    route: 'dashboard/services',
  },
  {
    key: 'metrics',
    label: 'Metrics',
    icon: <BarChartOutlined style={{ fontSize: 32 }} />,
    enabled: false,
  },
  {
    key: 'consumption',
    label: 'Consumption',
    icon: <ThunderboltOutlined style={{ fontSize: 32 }} />,
    enabled: false,
  },
  {
    key: 'billing',
    label: 'Billing',
    icon: <DollarOutlined style={{ fontSize: 32 }} />,
    enabled: false,
  },
  {
    key: 'issues',
    label: 'Issues',
    icon: <AlertOutlined style={{ fontSize: 32 }} />,
    enabled: false,
  },
  {
    key: 'fixes',
    label: 'Fixes',
    icon: <ToolOutlined style={{ fontSize: 32 }} />,
    enabled: false,
  },
];

export default function DashboardCards() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mt-12">
      {cards.map((card) => (
        <Card
          key={card.key}
          hoverable={card.enabled}
          onClick={card.enabled ? () => router.push(card.route || '#') : undefined}
          style={{
            opacity: card.enabled ? 1 : 0.5,
            pointerEvents: card.enabled ? 'auto' : 'none',
            textAlign: 'center',
            cursor: card.enabled ? 'pointer' : 'not-allowed',
            minHeight: 140,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>{card.icon}</div>
          <div className="mt-4 text-lg font-semibold">{card.label}</div>
        </Card>
      ))}
    </div>
  );
}
