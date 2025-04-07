import { GetFilename, GetPreference } from '../../../wailsjs/go/app/App';
import { Socials } from '../ui/Socials';
import { getBarWidth } from '@components';
import { AppShell, Flex, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { EventsOn } from 'wailsjs/runtime/runtime';

interface FileStatus {
  name: string;
  dirty: boolean;
}

export const Footer = ({ collapsed }: { collapsed: boolean }) => {
  var [org, setOrg] = useState<string>('TrueBlocks, LLC');

  useEffect(() => {
    const fetchOrgName = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setOrg((await GetPreference('org.developer_name')) as string);
    };
    void fetchOrgName();
  }, []);

  return (
    <AppShell.Footer ml={getBarWidth(collapsed, 1) - 1}>
      <Flex h="100%" px="md" align="center" justify="space-between">
        <Text size="sm">
          <FilePanel />
        </Text>
        <Text size="sm">{org} © 2025</Text>
        <Socials />
      </Flex>
    </AppShell.Footer>
  );
};

export const FilePanel = () => {
  const [status, setStatus] = useState<FileStatus>({ name: '', dirty: false });

  useEffect(() => {
    const fetchFilename = async () => {
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
