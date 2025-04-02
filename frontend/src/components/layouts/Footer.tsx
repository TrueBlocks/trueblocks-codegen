import { getBarWidth } from '@components';
import { AppShell, Flex, Text } from '@mantine/core';

export const Footer = ({ opened }: { opened: boolean }) => {
  return (
    <AppShell.Footer
      ml={getBarWidth(opened, 1) - 1}
      style={{ backgroundColor: 'black', color: 'white' }}
    >
      <Flex h="100%" px="md" align="center" justify="space-between">
        <Text size="sm">FilePanel</Text>
        <Text size="sm">Footer Content © 2025</Text>
        <Text size="sm">Social</Text>
      </Flex>
    </AppShell.Footer>
  );
};
