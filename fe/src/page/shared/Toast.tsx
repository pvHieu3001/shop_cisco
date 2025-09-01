import { toast } from 'react-toastify';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Ant Design icons
import 'react-toastify/dist/ReactToastify.css';

export const popupSuccess = (text: string) => {
  return toast.success(text, {
    icon: <SmileOutlined style={{ color: '#52c41a', fontSize: 20 }} />,
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  });
};

export const popupError = (text: string) => {
  return toast.error(text, {
    icon: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />,
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  });
};