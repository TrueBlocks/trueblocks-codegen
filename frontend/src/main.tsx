import { StrictMode } from 'react';

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import ReactDOM from 'react-dom/client';

import { App } from './App';

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Roman',
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);
