import { Button, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export type SidebarProps = {
  opened: boolean;
  toggle: () => void;
};

export const SidebarLeft = ({ opened, toggle }: SidebarProps) => (
  <div>
    <Button size="xs" onClick={toggle}>
      {opened ? 'Close' : 'Open'}
    </Button>
    {opened && (
      <Stack>
        <Button component={NavLink} to="/" variant="subtle">
          Home
        </Button>
        <Button component={NavLink} to="/about" variant="subtle">
          About
        </Button>
      </Stack>
    )}
  </div>
);
