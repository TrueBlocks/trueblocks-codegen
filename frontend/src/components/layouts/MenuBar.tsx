import { ToggleChevron } from '@components';
import { AppShell, Button, Stack } from '@mantine/core';
import { FaHome, FaInfoCircle, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { icon: FaHome, label: 'Home', to: '/' },
  { icon: FaInfoCircle, label: 'About', to: '/about' },
  { icon: FaCog, label: 'Settings', to: '/settings' },
];

export const MenuBar = ({
  opened,
  setOpen,
}: {
  opened: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <AppShell.Navbar p="md">
    <ToggleChevron
      opened={opened}
      onToggle={() => {
        setOpen(!opened);
      }}
      direction="left"
    />
    <div>
      <Stack gap="sm">
        {menuItems.map(({ icon: Icon, label, to }) => (
          <Button
            key={to}
            component={NavLink}
            to={to}
            variant="subtle"
            leftSection={<Icon size={16} />}
            style={{ justifyContent: opened ? 'flex-start' : 'center' }}
          >
            {opened && label}
          </Button>
        ))}
      </Stack>{' '}
    </div>
  </AppShell.Navbar>
);
