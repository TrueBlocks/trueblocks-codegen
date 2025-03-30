import { ConsoleLog } from '../wailsjs/go/main/App';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { About } from './views/About';
import { Home } from './views/Home';
import { AppShell, ActionIcon } from '@mantine/core';
// import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const RouteLogger = () => {
  const location = useLocation();
  useEffect(() => {
    ConsoleLog(location.pathname);
  }, [location]);
  return null;
};

export const App = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <BrowserRouter>
      <RouteLogger />
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 40 }}
        navbar={{
          width: leftOpen ? 250 : 50,
          breakpoint: 'sm',
          collapsed: { mobile: !leftOpen },
        }}
        aside={{
          width: rightOpen ? 250 : 50,
          breakpoint: 'sm',
          collapsed: { mobile: !rightOpen },
        }}
        padding={0}
        styles={{
          main: {
            paddingTop: 60,
            height: 'calc(100vh - 100px)',
          },
        }}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Navbar p="xs">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => setLeftOpen((o) => !o)}
          >
            {leftOpen ? 'X' : '+'}
          </ActionIcon>
          <SidebarLeft
            opened={leftOpen}
            toggle={() => setLeftOpen((o) => !o)}
          />
        </AppShell.Navbar>

        <AppShell.Aside p="xs">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => setRightOpen((o) => !o)}
          >
            {rightOpen ? 'X' : '+'}
          </ActionIcon>
          <SidebarRight
            opened={rightOpen}
            toggle={() => setRightOpen((o) => !o)}
          />
        </AppShell.Aside>

        <AppShell.Main p="xs">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AppShell.Main>

        <AppShell.Footer
          ml={leftOpen ? 250 : 50}
          style={{ borderLeft: '1px solid var(--mantine-color-gray-7)' }}
        >
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </BrowserRouter>
  );
};
