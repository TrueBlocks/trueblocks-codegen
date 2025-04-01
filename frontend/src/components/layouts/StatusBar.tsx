import { Box, Text } from '@mantine/core';

export const StatusBar = () => {
  return (
    <Box
      h={24}
      px="md"
      bg="#2a2a2a"
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'yellow',
        flexShrink: 0,
      }}
    >
      <Text>Waiting for backend…</Text>
    </Box>
  );
};
