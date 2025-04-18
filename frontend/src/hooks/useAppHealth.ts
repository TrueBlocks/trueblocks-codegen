import { useEffect } from 'react';

import { useAppContext } from '../context/AppContext';
import { checkAndNavigateToWizard } from '../utils/wizardUtils';

export const useAppHealth = () => {
  const { ready, isWizard, navigate } = useAppContext();

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      checkAndNavigateToWizard(navigate, isWizard);
    }, 1500);

    return () => clearInterval(interval);
  }, [ready, isWizard, navigate]);
};
