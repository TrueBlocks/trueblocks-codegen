import { ToggleChevron } from '@components';
import { AppShell, Stack } from '@mantine/core';
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const helpFiles = import.meta.glob('../../help/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

export const HelpBar = ({
  opened,
  setOpen,
}: {
  opened: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const location = useLocation();
  const [markdown, setMarkdown] = useState<string>('Loading...');

  useEffect(() => {
    const route = location.pathname.split('/')[1] || 'home';
    const helpFileName = `${route}.md`;
    const filePath = Object.keys(helpFiles).find((key) =>
      key.endsWith(`/help/${helpFileName}`),
    );

    const loadMarkdown = async () => {
      if (!filePath) {
        setMarkdown('No help content found.');
        return;
      }
      try {
        const content = await helpFiles[filePath]();
        setMarkdown(content);
      } catch (err) {
        setMarkdown(`Error loading help content: ${String(err)}`);
      }
    };

    if (opened) {
      void loadMarkdown();
    }
  }, [location, opened]);

  return (
    <AppShell.Aside p="md">
      <ToggleChevron
        opened={opened}
        onToggle={() => setOpen(!opened)}
        direction="right"
      />
      {opened && (
        <Stack gap="sm" style={{ overflowY: 'auto' }}>
          <Markdown>{markdown}</Markdown>
        </Stack>
      )}
    </AppShell.Aside>
  );
};
