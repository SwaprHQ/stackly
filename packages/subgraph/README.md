# Stackly Subgraphs

## Description

Stackly is a simple DCA (Dollar-Cost Averaging) tool that utilizes the CoW (Conditional Order
Workflow) Protocol to place TWAP (Time-Weighted Average Price) orders. It allows users to stack
their favorite cryptocurrencies at any frequency they choose, such as hourly, daily, weekly, or
monthly. By following a DCA strategy, users can reduce their exposure to short-term price
fluctuations and potentially build a more stable and profitable long-term portfolio.

## Getting Started

You will need a The Graph Access Token. You need a The Graph Hosted Service account, in your
dashboard you'll find this access token.

First, run the following code and it will prompt you to enter the access token

```bash
npx graph auth https://api.thegraph.com/deploy/
```

Then, you'll need to generate the Subgraph code

```bash
npx graph codegen
```

Last, now you can build the project

```bash
npx graph build
```

## Deployment

You need to deploy your changes to an existing subgraph:

- Go to your Hosted Service account
- Create a new subgraph
- Take the account and subgraph names in the following format `yourAccount/yourSubgraph`
- Run the following command

```
npx graph deploy --node https://api.thegraph.com/deploy/ yourAccount/yourSubgraph
```

After running this command successfully, you can go to your Hosted Service account and check the
syncing progress for your newly deployed subgraph.

**NOTE:** Sync progress will never be 100% as new blocks are constantly created and your subgraph
will keep on syncing.
