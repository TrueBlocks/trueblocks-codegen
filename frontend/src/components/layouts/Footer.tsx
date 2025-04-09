import { useEffect, useState } from 'react';

import { getBarWidth } from '@components';
import { AppShell, Flex, Text } from '@mantine/core';
import { app } from 'wailsjs/go/models';
import { EventsOn } from 'wailsjs/runtime/runtime';

import { GetFilename, GetPreference } from '../../../wailsjs/go/app/App';
import { Socials } from '../ui/Socials';

export const Footer = ({ collapsed }: { collapsed: boolean }) => {
  var [org, setOrg] = useState<string>('TrueBlocks, LLC');

  useEffect(() => {
    const fetchOrgName = async () => {
      setOrg(await GetPreference('org.developer_name'));
    };
    fetchOrgName();
  }, []);

  return (
    <AppShell.Footer ml={getBarWidth(collapsed, 1) - 1}>
      <Flex h="100%" px="md" align="center" justify="space-between">
        <FilePanel />
        <Text size="sm">{org} © 2025</Text>
        <Socials />
      </Flex>
    </AppShell.Footer>
  );
};

export const FilePanel = () => {
  const [status, setStatus] = useState<app.FileStatus>({
    name: '',
    dirty: false,
  });

  useEffect(() => {
    const fetchFilename = async () => {
      setStatus(await GetFilename());
    };
    fetchFilename();
  }, []);

  useEffect(() => {
    const unsubscribe = EventsOn('file:status', (msg) => {
      const newStatus = {
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
    <>
      <Text>{status.name}</Text>
      {status.dirty && <Text>(Modified)</Text>}
    </>
  );
};
