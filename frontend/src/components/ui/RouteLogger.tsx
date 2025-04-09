import { useEffect, useRef } from 'react';

import { useLocation } from 'wouter';

import { SetLastView } from '../../../wailsjs/go/app/App';

export const RouteLogger = ({
  ready,
  lastView,
}: {
  ready: boolean;
  lastView: string;
}) => {
  const [location, navigate] = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (ready && location === '/' && !hasRedirected.current) {
      hasRedirected.current = true;
      void navigate(lastView, { replace: true });
    }
  }, [ready, lastView, location, navigate]);

  useEffect(() => {
    if (ready) {
      void SetLastView(location);
    }
  }, [location, ready]);

  return null;
};
