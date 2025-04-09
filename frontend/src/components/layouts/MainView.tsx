import { useEffect, useRef } from 'react';

import { Breadcrumb } from '@components';
import { AppShell } from '@mantine/core';
import { About, Data, Home, Settings } from '@views';
import { Route, useLocation } from 'wouter';

import { StatusBar } from './StatusBar';

export const MainView = ({ collapsed: _ }: { collapsed: boolean }) => {
  const [location] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location]);

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
        <Route path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/data">
          <Data />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
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
