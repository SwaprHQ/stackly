import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { WalletProvider } from './wallet';
import IndexPage from './pages';
import OrdersPage from './pages/orders';
import { Provider as StateProvider } from 'react-redux';
import { ModalProvider } from './modal/ModalProvider';
import { UserUpdater } from './state/user/updater';
import { ListsUpdater } from './state/lists/updater';
import { MulticallUpdater } from './state/multicall/updater';
import store from './state';

const router = createHashRouter([
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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <MulticallUpdater />
    </>
  );
}

root.render(
  <React.StrictMode>
    <StateProvider store={store}>
      <WalletProvider>
        <ModalProvider>
          <Updaters />
          <RouterProvider router={router} />
        </ModalProvider>
      </WalletProvider>
    </StateProvider>
  </React.StrictMode>
);
