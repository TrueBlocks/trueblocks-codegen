import { Button, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export const SidebarLeft = ({ opened }: { opened: boolean }) => (
  <div>
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
