import {
  IsReady,
  GetPreferences,
  SetMenuOpen,
  SetHelpOpen,
} from '../wailsjs/go/main/App';
import {
  Footer,
  Header,
  HelpBar,
  MenuBar,
  RouteLogger,
  View,
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

  return (
    <>
      <RouteLogger ready={ready} lastView={lastView} />
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 40 }}
        navbar={{
          width: menuOpen ? 250 : 50,
          breakpoint: 'sm',
          collapsed: { mobile: !menuOpen },
        }}
        aside={{
          width: helpOpen ? 250 : 50,
          breakpoint: 'sm',
          collapsed: { mobile: !helpOpen },
        }}
        padding={0}
        styles={{
          main: {
            paddingTop: 60,
            height: 'calc(100vh - 100px)',
          },
        }}
      >
        <Header />
        <MenuBar opened={menuOpen} setOpen={toggleMenu} />
        <HelpBar opened={helpOpen} setOpen={toggleHelp} />
        <View lastView={lastView} />
        <Footer opened={menuOpen} />
      </AppShell>
    </>
  );
};
