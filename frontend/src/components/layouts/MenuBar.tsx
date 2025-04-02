import { getBarWidth, ToggleButton } from '@components';
import { AppShell, Button, Stack } from '@mantine/core';
import { FaCog, FaDatabase, FaHome, FaInfoCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export const MenuBar = ({ collapsed, setCollapsed }: MenuBarProps) => {
  return (
    <AppShell.Navbar
      p="md"
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        height: 'calc(100vh - 30px)',
        width: getBarWidth(collapsed, 1),
        transition: 'width 0.2s ease',
      }}
    >
      <Stack h="100%" justify="space-between" gap="sm">
        <Stack gap="sm">
          <ToggleButton
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            direction="left"
          />
          {menuItems.map(({ icon: Icon, label, to }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'filled' : 'subtle'}
                  color="blue"
                  fullWidth
                  h={36}
                  w={collapsed ? 36 : '100%'}
                  leftSection={
                    <Icon size={16} style={{ marginLeft: collapsed ? 9 : 0 }} />
                  }
                  justify={collapsed ? 'center' : 'flex-start'}
                  px={collapsed ? 0 : 'md'}
                  style={{
                    marginLeft: collapsed ? -9 : 0,
                  }}
                >
                  {!collapsed && label}
                </Button>
              )}
            </NavLink>
          ))}
        </Stack>
        <Stack gap="sm" pb="md">
          <NavLink to="/settings" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'filled' : 'subtle'}
                color="blue"
                fullWidth
                h={36}
                w={collapsed ? 36 : '100%'}
                leftSection={
                  <FaCog size={16} style={{ marginLeft: collapsed ? 9 : 0 }} />
                }
                justify={collapsed ? 'center' : 'flex-start'}
                px={collapsed ? 0 : 'md'}
                style={{
                  marginLeft: collapsed ? -9 : 0,
                }}
              >
                {!collapsed && 'Settings'}
              </Button>
            )}
          </NavLink>
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};

const menuItems = [
  { icon: FaHome, label: 'Home', to: '/' },
  { icon: FaInfoCircle, label: 'About', to: '/about' },
  {
    icon: FaDatabase,
    label: 'Data',
    to: '/data',
  },
];

interface MenuBarProps {
  collapsed: boolean;
  setCollapsed: (newVal: boolean) => void;
}
