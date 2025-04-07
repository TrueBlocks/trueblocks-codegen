import { Stack, Box, Text } from '@mantine/core';

export const Home = () => {
  return (
    <Box style={{ backgroundColor: 'yellow', minHeight: '100%' }}>
      <Stack style={{ color: 'black' }}>
        <Text>THIS IS THE HOME SCREEN</Text>
        {Array.from({ length: 50 }).map((_, index) => (
          <Text key={index}>
            Dummy content line {index + 1} - Scroll to test visibility
          </Text>
        ))}
      </Stack>
    </Box>
  );
};
