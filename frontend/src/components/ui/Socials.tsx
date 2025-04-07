import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime';
import { Flex, ActionIcon } from '@mantine/core';
import { FaGlobe, FaEnvelope, FaGithub, FaTwitter } from 'react-icons/fa';

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
