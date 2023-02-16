import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { wagmiClient } from './provider/wagmi';
import IndexPage from './pages';
import OrdersPage from './pages/orders';
import { ModalProvider } from './context/Modal';
import { WalletModal } from './components/Modal/Wallet';
import { CreateVaultStepsModal } from './components/Modal/CreateVaultSteps';
import { CancelOrderModal } from './components/Modal/CancelOrder';

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
    path: '/orders',
    element: <OrdersPage />,
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
        <CancelOrderModal />
        <CreateVaultStepsModal />
        <RouterProvider router={router} />
      </ModalProvider>
    </WagmiConfig>
  </React.StrictMode>
);
