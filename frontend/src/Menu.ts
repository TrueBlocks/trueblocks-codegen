import {
  FaCog,
  FaDatabase,
  FaHome,
  FaInfoCircle,
  FaUser,
} from 'react-icons/fa';

export interface MenuItem {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  to: string;
  position: 'top' | 'bottom';
}

export const MenuItems: MenuItem[] = [
  { icon: FaHome, label: 'Home', to: '/', position: 'top' },
  { icon: FaInfoCircle, label: 'About', to: '/about', position: 'top' },
  { icon: FaDatabase, label: 'Data', to: '/data', position: 'top' },
  { icon: FaUser, label: 'Names', to: '/names', position: 'top' },
  { icon: FaCog, label: 'Settings', to: '/settings', position: 'bottom' },
];
