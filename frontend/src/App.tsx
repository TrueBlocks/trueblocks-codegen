import { getBarWidth } from '@components';
import { Footer, Header, HelpBar, MainView, MenuBar } from '@layout';
import { AppShell } from '@mantine/core';
import { Router } from 'wouter';

import { useAppContext } from './context/AppContext';
import { ViewContextProvider } from './context/ViewContext';
import { useAppHealth } from './hooks/useAppHealth';
import { useAppHotkeys } from './hooks/useHotkeys';

export const App = () => {
  return (
    <Router>
      <RoutedApp />
    </Router>
  );
};

const RoutedApp = () => {
  const { ready, isWizard } = useAppContext();
  const { menuCollapsed, helpCollapsed } = useAppContext();

  useAppHotkeys();
  useAppHealth();

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
      <AppShell
        layout="default"
        header={header}
        footer={footer}
        navbar={navbar}
        aside={aside}
      >
        <Header />
        <MenuBar disabled={isWizard} />
        <ViewContextProvider>
          <MainView />
        </ViewContextProvider>
        <HelpBar />
        <Footer />
      </AppShell>
    </div>
  );
};
