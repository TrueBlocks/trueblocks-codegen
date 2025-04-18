import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { GetUserPreferences, SetUserPreferences } from '@app';
import { Form, FormField } from '@components';
import { ActionIcon, Card, Group, Tabs, Text } from '@mantine/core';
import { types } from '@models';
import { EventsEmit } from '@runtime';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { WizardStepProps } from '.';

export const StepChainInfo = ({
  state,
  onSubmit,
  onBack,
  updateData,
  validateRpc,
  onCancel,
}: WizardStepProps) => {
  const { rpcUrl, chainName, chainId, symbol, remoteExplorer } = state.data;
  const { rpcError, chainError } = state.validation;

  const [chains, setChains] = useState<types.Chain[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('new');
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
  }, [activeTab]);

  const updateFormWithChain = useCallback(
    (chain: types.Chain) => {
      if (!updateData) return;

      updateData({
        chainName: chain.chain,
        chainId: chain.chainId.toString(),
        symbol: chain.symbol,
        remoteExplorer: chain.remoteExplorer,
        rpcUrl:
          chain.rpcProviders && chain.rpcProviders.length > 0
            ? chain.rpcProviders[0]
            : '',
      });
    },
    [updateData],
  );

  const clearForm = useCallback(() => {
    if (!updateData) return;

    updateData({
      chainName: '',
      chainId: '',
      symbol: '',
      remoteExplorer: '',
      rpcUrl: '',
    });
  }, [updateData]);

  useEffect(() => {
    const loadChains = async () => {
      try {
        const userPrefs = await GetUserPreferences();
        if (userPrefs.chains && userPrefs.chains.length > 0) {
          setChains(userPrefs.chains);
          setActiveTab('0');
          if (userPrefs.chains[0]) {
            updateFormWithChain(userPrefs.chains[0]);
          }
        } else {
          setActiveTab('new');
          clearForm();
        }
      } catch (error) {
        EventsEmit('statusbar:log', `Error trying to load chains: ${error}`);
      }
    };

    loadChains();
  }, [clearForm, updateFormWithChain]);

  const handleTabChange = (value: string | null) => {
    if (!value) {
      clearForm();
      setActiveTab('new');
      return;
    }

    if (value === 'new') {
      clearForm();
      setActiveTab('new');
    } else {
      const index = parseInt(value, 10);
      if (!isNaN(index) && index >= 0 && index < chains.length) {
        const chain = chains[index];
        if (chain) {
          updateFormWithChain(chain);
          setActiveTab(value);
        }
      }
    }
  };

  const handleRemoveChain = async (index: number, e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const updatedChains = [...chains];
      updatedChains.splice(index, 1);

      const userPrefs = await GetUserPreferences();
      userPrefs.chains = updatedChains;
      await SetUserPreferences(userPrefs);

      setChains(updatedChains);

      if (updatedChains.length === 0) {
        clearForm();
        setActiveTab('new');
      } else {
        if (activeTab !== null && parseInt(activeTab, 10) === index) {
          setActiveTab('0');
          if (updatedChains[0]) {
            updateFormWithChain(updatedChains[0]);
          }
        } else if (activeTab !== null && activeTab !== 'new') {
          const currentIndex = parseInt(activeTab, 10);
          if (currentIndex > index) {
            const newIndex = (currentIndex - 1).toString();
            setActiveTab(newIndex);
          }
        }
      }

      EventsEmit('statusbar:log', 'Chain removed successfully');
    } catch (error) {
      EventsEmit('statusbar:log', `Error removing chain: ${error}`);
    }
  };

  const saveChain = async () => {
    if (!chainName || !chainId || !symbol || !remoteExplorer || !rpcUrl) {
      EventsEmit('statusbar:log', 'Please fill all fields');
      return false;
    }

    try {
      const chainIdNum = parseInt(chainId, 10);
      if (isNaN(chainIdNum)) {
        EventsEmit('statusbar:log', 'Chain ID must be a number');
        return false;
      }

      const newChain: types.Chain = {
        chain: chainName,
        chainId: chainIdNum,
        symbol: symbol,
        remoteExplorer: remoteExplorer,
        rpcProviders: [rpcUrl],
      };

      let updatedChains: types.Chain[];

      if (activeTab === 'new') {
        updatedChains = [...chains, newChain];
        setActiveTab((updatedChains.length - 1).toString());
      } else if (activeTab !== null) {
        updatedChains = [...chains];
        const index = parseInt(activeTab, 10);
        if (!isNaN(index) && index >= 0 && index < updatedChains.length) {
          updatedChains[index] = newChain;
        } else {
          return false;
        }
      } else {
        return false;
      }

      const userPrefs = await GetUserPreferences();
      userPrefs.chains = updatedChains;
      await SetUserPreferences(userPrefs);

      setChains(updatedChains);

      EventsEmit(
        'statusbar:log',
        `Chain ${activeTab === 'new' ? 'added' : 'updated'} successfully`,
      );
      return true;
    } catch (error) {
      EventsEmit('statusbar:log', `Error saving chain: ${error}`);
      return false;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await saveChain();
    if (saved && validateRpc && validateRpc()) {
      onSubmit(e);
    }
  };

  const formFields: FormField[] = [
    {
      name: 'rpcUrl',
      value: rpcUrl || '',
      label: 'RPC URL',
      placeholder: 'Enter your RPC endpoint',
      required: true,
      error: rpcError || '',
      onChange: (e) => updateData?.({ rpcUrl: e.target.value }),
      onBlur: validateRpc,
    },
    {
      name: 'chainName',
      value: chainName || '',
      label: 'Chain Name',
      placeholder: 'e.g. mainnet, gnosis',
      required: true,
      error: chainError || '',
      onChange: (e) => updateData?.({ chainName: e.target.value }),
    },
    {
      name: 'chainId',
      value: chainId || '',
      label: 'Chain ID',
      placeholder: 'e.g. 1, 100',
      required: true,
      onChange: (e) => updateData?.({ chainId: e.target.value }),
    },
    {
      name: 'symbol',
      value: symbol || '',
      label: 'Token Symbol',
      placeholder: 'e.g. ETH, GNO',
      required: true,
      onChange: (e) => updateData?.({ symbol: e.target.value }),
    },
    {
      name: 'remoteExplorer',
      value: remoteExplorer || '',
      label: 'Block Explorer URL',
      placeholder: 'e.g. https://etherscan.io',
      required: true,
      onChange: (e) => updateData?.({ remoteExplorer: e.target.value }),
    },
  ];

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Chain Configuration
        </Text>
      </Group>

      <Card p="md" withBorder>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            {chains.map((chain, index) => (
              <Tabs.Tab
                key={index}
                value={index.toString()}
                rightSection={
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="xs"
                    onClick={(e) => handleRemoveChain(index, e)}
                    tabIndex={0}
                  >
                    <FaTrash size={12} />
                  </ActionIcon>
                }
              >
                {chain.chain}
              </Tabs.Tab>
            ))}
            <Tabs.Tab value="new" rightSection={<FaPlus size={12} />}>
              Add Chain
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab || 'new'} pt="xs">
            <Form
              initMode="wizard"
              title=""
              description=""
              fields={formFields}
              onBack={onBack}
              onSubmit={handleFormSubmit}
              onCancel={onCancel}
              submitText="Next"
            />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </>
  );
};
