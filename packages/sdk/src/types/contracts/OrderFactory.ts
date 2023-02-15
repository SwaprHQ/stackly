/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface OrderFactoryInterface extends utils.Interface {
  functions: {
    "createOrderWithNonce(address,bytes,uint256)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "createOrderWithNonce"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createOrderWithNonce",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "createOrderWithNonce",
    data: BytesLike
  ): Result;

  events: {
    "OrderCreated(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OrderCreated"): EventFragment;
}

export interface OrderCreatedEventObject {
  order: string;
}
export type OrderCreatedEvent = TypedEvent<[string], OrderCreatedEventObject>;

export type OrderCreatedEventFilter = TypedEventFilter<OrderCreatedEvent>;

export interface OrderFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OrderFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    createOrderWithNonce(
      _singleton: PromiseOrValue<string>,
      initializer: PromiseOrValue<BytesLike>,
      saltNonce: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createOrderWithNonce(
    _singleton: PromiseOrValue<string>,
    initializer: PromiseOrValue<BytesLike>,
    saltNonce: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createOrderWithNonce(
      _singleton: PromiseOrValue<string>,
      initializer: PromiseOrValue<BytesLike>,
      saltNonce: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "OrderCreated(address)"(
      order?: PromiseOrValue<string> | null
    ): OrderCreatedEventFilter;
    OrderCreated(
      order?: PromiseOrValue<string> | null
    ): OrderCreatedEventFilter;
  };

  estimateGas: {
    createOrderWithNonce(
      _singleton: PromiseOrValue<string>,
      initializer: PromiseOrValue<BytesLike>,
      saltNonce: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createOrderWithNonce(
      _singleton: PromiseOrValue<string>,
      initializer: PromiseOrValue<BytesLike>,
      saltNonce: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}