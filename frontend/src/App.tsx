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
import { Router, useLocation } from 'wouter';

import {
  CollapseHelp,
  CollapseMenu,
  GetAppPreferences,
  GetWizardState,
  IsReady,
} from '../wailsjs/go/app/App';
import { useAppHotkeys } from './hooks/useHotkeys';

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

  const [location, navigate] = useLocation();
  const inWizard = location.startsWith('/wizard');

  const toggleMenu = (open: boolean) => {
    collapseMenu(open);
    CollapseMenu(open);
  };

  const toggleHelp = (open: boolean) => {
    collapseHelp(open);
    CollapseHelp(open);
  };

  useAppHotkeys({
    helpCollapsed,
    collapseHelp,
    menuCollapsed,
    collapseMenu,
  });

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
    initializeApp();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const checkWizardState = async () => {
      try {
        const state = await GetWizardState();
        const needsWizard = state.missingNameEmail || state.rpcUnavailable;
        if (needsWizard && !inWizard) {
          navigate('/wizard', { replace: true });
        }
      } catch (err) {
        console.error('Failed to check wizard state:', err);
      }
    };
    checkWizardState();
    const interval = setInterval(checkWizardState, 1500);
    return () => clearInterval(interval);
  }, [ready, inWizard, navigate]);

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
        <MenuBar
          collapsed={menuCollapsed}
          setCollapsed={toggleMenu}
          disabled={inWizard}
        />
        <HelpBar collapsed={helpCollapsed} setCollapsed={toggleHelp} />
        <MainView collapsed={menuCollapsed} />
        <Footer collapsed={menuCollapsed} />
      </AppShell>
    </div>
  );
};
