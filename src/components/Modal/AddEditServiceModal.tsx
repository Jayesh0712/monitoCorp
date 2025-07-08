import React, { useEffect } from 'react';
import { Service } from '@/mocks/data';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

export default function AddEditServiceModal({
  open,
  onClose,
  onSave,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Service) => void;
  initialData?: Service;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  return (
    <Modal
      open={open}
      title={initialData ? 'Edit Service' : 'Add Service'}
      okText={initialData ? 'Update' : 'Add'}
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSave(values);
            form.resetFields();
          })
          .catch(() => {});
      }}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={initialData || { status: 'Online', type: 'API' }}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{message: 'Please enter a service name' }]}
        >
          <Input placeholder="Service Name" />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{message: 'Please select a type' }]}
        >
          <Select>
            <Option value="API">API</Option>
            <Option value="Database">Database</Option>
            <Option value="Worker">Worker</Option>
            <Option value="Cache">Cache</Option>
            <Option value="Queue">Queue</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
