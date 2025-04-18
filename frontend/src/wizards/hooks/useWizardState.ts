import { useCallback, useEffect, useState } from 'react';

import { IsInitialized, SetInitialized, SetRPC, SetUserInfo } from '@app';

import { WizardState, WizardValidationErrors } from '../WizardTypes';

export const useWizardState = () => {
  const initialState: WizardState = {
    data: {
      name: '',
      email: '',
      rpcUrl: '',
      chainName: '',
      chainId: '',
      symbol: '',
      remoteExplorer: '',
      isFirstTimeSetup: true,
    },
    validation: {
      nameError: '',
      emailError: '',
      rpcError: '',
      chainError: '',
    },
    ui: {
      activeStep: 0,
      initialLoading: true,
      loading: false,
    },
    api: {
      initialized: false,
      missingNameEmail: true,
      rpcUnavailable: true,
    },
  };

  const [state, setState] = useState<WizardState>(initialState);

  const updateData = useCallback((data: Partial<WizardState['data']>) => {
    setState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        ...data,
      },
    }));
  }, []);

  const updateValidation = useCallback(
    (validation: Partial<WizardValidationErrors>) => {
      setState((prevState) => ({
        ...prevState,
        validation: {
          ...prevState.validation,
          ...validation,
        },
      }));
    },
    [],
  );

  const updateUI = useCallback((ui: Partial<WizardState['ui']>) => {
    setState((prevState) => ({
      ...prevState,
      ui: {
        ...prevState.ui,
        ...ui,
      },
    }));
  }, []);

  const updateAPI = useCallback((api: Partial<WizardState['api']>) => {
    setState((prevState) => ({
      ...prevState,
      api: {
        ...prevState.api,
        ...api,
      },
    }));
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const initialized = await IsInitialized();
      const firstTimeSetup = !initialized;
      updateData({ isFirstTimeSetup: firstTimeSetup });
      updateAPI({ initialized });
    } catch (error) {
      console.error('Error checking initialization status:', error);
    } finally {
      updateUI({ initialLoading: false });
    }
  }, [updateData, updateAPI, updateUI]);

  const submitUserInfo = async () => {
    updateUI({ loading: true });

    try {
      await SetUserInfo(state.data.name, state.data.email);
      updateUI({ activeStep: 1, loading: false });
    } catch (error) {
      updateUI({ loading: false });
      throw error;
    }
  };

  const submitRpc = async () => {
    updateUI({ loading: true });

    try {
      await SetRPC(state.data.rpcUrl);
      updateUI({ activeStep: 2, loading: false });
    } catch (error) {
      updateValidation({ rpcError: String(error) });
      updateUI({ loading: false });
    }
  };

  const completeWizard = async () => {
    updateUI({ loading: true });

    try {
      await SetInitialized(true);
      updateUI({ loading: false });
    } catch (error) {
      updateUI({ loading: false });
      throw error;
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    state,
    updateData,
    updateValidation,
    updateUI,
    updateAPI,
    loadInitialData,
    submitUserInfo,
    submitRpc,
    completeWizard,
  };
};
