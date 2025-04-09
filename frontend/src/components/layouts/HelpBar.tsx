import { useEffect, useState } from 'react';

import { ToggleButton } from '@components';
import { AppShell, Stack, Text } from '@mantine/core';
import Markdown from 'markdown-to-jsx';
import { GetMarkdown } from 'wailsjs/go/app/App';
import { useLocation } from 'wouter';

export const HelpBar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (newVal: boolean) => void;
}) => {
  const [location] = useLocation();
  const [markdown, setMarkdown] = useState<string>('Loading...');

  useEffect(() => {
    const route = location.split('/')[1] || 'home';
    const headerText = `${route.charAt(0).toUpperCase() + route.slice(1)} View`;
    const fetchMarkdown = async () => {
      try {
        const content = await GetMarkdown('help', route);
        setMarkdown(`# ${headerText}\n\n${content}`);
      } catch (rawErr) {
        const errMsg =
          rawErr instanceof Error ? rawErr.message : String(rawErr);
        setMarkdown(`# ${headerText}\n\nError loading help content: ${errMsg}`);
      }
    };

    if (collapsed) {
      setMarkdown(`# ${headerText}\n\nLoading...`);
    } else {
      void fetchMarkdown();
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
          {markdown.split('\n')[0]?.replace('# ', '')}
        </Text>
      ) : (
        <Stack gap="sm" style={{ overflowY: 'auto' }}>
          <Markdown>{markdown}</Markdown>
        </Stack>
      )}
    </AppShell.Aside>
  );
};
