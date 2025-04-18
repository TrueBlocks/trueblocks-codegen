import { ToggleButton, getBarWidth } from '@components';
import { AppShell, Button, Stack } from '@mantine/core';
import { MenuItem, MenuItems } from 'src/Menu';

import { useAppContext } from '../context/AppContext';

interface MenuBarProps {
  collapsed: boolean;
  setCollapsed: (newVal: boolean) => void;
  disabled?: boolean;
}

export const MenuBar = ({
  collapsed,
  setCollapsed,
  disabled = false,
}: MenuBarProps) => {
  const { currentLocation, navigate } = useAppContext();

  const topMenuItems = MenuItems.filter((item) => item.position === 'top');
  const botMenuItems = MenuItems.filter((item) => item.position !== 'top');

  const renderMenuItem = ({ icon: Icon, label, to }: MenuItem) => (
    <Button
      key={to}
      variant={currentLocation === to ? 'filled' : 'subtle'}
      fullWidth
      h={36}
      w={collapsed ? 36 : '100%'}
      leftSection={<Icon size={16} style={{ marginLeft: collapsed ? 9 : 0 }} />}
      justify={collapsed ? 'center' : 'flex-start'}
      px={collapsed ? 0 : 'md'}
      style={{
        marginLeft: collapsed ? -9 : 0,
      }}
      disabled={disabled}
      onClick={() => {
        if (!disabled) navigate(to);
      }}
    >
      {!collapsed && label}
    </Button>
  );

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
          {topMenuItems.map(renderMenuItem)}
        </Stack>
        <Stack gap="sm" pb="md">
          {botMenuItems.map(renderMenuItem)}
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};
