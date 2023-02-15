/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { OrderFactory, OrderFactoryInterface } from "../OrderFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "order",
        type: "address",
      },
    ],
    name: "OrderCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initializer",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "saltNonce",
        type: "uint256",
      },
    ],
    name: "createOrderWithNonce",
    outputs: [
      {
        internalType: "address",
        name: "order",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class OrderFactory__factory {
  static readonly abi = _abi;
  static createInterface(): OrderFactoryInterface {
    return new utils.Interface(_abi) as OrderFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OrderFactory {
    return new Contract(address, _abi, signerOrProvider) as OrderFactory;
  }
}