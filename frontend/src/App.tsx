import { AppShell } from '@mantine/core';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';

export const App = () => {
  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 40 }}
      navbar={{ width: 200, breakpoint: 'sm' }}
      aside={{ width: 200, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header><Header /></AppShell.Header>
      <AppShell.Navbar><SidebarLeft /></AppShell.Navbar>
      <AppShell.Main>Main content area</AppShell.Main>
      <AppShell.Aside><SidebarRight /></AppShell.Aside>
      <AppShell.Footer><Footer /></AppShell.Footer>
    </AppShell>
  );
};
