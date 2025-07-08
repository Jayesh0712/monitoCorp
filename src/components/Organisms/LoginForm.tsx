import React from 'react';
import { Button, Form, Input, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined , DesktopOutlined } from '@ant-design/icons';

export default function LoginForm({
  onLogin,
  loading,
  error,
}: {
  onLogin: (username: string, password: string) => void;
  loading: boolean;
  error?: string;
}) {
  const [form] = Form.useForm();

  const handleFinish = (values: { username: string; password: string }) => {
    onLogin(values.username, values.password);
  };

  return (
    <Card style={{ maxWidth: 380, margin: 'auto' }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24}}>
      <DesktopOutlined style={{ fontSize: 30, color: '#1a2233',marginRight: 8}} /> MonitoCorp 
      </Typography.Title>
      {error && (
        <Typography.Text
          type="danger"
          style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}
        >
          {error}
        </Typography.Text>
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ username: '', password: '' }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" autoFocus />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ marginTop: 8 }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}