import { AppShell, Center, Text } from '@mantine/core';

export const Footer = ({ opened }: { opened: boolean }) => {
  return (
    <AppShell.Footer
      ml={opened ? 250 : 50}
      style={{ borderLeft: '1px solid var(--mantine-color-gray-7)' }}
    >
      <Center p="md" h="100%">
        <Text size="sm">Footer Content © 2025</Text>
      </Center>
    </AppShell.Footer>
  );
};
