import { StatusBar } from './StatusBar';
import { AppShell, Paper, Text } from '@mantine/core';
import { About, Data, Home, Settings } from '@views';
import { Route, Routes } from 'react-router-dom';

interface ViewProps {
  title?: string;
  lastView: string;
}

export const View = ({ title, lastView }: ViewProps) => {
  return (
    <AppShell.Main style={{ backgroundColor: 'pink' }}>
      <Paper
        shadow="xs"
        p="md"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'lightblue',
          color: 'black',
        }}
      >
        {title ? <Text size="xl">{title + ' ' + lastView}</Text> : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<Data />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Paper>
      <StatusBar />
    </AppShell.Main>
  );
};
