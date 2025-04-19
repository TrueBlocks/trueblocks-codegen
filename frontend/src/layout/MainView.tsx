import { useEffect, useRef } from 'react';

import { Breadcrumb } from '@layout';
import { AppShell } from '@mantine/core';
import { About, Data, Home, Names, Settings } from '@views';
import { Wizard } from '@wizards';
import { Route } from 'wouter';

import { useAppContext } from '../context/AppContext';
import { StatusBar } from './StatusBar';

export const MainView = () => {
  const { currentLocation } = useAppContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentLocation]);

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
        <Route path="/names">
          <Names />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/wizard">
          <Wizard />
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
