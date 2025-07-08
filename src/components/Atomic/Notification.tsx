import { notification } from 'antd';

export function notifySuccess(message: string, description?: string) {
  notification.success({
    message,
    description,
    placement: 'topRight',
  });
}

export function notifyError(message: string, description?: string) {
  notification.error({
    message,
    description,
    placement: 'topRight',
  });
}
