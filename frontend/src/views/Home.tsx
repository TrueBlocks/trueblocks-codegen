import React from 'react';

import { Button, Card, Container, Grid, Text, Title } from '@mantine/core';

export function Home() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Welcome to TrueBlocks
      </Title>

      <Text mb="xl">
        Your application is now set up and ready to use. You can start exploring
        Ethereum data.
      </Text>

      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Explore Blocks
            </Title>
            <Text mb="md">
              Browse and analyze Ethereum blocks and their transactions.
            </Text>
            <Button fullWidth>View Blocks</Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Transactions
            </Title>
            <Text mb="md">
              Search and view detailed transaction information.
            </Text>
            <Button fullWidth>View Transactions</Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Account Data
            </Title>
            <Text mb="md">Analyze account history and interactions.</Text>
            <Button fullWidth>View Accounts</Button>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Title order={3}>Your RPC Connection</Title>
            <Text>Currently connected to Ethereum network</Text>
          </div>
          <Button variant="outline">Reconfigure</Button>
        </div>
      </Card>
    </Container>
  );
}

export default Home;
