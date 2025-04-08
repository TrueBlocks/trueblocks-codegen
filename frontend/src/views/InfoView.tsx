import { Box, Stack } from '@mantine/core';
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import { GetMarkdown } from 'wailsjs/go/app/App';

export const InfoView = ({ title }: { title: string }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const content = await GetMarkdown('views', title);
        setMarkdownContent(content);
      } catch (rawErr) {
        const errMsg =
          rawErr instanceof Error ? rawErr.message : String(rawErr);
        setMarkdownContent(`Error loading content: ${errMsg}`);
      }
    };
    void fetchMarkdown();
  }, [title]);

  return (
    <Box style={{ backgroundColor: 'cyan', minHeight: '100%' }}>
      <Stack style={{ color: 'black', padding: '16px' }}>
        <Markdown>{markdownContent}</Markdown>
      </Stack>
    </Box>
  );
};
