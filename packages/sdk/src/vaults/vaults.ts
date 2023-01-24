import { gql, GraphQLClient } from 'graphql-request';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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

export type Vault = {
  __typename?: 'Vault';
  /**  Vault address  */
  id: Scalars['ID'];
  /** Vault owner */
  owner: Scalars['String'];
  /** Vault token */
  token: Token;
  createdAt: Scalars['Int'];
  cancelledAt?: Maybe<Scalars['Int']>;
};

const SUBGRAPH_ENDPOINT_LIST =
  'https://api.thegraph.com/subgraphs/name/adamazad/dca-dev-gnosis';

/**
 * Get all vaults for a user from the subgraph
 * @param userAddress
 * @returns
 */
export async function getUserVaults(userAddress: string) {
  const query = gql`
    query getUserVaults($userAddress: String!) {
      vaults(where: { owner: $userAddress }) {
        id
        owner
        token {
          id
          decimals
          name
          symbol
        }
        createdAt
        cancelledAt
      }
    }
  `;

  const client = new GraphQLClient(SUBGRAPH_ENDPOINT_LIST);

  const response = await client.request<{
    vaults: Vault[];
  }>(query, {
    userAddress: userAddress.toLowerCase(),
  });

  return response.vaults;
}
