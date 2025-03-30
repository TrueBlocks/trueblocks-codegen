import { Text, Stack } from '@mantine/core';

export const SidebarRight = ({ opened }: { opened: boolean }) => (
  <div>
    {opened && (
      <Stack p="md">
        <Text size="sm">Help Topic 1</Text>
        <Text size="sm">Help Topic 2</Text>
      </Stack>
    )}
  </div>
);
