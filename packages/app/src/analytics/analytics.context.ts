import { createContext } from 'react';

import { Fathom } from './fathom.types';

export interface TrackEcoRouterVolumeUSDParams {
  protocolName: string;
  networkId: number;
  volumeUSD: string;
}

export interface IAnalyticsContext {
  fathom: Fathom;
}

export const AnalyticsContext = createContext({} as IAnalyticsContext);
