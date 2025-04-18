import { WizardState, WizardUIState } from '..';

export const useWizardNavigation = (
  state: WizardState,
  updateUI: (ui: Partial<WizardUIState>) => void,
) => {
  const { activeStep } = state.ui;
  const { missingNameEmail, rpcUnavailable } = state.api;

  const goToStep = (step: number) => {
    updateUI({ activeStep: step });
  };

  const goToNextStep = () => {
    updateUI({ activeStep: activeStep + 1 });
  };

  const goToPreviousStep = () => {
    if (activeStep > 0) {
      updateUI({ activeStep: activeStep - 1 });
    }
  };

  const backToUserInfo = () => {
    if (missingNameEmail) {
      goToStep(0);
    } else {
      goToStep(0);
    }
  };

  const backToRpc = () => {
    if (missingNameEmail) {
      goToStep(0);
    } else if (rpcUnavailable) {
      goToStep(1);
    } else {
      goToStep(1);
    }
  };

  return {
    goToStep,
    goToNextStep,
    goToPreviousStep,
    backToUserInfo,
    backToRpc,
  };
};
