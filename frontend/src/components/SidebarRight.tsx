import { SidebarProps } from './SidebarLeft';
import { Text, Button, Stack } from '@mantine/core';

export const SidebarRight = ({ opened, toggle }: SidebarProps) => (
  <div>
    <Button size="xs" onClick={toggle}>
      {opened ? 'Close' : 'Open'}
    </Button>
    {opened && (
      <Stack p="md">
        <Text size="sm">Help Topic 1</Text>
        <Text size="sm">Help Topic 2</Text>
      </Stack>
    )}
  </div>
);
