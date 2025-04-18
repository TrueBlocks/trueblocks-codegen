import { CollapseHelp, CollapseMenu, Logger, SetInitialized } from '@app';
import { EventsEmit } from '@runtime';
import { useHotkeys } from 'react-hotkeys-hook';
import { useLocation } from 'wouter';

import { useAppContext } from '../context/AppContext';

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
  const { currentLocation } = useAppContext();
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
          if (currentLocation === hotkey.route) {
            EventsEmit('hotkey:tab-cycle', {
              route: hotkey.route,
              key: hotkey.key,
            });
          } else {
            navigate(hotkey.route);
          }
          break;

        case 'dev':
          if (!import.meta.env.DEV) return;
          if (hotkey.action) await hotkey.action();
          navigate(hotkey.route);
          break;

        case 'toggle':
          hotkey.action();
          break;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Logger(errorMessage);

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
  const namesHotkey: NavigationHotkey = {
    type: 'navigation',
    key: 'mod+4',
    route: '/names',
    label: 'Navigate to names',
  };
  const settingsHotkey: NavigationHotkey = {
    type: 'navigation',
    key: 'mod+5',
    route: '/settings',
    label: 'Navigate to settings',
  };
  const wizardHotkey: DevHotkey = {
    type: 'dev',
    key: 'mod+shift+w',
    label: 'Entering wizard mode',
    action: async () => {
      await SetInitialized(false);
    },
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
  useHotkeys({ ...homeHotkey, key: `alt+1` }.key, (e: KeyboardEvent) =>
    handleHotkey({ ...homeHotkey, key: `alt+1` }, e),
  );
  useHotkeys(aboutHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(aboutHotkey, e),
  );
  useHotkeys({ ...aboutHotkey, key: `alt+2` }.key, (e: KeyboardEvent) =>
    handleHotkey({ ...aboutHotkey, key: `alt+2` }, e),
  );
  useHotkeys(dataHotkey.key, (e: KeyboardEvent) => handleHotkey(dataHotkey, e));
  useHotkeys({ ...dataHotkey, key: `alt+3` }.key, (e: KeyboardEvent) =>
    handleHotkey({ ...dataHotkey, key: `alt+3` }, e),
  );
  useHotkeys(namesHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(namesHotkey, e),
  );
  useHotkeys({ ...namesHotkey, key: `alt+4` }.key, (e: KeyboardEvent) =>
    handleHotkey({ ...namesHotkey, key: `alt+4` }, e),
  );
  useHotkeys(settingsHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(settingsHotkey, e),
  );
  useHotkeys({ ...settingsHotkey, key: `alt+5` }.key, (e: KeyboardEvent) =>
    handleHotkey({ ...settingsHotkey, key: `alt+5` }, e),
  );
  useHotkeys(wizardHotkey.key, (e: KeyboardEvent) =>
    handleHotkey(wizardHotkey, e),
  );
  useHotkeys(
    helpToggleHotkey.key,
    (e: KeyboardEvent) => handleHotkey(helpToggleHotkey, e),
    {
      enableOnFormTags: true,
    },
  );
  useHotkeys(
    menuToggleHotkey.key,
    (e: KeyboardEvent) => handleHotkey(menuToggleHotkey, e),
    {
      enableOnFormTags: true,
    },
  );
};
