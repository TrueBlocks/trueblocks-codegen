import { getBarWidth, ToggleChevron } from '@components';
import { AppShell, Button, Stack } from '@mantine/core';
import { FaCog, FaDatabase, FaHome, FaInfoCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export const MenuBar = ({ opened, setOpen }: MenuBarProps) => {
  return (
    <AppShell.Navbar
      p="md"
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        height: 'calc(100vh - 30px)',
        width: getBarWidth(opened, 1),
        transition: 'width 0.2s ease',
      }}
    >
      <Stack h="100%" justify="space-between" gap="sm">
        <Stack gap="sm">
          <ToggleChevron
            opened={opened}
            onToggle={() => setOpen(!opened)}
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
                  w={opened ? '100%' : 36}
                  leftSection={
                    <Icon size={16} style={{ marginLeft: opened ? 0 : 9 }} />
                  }
                  justify={opened ? 'flex-start' : 'center'}
                  px={opened ? 'md' : 0}
                  style={{
                    marginLeft: opened ? 0 : -9,
                  }}
                >
                  {opened && label}
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
                w={opened ? '100%' : 36}
                leftSection={
                  <FaCog size={16} style={{ marginLeft: opened ? 0 : 9 }} />
                }
                justify={opened ? 'flex-start' : 'center'}
                px={opened ? 'md' : 0}
                style={{
                  marginLeft: opened ? 0 : -9,
                }}
              >
                {opened && 'Settings'}
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
  opened: boolean;
  setOpen: (open: boolean) => void;
}
