import React from 'react';
import { Layout } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  FileTextOutlined,
  AlertOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import UserModal from '../Modal/UserModal';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    enabled: true,
  },
  {
    key: 'services',
    icon: <AppstoreOutlined />,
    label: 'Services',
    enabled: false,
  },
  {
    key: 'metrics',
    icon: <BarChartOutlined />,
    label: 'Metrics',
    enabled: false,
  },
  {
    key: 'logs',
    icon: <FileTextOutlined />,
    label: 'Logs',
    enabled: false,
  },
  {
    key: 'alerts',
    icon: <AlertOutlined />,
    label: 'Alerts',
    enabled: false,
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    enabled: false,
  },
];

interface SideNavProps {
  pathname: string;
  onMenuClick: (info: { key: string }) => void;
}

export default function SideNav({ pathname, onMenuClick }: SideNavProps) {
  const [userModalOpen, setUserModalOpen] = React.useState(false);
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.replace('/login');
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        position: 'fixed',
        top: 0,
        left:-10,
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden',
        background: '#1a2233',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'none',
      }}
      width={72}
    >
      <div className="flex flex-col gap-2 mt-6" style={{ flex: 1, marginTop: 80 }}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-center justify-center px-0 py-3 rounded-md transition-all
              ${pathname === '/dashboard' && item.key === 'dashboard' ? 'bg-blue-700 text-white' : 'text-gray-300'}
              ${item.enabled ? 'hover:bg-blue-900 hover:text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            onClick={item.enabled ? () => onMenuClick({ key: item.key }) : undefined}
            style={{ pointerEvents: item.enabled ? 'auto' : 'none', background: item.enabled ? undefined : 'rgba(0,0,0,0.01)', fontSize: 28 }}
          >
            {item.icon}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{ cursor: 'pointer', color: '#fff', fontSize: 28, padding: 8, borderRadius: 8, background: '#223', transition: 'background 0.2s' }}
          onClick={() => setUserModalOpen(true)}
        >
          <UserOutlined />
        </div>
        <UserModal
          open={userModalOpen}
          user={user}
          onLogout={handleLogout}
          onClose={() => setUserModalOpen(false)}
        />
      </div>
    </Sider>
  );
}
