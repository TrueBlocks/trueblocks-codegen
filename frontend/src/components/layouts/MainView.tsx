import { StatusBar } from './StatusBar';
import { Breadcrumb } from '@components';
import { AppShell } from '@mantine/core';
import { About, Data, Home, Settings } from '@views';
import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

export const MainView = ({ collapsed: _ }: { collapsed: boolean }) => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <AppShell.Main
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div>
        <Breadcrumb />
      </div>

      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          backgroundColor: 'black',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<Data />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      <div
        style={{
          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <StatusBar />
      </div>
    </AppShell.Main>
  );
};
