import { useEffect, useState } from 'react';

import {
  Footer,
  Header,
  HelpBar,
  MainView,
  MenuBar,
  RouteLogger,
  getBarWidth,
} from '@components';
import { AppShell } from '@mantine/core';
import { useHotkeys } from 'react-hotkeys-hook';
import { Router, useLocation } from 'wouter';

import {
  CollapseHelp,
  CollapseMenu,
  GetAppPreferences,
  IsReady,
} from '../wailsjs/go/app/App';

export const App = () => {
  return (
    <Router>
      <RoutedApp />
    </Router>
  );
};

const RoutedApp = () => {
  const [menuCollapsed, collapseMenu] = useState(true);
  const [helpCollapsed, collapseHelp] = useState(true);
  const [lastView, setLastView] = useState('/');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, navigate] = useLocation();

  const toggleMenu = (open: boolean) => {
    collapseMenu(open);
    void CollapseMenu(open);
  };

  const toggleHelp = (open: boolean) => {
    collapseHelp(open);
    void CollapseHelp(open);
  };

  useEffect(() => {
    const initializeApp = async () => {
      let attempts = 0;
      const maxAttempts = 200;
      while (attempts < maxAttempts) {
        const isReady = await IsReady();
        if (isReady) {
          const prefs = await GetAppPreferences();
          collapseMenu(prefs.menuCollapsed);
          collapseHelp(prefs.helpCollapsed);
          setLastView(prefs.lastView || '/');
          setReady(true);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
        attempts++;
      }
      setError('Backend failed to initialize within timeout');
    };
    void initializeApp();
  }, []);

  useHotkeys('mod+1', (e) => {
    e.preventDefault();
    void navigate('/');
  });

  useHotkeys('mod+2', (e) => {
    e.preventDefault();
    void navigate('/about');
  });

  useHotkeys('mod+3', (e) => {
    e.preventDefault();
    void navigate('/data');
  });

  useHotkeys('mod+4', (e) => {
    e.preventDefault();
    void navigate('/settings');
  });

  useHotkeys(
    'mod+h',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !helpCollapsed;
      collapseHelp(next);
      void CollapseHelp(next);
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    'mod+m',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !menuCollapsed;
      collapseMenu(next);
      void CollapseMenu(next);
    },
    { enableOnFormTags: true },
  );

  if (error) return <div>Error: {error}</div>;
  if (!ready) return <div>Not ready</div>;

  const header = { height: 60 };
  const footer = { height: 40 };
  const navbar = {
    width: getBarWidth(menuCollapsed, 1),
    breakpoint: 'sm',
    collapsed: { mobile: !menuCollapsed },
  };
  const aside = {
    width: getBarWidth(helpCollapsed, 2),
    breakpoint: 'sm',
    collapsed: { mobile: !helpCollapsed },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <RouteLogger ready={ready} lastView={lastView} />
      <AppShell
        layout="default"
        header={header}
        footer={footer}
        navbar={navbar}
        aside={aside}
      >
        <Header />
        <MenuBar collapsed={menuCollapsed} setCollapsed={toggleMenu} />
        <HelpBar collapsed={helpCollapsed} setCollapsed={toggleHelp} />
        <MainView collapsed={menuCollapsed} />
        <Footer collapsed={menuCollapsed} />
      </AppShell>
    </div>
  );
};
