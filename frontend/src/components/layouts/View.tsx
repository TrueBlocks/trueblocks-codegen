import { AppShell, Paper, Text } from '@mantine/core';
import { About, Home, Data, Settings } from '@views';
import { Navigate, Route, Routes } from 'react-router-dom';

interface ViewProps {
  title?: string;
  lastView: string;
}

export const View = ({ title, lastView }: ViewProps) => {
  return (
    <AppShell.Main p="md">
      <Paper shadow="xs" p="md" style={{ height: '100%' }}>
        {title ? <Text size="xl">{title}</Text> : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<Data />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to={lastView} replace />} />
        </Routes>
      </Paper>
    </AppShell.Main>
  );
};
