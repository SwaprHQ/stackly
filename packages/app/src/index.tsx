import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { wagmiClient } from './provider/wagmi';
import { IndexPage } from './pages';
import { VaultsPage } from './pages/vaults';
import { ModalProvider } from './context/Modal';
import { WalletModal } from './components/Modal/Wallet';
import { VaultDepositModal } from './components/Modal/VaultDeposit';
import { CreateVaultStepsModal } from './components/Modal/CreateVaultSteps';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/create',
    element: <IndexPage />,
  },
  {
    path: '/vaults',
    element: <VaultsPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <ModalProvider>
        <WalletModal />
        <VaultDepositModal />
        <CreateVaultStepsModal />
        <RouterProvider router={router} />
      </ModalProvider>
    </WagmiConfig>
  </React.StrictMode>
);
