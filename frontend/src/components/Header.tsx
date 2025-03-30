import { Group, Text } from '@mantine/core';

export const Header = () => {
  return (
    <Group justify="space-between" p="md">
      <Text size="lg" fw={700}>
        TrueBlocks CodeGen
      </Text>
      <Text>Header Content</Text>
    </Group>
  );
};
