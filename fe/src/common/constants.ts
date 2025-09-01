import { getLocalStorage } from "../utils/localStorage";

const ADMIN_BASE_IMAGE_URL = import.meta.env.VITE_ADMIN_BASE_IMAGE_URL;
const EXTERNAL_BASE_API = import.meta.env.VITE_EXTERNAL_BASE_API;
const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL;

const LOCAL_STORAGE_TOKEN = "token";
const LOCAL_STORAGE_USER = "user";

const TOKEN = {
  headers: {
    Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
  },
};

const typeOptions = [
  { value: 'technology', label: 'Công Nghệ' },
  { value: 'game', label: 'Game' },
  { value: 'tips', label: 'Tiện Ích' },
  { value: 'archive', label: 'Sưu Tầm' }
]

export {
  ADMIN_BASE_IMAGE_URL,
  EXTERNAL_BASE_API,
  DOMAIN_URL,
  LOCAL_STORAGE_TOKEN,
  LOCAL_STORAGE_USER,
  TOKEN,
  typeOptions
};
