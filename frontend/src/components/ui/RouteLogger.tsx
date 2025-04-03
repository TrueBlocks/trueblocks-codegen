import { SetLastView } from '../../../wailsjs/go/app/App';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const RouteLogger = ({
  ready,
  lastView,
}: {
  ready: boolean;
  lastView: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (ready && location.pathname === '/' && !hasRedirected.current) {
      hasRedirected.current = true;
      void navigate(lastView, { replace: true });
    }
  }, [ready, lastView, location.pathname, navigate]);

  useEffect(() => {
    if (ready) {
      void SetLastView(location.pathname);
    }
  }, [location, ready]);

  return null;
};
