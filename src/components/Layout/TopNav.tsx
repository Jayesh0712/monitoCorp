import React from 'react';
import { Layout, Typography, Badge } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  TagsOutlined,
  DesktopOutlined
} from '@ant-design/icons';

const { Header } = Layout;

export default function TopNav() {
  return (
    <Header
      style={{
        fontSize: 20,
        fontWeight: 'bold',
        background: '#1a2233',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'fixed',
        left:0,
        top: 0,
        width: '100%',
        zIndex: 120,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div className="flex items-flex-start gap-2">
      <DesktopOutlined style={{ fontSize: 35, color: '#ffffff',marginLeft: -36 , marginRight: 8 }} /> 
        <Typography.Text strong style={{ fontSize: 22, color: '#ffffff' }}>
          MonitoCorp SRE Manager
        </Typography.Text>
      </div>
      <div className="flex items-center justify-end">
      <div style={{ display: 'flex',gap: 28 }}>
        <Badge count={3} overflowCount={99} offset={[0, 2]}>
          <BellOutlined style={{ fontSize: 22, color: '#ffffff' }} />
        </Badge>
        <Badge count={5} overflowCount={99} offset={[0, 2]}>
          <TagsOutlined style={{ fontSize: 22, color: '#ffffff' }} />
        </Badge>
        <SettingOutlined style={{ fontSize: 22, color: '#ffffff' }} />
      </div>
        </div>
    </Header>
  );
}
