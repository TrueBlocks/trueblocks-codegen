import { StatusBar } from './StatusBar';
import { AppShell } from '@mantine/core';
import { About, Data, Home, Settings } from '@views';
import { Route, Routes } from 'react-router-dom';

export const MainView = ({ collapsed: _ }: { collapsed: boolean }) => {
  return (
    <AppShell.Main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/data" element={<Data />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <StatusBar />
    </AppShell.Main>
  );
};
