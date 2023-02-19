import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { load, save } from 'redux-localstorage-simple';
// import { isTestEnv } from 'utils/env';

import { multicall } from '../lib/state/multicall';
import lists from './lists/reducer';
import user from './user/reducer';
// import  transactions from './transactions/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists'];

const store = configureStore({
  reducer: {
    user,
    // transactions,
    multicall: multicall.reducer,
    lists,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true })
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    // disableWarnings: isTestEnv(),
  }),
});

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
