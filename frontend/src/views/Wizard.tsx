import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Container,
  Group,
  Loader,
  Stack,
  Stepper,
  Text,
  TextInput,
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

export const Wizard = () => {
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

  // useEffect(() => {
  //   (async () => {
  //     var msg = `Wizard step changed to: ${activeStep}`;
  //     var status = {
  //       name: msg,
  //       dirty: true,
  //     };
  //     EventsEmit('statusbar:log', status);
  //   })();
  // }, [activeStep]);

  const handleBackToUserInfo = async () => {
    setActiveStep(0);
  };

  const handleBackToRpc = async () => {
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
            <Stack>
              <Title order={3}>User Information</Title>
              <Text>Please provide your name and email address.</Text>

              <form onSubmit={handleUserInfoSubmit}>
                <Stack>
                  <TextInput
                    label="Name"
                    placeholder="Enter your name"
                    withAsterisk
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                    error={nameError}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    withAsterisk
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                    error={emailError}
                  />
                  <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={loading}>
                      Next
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="RPC Connection"
            description="Connect to Ethereum"
          >
            <Stack>
              <Title order={3}>RPC Connection</Title>
              <Text>
                Enter an Ethereum RPC endpoint to connect to the blockchain.
              </Text>

              <form onSubmit={handleRpcSubmit}>
                <Stack>
                  <Group grow style={{ position: 'relative' }}>
                    <TextInput
                      label="RPC URL"
                      placeholder="https://mainnet.infura.io/v3/YOUR_API_KEY"
                      withAsterisk
                      value={rpcUrl}
                      onChange={(e) => setRpcUrl(e.target.value)}
                      onBlur={validateRpc}
                      error={rpcError}
                    />
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
                  </Group>
                  <Text size="sm" c="dimmed">
                    Example: https://mainnet.infura.io/v3/YOUR_API_KEY
                  </Text>
                  <Group justify="flex-end" mt="md">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBackToUserInfo();
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit" loading={loading}>
                      Next
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Complete" description="Ready to start">
            <Stack>
              <Title order={3}>Setup Complete</Title>
              <Text>
                Congratulations! You have successfully configured TrueBlocks.
                You can now start using the application.
              </Text>
              <Group justify="flex-end" mt="xl">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToRpc();
                  }}
                >
                  Back
                </Button>
                <Button onClick={handleComplete}>Get Started</Button>
              </Group>
            </Stack>
          </Stepper.Step>
        </Stepper>
      </Card>
    </Container>
  );
};
