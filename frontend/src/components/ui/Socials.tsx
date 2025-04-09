import { ActionIcon, Flex } from '@mantine/core';
import { FaEnvelope, FaGithub, FaGlobe, FaTwitter } from 'react-icons/fa';

import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime';

export const Socials = () => {
  const handleClick = (url: string) => {
    BrowserOpenURL(url);
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@trueblocks.io';
  };

  return (
    <Flex gap="sm" align="center">
      <ActionIcon
        variant="subtle"
        size="sm"
        color="blue"
        onClick={() => handleClick('https://trueblocks.io')}
      >
        <FaGlobe />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        size="sm"
        color="blue"
        onClick={() =>
          handleClick('https://github.com/TrueBlocks/trueblocks-core')
        }
      >
        <FaGithub />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        size="sm"
        color="blue"
        onClick={() => handleClick('https://x.com/trueblocks')}
      >
        <FaTwitter />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        size="sm"
        color="blue"
        onClick={handleEmailClick}
      >
        <FaEnvelope />
      </ActionIcon>
    </Flex>
  );
};
