import React from 'react';
import { Modal, Button, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface UserModalProps {
  open: boolean;
  user: { username?: string; name?: string } | null;
  onLogout: () => void;
  onClose: () => void;
}

export default function UserModal({ open, user, onLogout, onClose }: UserModalProps) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} centered title="User Details">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Avatar size={64} icon={<UserOutlined />} />
        <Typography.Text strong>{user?.name || user?.username || 'User'}</Typography.Text>
        <Button danger block onClick={onLogout} style={{ marginTop: 16 }}>
          Logout
        </Button>
      </div>
    </Modal>
  );
}
