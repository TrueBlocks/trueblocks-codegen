import { AppShell, Group, Text } from '@mantine/core';

export const Header = () => {
  return (
    <AppShell.Header>
      <Group justify="space-between" p="md" h="100%">
        <Text size="xl" fw={700}>
          TrueBlocks CodeGen
        </Text>
        <Text>Header Content</Text>
      </Group>
    </AppShell.Header>
  );
};
