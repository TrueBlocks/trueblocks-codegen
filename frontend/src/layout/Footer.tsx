import { useEffect, useState } from 'react';

import { GetFilename, GetOrgPreferences } from '@app';
import { Socials, getBarWidth } from '@components';
import { AppShell, Flex, Text } from '@mantine/core';
import { types } from '@models';
import { EventsOn } from '@runtime';

export const Footer = ({ collapsed }: { collapsed: boolean }) => {
  var [org, setOrg] = useState<types.OrgPreferences>({});

  useEffect(() => {
    const fetchOrgName = async () => {
      GetOrgPreferences().then((data) => {
        setOrg(data);
      });
    };
    fetchOrgName();
  }, []);

  return (
    <AppShell.Footer ml={getBarWidth(collapsed, 1) - 1}>
      <Flex h="100%" px="md" align="center" justify="space-between">
        <FilePanel />
        <Text size="sm">{org.developerName} © 2025</Text>
        <Socials />
      </Flex>
    </AppShell.Footer>
  );
};

export const FilePanel = () => {
  const [status, setStatus] = useState<types.FileStatus>({
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
