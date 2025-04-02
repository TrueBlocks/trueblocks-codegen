import { ToggleButton } from '@components';
import { AppShell, Stack, Text } from '@mantine/core';
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const helpFiles = import.meta.glob('../../help/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

export const HelpBar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (newVal: boolean) => void;
}) => {
  const location = useLocation();
  const [markdown, setMarkdown] = useState<string>('Loading...');

  useEffect(() => {
    const route = location.pathname.split('/')[1] || 'home';
    const headerText = `${route.charAt(0).toUpperCase() + route.slice(1)} View`;
    const helpFileName = `${route}.md`;
    const filePath = Object.keys(helpFiles).find((key) =>
      key.endsWith(`/help/${helpFileName}`),
    );

    const loadMarkdown = async () => {
      if (!filePath) {
        setMarkdown(`# ${headerText}\n\nNo help content found.`);
        return;
      }
      try {
        const content = await helpFiles[filePath]();
        setMarkdown(`# ${headerText}\n\n${content}`);
      } catch (err) {
        setMarkdown(
          `# ${headerText}\n\nError loading help content: ${String(err)}`,
        );
      }
    };

    if (collapsed) {
      setMarkdown(`# ${headerText}\n\nLoading...`);
    } else {
      void loadMarkdown();
    }
  }, [location, collapsed]);

  return (
    <AppShell.Aside p="md" style={{ transition: 'width 0.2s ease' }}>
      <ToggleButton
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        direction="right"
      />
      {collapsed ? (
        <Text
          style={{
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
            position: 'absolute',
            top: 'calc(20px + 36px)',
            left: '36px',
            transformOrigin: 'left top',
            size: 'xs',
          }}
        >
          {markdown.split('\n')[0].replace('# ', '')}
        </Text>
      ) : (
        <Stack gap="sm" style={{ overflowY: 'auto' }}>
          <Markdown>{markdown}</Markdown>
        </Stack>
      )}
    </AppShell.Aside>
  );
};
