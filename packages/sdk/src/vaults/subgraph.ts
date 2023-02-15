import { gql, GraphQLClient } from 'graphql-request';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  {
    [SubKey in K]?: Maybe<T[SubKey]>;
  };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  {
    [SubKey in K]: Maybe<T[SubKey]>;
  };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Token = {
  __typename?: 'Token';
  /**  Token address  */
  id: Scalars['ID'];
  /**  Number of decimals the token uses  */
  decimals: Scalars['Int'];
  /**  Human-readable name of the token  */
  name: Scalars['String'];
  /**  Symbol of the token  */
  symbol: Scalars['String'];
};

export type Order = {
  __typename?: 'Order';
  /**  Order address  */
  id: Scalars['ID'];
  /** Order owner */
  owner: Scalars['String'];
  sellToken: Token;
  buyToken: Token;
  /**  Principal amount of the vault  */
  principal: Scalars['Float'];
  /**  Start time of the vault  */
  startTime: Scalars['Int'];
  /**  End time of the vault  */
  endTime: Scalars['Int'];
  /**  Order creation time  */
  createdAt: Scalars['Int'];
  cancelledAt?: Maybe<Scalars['Int']>;
  orderSlots: string[];
};




const OrderFragment = gql`
  fragment OrderFragment on DCAOrder {
    id
    owner
    receiver
    principal
    sellToken {
      id
      decimals
      name
      symbol
    }
    buyToken {
      id
      decimals
      name
      symbol
    }
    createdAt
    startTime
    endTime
    orderSlots
    cancelledAt
  }
`;

const getUserOrdersQuery = gql`
  query getUserOrders($userAddress: String!) {
    orders: dcaorders(where: { owner: $userAddress }) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`;

const getOrderQuery = gql`
  query getOrder($orderAddress: ID!) {
    order: dcaorder(id: $orderAddress) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`;

/**
 * Get all orders for a user from the subgraph
 * @param client - GraphQL client
 * @param userAddress - User address
 * @returns
 */
export async function getUserOrders(
  client: GraphQLClient,
  userAddress: string
) {
  const response = await client.request<{
    orders: Order[];
  }>(getUserOrdersQuery, {
    userAddress: userAddress.toLowerCase(),
  });

  return response.orders;
}

/**
 * Get all vaults for a user from the subgraph
 * @param client - GraphQL client
 * @param orderAddress - Order proxy address
 * @returns
 */
export async function getOrder(client: GraphQLClient, orderAddress: string) {
  const response = await client.request<{
    order: Order;
  }>(getOrderQuery, {
    orderAddress: orderAddress.toLowerCase(),
  });

  return response.order;
}
