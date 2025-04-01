import { ToggleChevron } from '@components';
import { AppShell, Button, Stack } from '@mantine/core';
import { FaHome, FaInfoCircle, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { icon: FaHome, label: 'Home', to: '/' },
  { icon: FaInfoCircle, label: 'About', to: '/about' },
  { icon: FaCog, label: 'Data', to: '/data' },
];

export const MenuBar = ({
  opened,
  setOpen,
}: {
  opened: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <AppShell.Navbar
    p="md"
    style={{
      paddingTop: 0,
      paddingBottom: 0,
      // backgroundColor: 'red',
      height: 'calc(100vh - 40px)',
    }}
  >
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // borderBottom: '2px solid red',
        // backgroundColor: 'white',
      }}
    >
      <ToggleChevron
        opened={opened}
        onToggle={() => setOpen(!opened)}
        direction="left"
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        <Stack gap="sm" align="start">
          {menuItems.map(({ icon: Icon, label, to }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              variant="subtle"
              style={{
                justifyContent: opened ? 'flex-start' : 'center',
                paddingLeft: opened ? undefined : 0,
                textAlign: 'left',
              }}
            >
              {opened ? (
                <>
                  <Icon size={16} style={{ marginRight: 8 }} />
                  {label}
                </>
              ) : (
                <Icon size={16} />
              )}
            </Button>
          ))}
        </Stack>
      </div>

      <div style={{ paddingBottom: 16 }}>
        <Button
          component={NavLink}
          to="/settings"
          variant="subtle"
          style={{
            justifyContent: opened ? 'flex-start' : 'center',
            paddingLeft: opened ? undefined : 0,
            textAlign: 'left',
          }}
        >
          {opened ? (
            <>
              <FaCog size={16} style={{ marginRight: 8 }} />
              Settings
            </>
          ) : (
            <FaCog size={16} />
          )}
        </Button>
      </div>
    </div>
  </AppShell.Navbar>
);
