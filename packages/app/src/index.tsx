import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { WalletProvider } from './wallet';
import IndexPage from './pages';
import OrdersPage from './pages/orders';
import MintPage from './pages/mint';
import { Provider as StateProvider } from 'react-redux';
import { ModalProvider } from './modal/ModalProvider';
import { UserUpdater } from './state/user/updater';
import { ListsUpdater } from './state/lists/updater';
import { MulticallUpdater } from './state/multicall/updater';
import store from './state';
import { AnalyticsProvider } from './analytics';
import Feedback from 'feeder-react-feedback';
import 'feeder-react-feedback/dist/feeder-react-feedback.css';

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
  {
    path: '/mint',
    element: <MintPage />,
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

const feedbackProps = {
  projectId: process.env.REACT_APP_FEEDER_API_KEY || '648c61a821f83b000282cdf6',
  email: true,
  projectName: 'Stackly',
};

root.render(
  <React.StrictMode>
    <AnalyticsProvider>
      <StateProvider store={store}>
        <WalletProvider>
          <ModalProvider>
            <Updaters />
            <Feedback {...feedbackProps} />
            <RouterProvider router={router} />
          </ModalProvider>
        </WalletProvider>
      </StateProvider>
    </AnalyticsProvider>
  </React.StrictMode>
);
