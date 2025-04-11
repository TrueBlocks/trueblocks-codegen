import { useHotkeys } from 'react-hotkeys-hook';
import { useLocation } from 'wouter';

import {
  CollapseHelp,
  CollapseMenu,
  Logger,
  SetRPC,
  SetUserInfo,
} from '../../wailsjs/go/app/App';

interface BaseHotkey {
  type: 'navigation' | 'dev' | 'toggle';
  key: string;
  label: string;
}

interface NavigationHotkey extends BaseHotkey {
  type: 'navigation';
  route: string;
}

interface DevHotkey extends BaseHotkey {
  type: 'dev';
  route: string;
  action?: () => Promise<void>;
}

interface ToggleHotkey extends BaseHotkey {
  type: 'toggle';
  action: () => void;
}

type Hotkey = NavigationHotkey | DevHotkey | ToggleHotkey;

interface UseAppHotkeysProps {
  helpCollapsed: boolean;
  collapseHelp: (value: boolean) => void;
  menuCollapsed: boolean;
  collapseMenu: (value: boolean) => void;
}

export const useAppHotkeys = ({
  helpCollapsed,
  collapseHelp,
  menuCollapsed,
  collapseMenu,
}: UseAppHotkeysProps): void => {
  const [, navigate] = useLocation();

  const handleHotkey = async (
    hotkey: Hotkey,
    e: KeyboardEvent,
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    try {
      switch (hotkey.type) {
        case 'navigation':
          await Logger(hotkey.label);
          navigate(hotkey.route);
          break;

        case 'dev':
          if (!import.meta.env.DEV) return;
          await Logger(hotkey.label);
          if (hotkey.action) await hotkey.action();
          navigate(hotkey.route);
          break;

        case 'toggle':
          hotkey.action();
          await Logger(hotkey.label);
          break;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await Logger(`${hotkey.label} failed: ${errorMessage}`);

      if (
        (hotkey.type === 'navigation' || hotkey.type === 'dev') &&
        hotkey.route
      ) {
        window.location.href = hotkey.route;
      }
    }
  };

  const homeHotkey: NavigationHotkey = {
    type: 'navigation',
    key: 'mod+1',
    route: '/',
    label: 'Navigate to home',
  };
  const aboutHotkey: NavigationHotkey = {
    type: 'navigation',
    key: 'mod+2',
    route: '/about',
    label: 'Navigate to about',
  };
  const dataHotkey: NavigationHotkey = {
    type: 'navigation',
    key: 'mod+3',
    route: '/data',
    label: 'Navigate to data',
  };
  const settingsHotkey: NavigationHotkey = {
    type: 'navigation',
    key: 'mod+4',
    route: '/settings',
    label: 'Navigate to settings',
  };
  const wizardHotkey: DevHotkey = {
    type: 'dev',
    key: 'mod+shift+w',
    label: 'Entering wizard mode',
    route: '/wizard',
  };
  const missingUserHotkey: DevHotkey = {
    type: 'dev',
    key: 'mod+shift+1',
    label: 'Simulating missing user information',
    action: async () => await SetUserInfo('', ''),
    route: '/wizard',
  };
  const rpcFailureHotkey: DevHotkey = {
    type: 'dev',
    key: 'mod+shift+2',
    label: 'Simulating RPC connection failure',
    action: async () => await SetRPC('invalid-rpc-url'),
    route: '/wizard',
  };
  const helpToggleHotkey: ToggleHotkey = {
    type: 'toggle',
    key: 'mod+h',
    label: 'Toggle help panel',
    action: () => {
      const next = !helpCollapsed;
      collapseHelp(next);
      CollapseHelp(next);
    },
  };
  const menuToggleHotkey: ToggleHotkey = {
    type: 'toggle',
    key: 'mod+m',
    label: 'Toggle menu panel',
    action: () => {
      const next = !menuCollapsed;
      collapseMenu(next);
      CollapseMenu(next);
    },
  };

  useHotkeys(homeHotkey.key, (e: KeyboardEvent) => handleHotkey(homeHotkey, e));
  useHotkeys(aboutHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(aboutHotkey, e),
  );
  useHotkeys(dataHotkey.key, (e: KeyboardEvent) => handleHotkey(dataHotkey, e));
  useHotkeys(settingsHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(settingsHotkey, e),
  );
  useHotkeys(wizardHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(wizardHotkey, e),
  );
  useHotkeys(missingUserHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(missingUserHotkey, e),
  );
  useHotkeys(rpcFailureHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(rpcFailureHotkey, e),
  );
  useHotkeys(
    helpToggleHotkey.key,
    (e: KeyboardEvent) => handleHotkey(helpToggleHotkey, e),
    { enableOnFormTags: true },
  );
  useHotkeys(
    menuToggleHotkey.key,
    (e: KeyboardEvent) => handleHotkey(menuToggleHotkey, e),
    { enableOnFormTags: true },
  );
};
