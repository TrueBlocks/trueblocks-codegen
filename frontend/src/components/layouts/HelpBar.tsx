import { ToggleChevron } from '@components';
import { AppShell, Stack, Text } from '@mantine/core';
import { useLocation } from 'react-router-dom';

export const HelpBar = ({
  opened,
  setOpen,
}: {
  opened: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const location = useLocation();
  // const markdown = `I am in this **${location.pathname || '/'}**.`;

  return (
    <AppShell.Aside p="md">
      <ToggleChevron
        opened={opened}
        onToggle={() => setOpen(!opened)}
        direction="right"
      />
      {opened && (
        <Stack gap="sm" style={{ overflowY: 'auto' }}>
          <Text size="sm">
            I am in this <strong>{location.pathname}</strong>.
          </Text>
        </Stack>
      )}
    </AppShell.Aside>
  );
};
