import { ToggleChevron } from '@components';
import { AppShell, Button, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';

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
      {opened && (
        <Stack gap="sm">
          <Button component={NavLink} to="/" variant="subtle">
            Home
          </Button>
          <Button component={NavLink} to="/about" variant="subtle">
            About
          </Button>
          <Button component={NavLink} to="/settings" variant="subtle">
            Settings
          </Button>
        </Stack>
      )}
    </div>
  </AppShell.Navbar>
);
