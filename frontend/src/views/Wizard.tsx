import React, { useEffect, useState } from 'react';

import { Form, FormField } from '@components';
import {
  Button,
  Card,
  Container,
  Loader,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import { useLocation } from 'wouter';

import {
  CheckRPCStatus,
  GetUserPreferences,
  GetWizardState,
  SetRPC,
  SetUserInfo,
} from '../../wailsjs/go/app/App';

export const Wizard: React.FC = () => {
  const [, navigate] = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [rpcError, setRpcError] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      setInitialLoading(true);
      try {
        const state = await GetWizardState();
        if (state.missingNameEmail) {
          setActiveStep(0);
        } else if (state.rpcUnavailable) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }

        const userPrefs = await GetUserPreferences();
        if (userPrefs) {
          if (userPrefs.name) {
            setName(userPrefs.name);
          }
          if (userPrefs.email) {
            setEmail(userPrefs.email);
          }
          if (userPrefs.rpcs && userPrefs.rpcs.length > 0) {
            setRpcUrl(userPrefs.rpcs[0] as string);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.log(errorMessage);
      } finally {
        setInitialLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleBackToUserInfo = () => {
    setActiveStep(0);
  };

  const handleBackToRpc = () => {
    setActiveStep(1);
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const validateRpc = () => {
    if (!rpcUrl.trim()) {
      setRpcError('RPC URL is required');
      return false;
    }

    if (!rpcUrl.startsWith('http://') && !rpcUrl.startsWith('https://')) {
      setRpcError('RPC URL must start with http:// or https://');
      return false;
    }

    setRpcError('');
    return true;
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameValid = validateName();
    const emailValid = validateEmail();
    if (!nameValid || !emailValid) {
      return;
    }

    setLoading(true);
    try {
      await SetUserInfo(name, email);
      setActiveStep(1);
    } catch (error) {
      console.log(error);
      setNameError('Failed to save user information');
    } finally {
      setLoading(false);
    }
  };

  const handleRpcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRpc()) {
      return;
    }

    setLoading(true);
    try {
      await SetRPC(rpcUrl);

      const status = await CheckRPCStatus();
      if (status) {
        setActiveStep(2);
      } else {
        setRpcError('Unable to connect to RPC');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(`Error setting RPC: ${errorMessage}`);
      setRpcError('Failed to set RPC');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      navigate('/');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(`Navigation error: ${errorMessage}, using fallback`);
      window.location.href = '/';
    }
  };

  // Define form fields for each step
  const userInfoFields: FormField[] = [
    {
      name: 'name',
      value: name,
      label: 'Name',
      placeholder: 'Enter your name',
      required: true,
      error: nameError,
      onChange: (e) => setName(e.target.value),
      onBlur: validateName,
    },
    {
      name: 'email',
      value: email,
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      error: emailError,
      onChange: (e) => setEmail(e.target.value),
      onBlur: validateEmail,
    },
  ];

  const rpcFields: FormField[] = [
    {
      name: 'rpcUrl',
      value: rpcUrl,
      label: 'RPC URL',
      placeholder: 'https://mainnet.infura.io/v3/YOUR_API_KEY',
      required: true,
      error: rpcError,
      onChange: (e) => setRpcUrl(e.target.value),
      onBlur: validateRpc,
      rightSection: (
        <Button
          size="xs"
          variant="subtle"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={(e) => {
            e.preventDefault();
            setRpcUrl('http://localhost:23456');
          }}
        >
          x
        </Button>
      ),
      hint: 'Example: https://mainnet.infura.io/v3/YOUR_API_KEY',
    },
  ];

  if (initialLoading) {
    return (
      <Container size="sm" mt="xl">
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack align="center">
            <Loader />
            <Text>Loading wizard...</Text>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="sm" mt="xl">
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Welcome to TrueBlocks
        </Title>
        <Text c="dimmed" mb="xl">
          Complete the following steps to get started
        </Text>

        <Stepper active={activeStep}>
          <Stepper.Step
            label="User Information"
            description="Setup your profile"
          >
            <Form
              title="User Information"
              description="Please provide your name and email address."
              fields={userInfoFields}
              onSubmit={handleUserInfoSubmit}
              loading={loading}
            />
          </Stepper.Step>

          <Stepper.Step
            label="RPC Connection"
            description="Connect to Ethereum"
          >
            <Form
              title="RPC Connection"
              description="Enter an Ethereum RPC endpoint to connect to the blockchain."
              fields={rpcFields}
              onSubmit={handleRpcSubmit}
              onBack={handleBackToUserInfo}
              loading={loading}
            />
          </Stepper.Step>

          <Stepper.Step label="Complete" description="Ready to start">
            <Form
              title="Setup Complete"
              description="Congratulations! You have successfully configured TrueBlocks. You can now start using the application."
              fields={[]}
              onSubmit={(e) => {
                e.preventDefault();
                handleComplete();
              }}
              onBack={handleBackToRpc}
              submitText="Get Started"
            />
          </Stepper.Step>
        </Stepper>
      </Card>
    </Container>
  );
};
