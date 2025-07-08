import React from 'react';
import { Modal } from 'antd';

export default function DeleteServiceModal({
  open,
  onConfirm,
  onCancel,
  serviceName,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void; 
  serviceName?: string;
}) {
  return (
    <Modal
      open={open}
      title="Delete Service"
      okText="Delete"
      okButtonProps={{ danger: true }}
      onOk={onConfirm}
      onCancel={onCancel}
      destroyOnHidden
    >
      <p>
        Are you sure you want to delete <strong>{serviceName}</strong>?
      </p>
    </Modal>
  );
}
