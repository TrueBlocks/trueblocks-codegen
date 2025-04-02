import { getBarWidth } from '@components';
import { AppShell, Flex, Text } from '@mantine/core';

export const Footer = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <AppShell.Footer ml={getBarWidth(collapsed, 1) - 1}>
      <Flex h="100%" px="md" align="center" justify="space-between">
        <Text size="sm">FilePanel</Text>
        <Text size="sm">Footer Content © 2025</Text>
        <Text size="sm">Social</Text>
      </Flex>
    </AppShell.Footer>
  );
};
