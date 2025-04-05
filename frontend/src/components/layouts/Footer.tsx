import { getBarWidth } from '@components';
import { AppShell, Flex, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GetFilename } from 'wailsjs/go/app/App';
import { EventsOn } from 'wailsjs/runtime/runtime';

interface FileStatus {
  name: string;
  dirty: boolean;
}

export const Footer = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <AppShell.Footer ml={getBarWidth(collapsed, 1) - 1}>
      <Flex h="100%" px="md" align="center" justify="space-between">
        <Text size="sm">
          <FilePanel />
        </Text>
        <Text size="sm">Footer Content © 2025</Text>
        <Text size="sm">Social</Text>
      </Flex>
    </AppShell.Footer>
  );
};

export const FilePanel = () => {
  const [status, setStatus] = useState<FileStatus>({ name: '', dirty: false });

  useEffect(() => {
    const fetchFilename = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setStatus((await GetFilename()) as FileStatus);
    };
    void fetchFilename();
  }, []);

  useEffect(() => {
    const unsubscribe = EventsOn('file:status', (msg: FileStatus) => {
      const newStatus: FileStatus = {
        name: msg.name,
        dirty: msg.dirty,
      };
      setStatus(newStatus);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <Text>{status.name}</Text>
      {status.dirty && <Text>(Modified)</Text>}
    </div>
  );
};
