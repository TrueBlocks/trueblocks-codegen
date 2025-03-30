import { Paper, Text } from '@mantine/core';

interface ViewProps {
  title: string;
}

export const View = ({ title }: ViewProps) => {
  return (
    <Paper shadow="xs" p="md" style={{ height: '100%' }}>
      <Text size="xl">{title}</Text>
    </Paper>
  );
};
