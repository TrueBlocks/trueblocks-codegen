import {
  IsReady,
  GetPreferences,
  SetMenuOpen,
  SetHelpOpen,
} from '../wailsjs/go/main/App';
import {
  getBarWidth,
  Footer,
  Header,
  HelpBar,
  MenuBar,
  RouteLogger,
  MainView,
} from '@components';
import { AppShell } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BrowserRouter, useNavigate } from 'react-router-dom';

export const App = () => {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
};

const RoutedApp = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(true);
  const [lastView, setLastView] = useState('/');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleMenu = (open: boolean) => {
    setMenuOpen(open);
    void SetMenuOpen(open);
  };

  const toggleHelp = (open: boolean) => {
    setHelpOpen(open);
    void SetHelpOpen(open);
  };

  useEffect(() => {
    const initializeApp = async () => {
      let attempts = 0;
      const maxAttempts = 200;
      while (attempts < maxAttempts) {
        const isReady = await IsReady();
        if (isReady) {
          const prefs = await GetPreferences();
          setMenuOpen(prefs.menuOpen);
          setHelpOpen(prefs.helpOpen);
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
      const next = !helpOpen;
      setHelpOpen(next);
      void SetHelpOpen(next);
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    'mod+m',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !menuOpen;
      setMenuOpen(next);
      void SetMenuOpen(next);
    },
    { enableOnFormTags: true },
  );

  if (error) return <div>Error: {error}</div>;
  if (!ready) return <div>Not ready</div>;

  const header = { height: 60 };
  const footer = { height: 40 };
  const navbar = {
    width: getBarWidth(menuOpen, 1),
    breakpoint: 'sm',
    collapsed: { mobile: !menuOpen },
  };
  const aside = {
    width: getBarWidth(helpOpen, 2),
    breakpoint: 'sm',
    collapsed: { mobile: !helpOpen },
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
        <MenuBar opened={menuOpen} setOpen={toggleMenu} />
        <HelpBar opened={helpOpen} setOpen={toggleHelp} />
        <MainView opened={menuOpen} />
        <Footer opened={menuOpen} />
      </AppShell>
    </div>
  );
};
