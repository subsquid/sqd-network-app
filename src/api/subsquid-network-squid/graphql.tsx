/* eslint-disable */
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetcher } from "./fetcher";
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigInt: { input: string; output: string };
  DateTime: { input: string; output: string };
};

export type Account = {
  __typename?: "Account";
  balance: Scalars["BigInt"]["output"];
  claimableDelegationCount: Scalars["Int"]["output"];
  delegations: Array<Delegation>;
  delegations2: Array<Delegation>;
  gatewayStakes: Array<GatewayStake>;
  gateways: Array<Gateway>;
  id: Scalars["String"]["output"];
  owned: Array<Account>;
  owner?: Maybe<Account>;
  temporaryHolding?: Maybe<TemporaryHoldingData>;
  temporaryHoldings: Array<TemporaryHoldingData>;
  transfers: Array<AccountTransfer>;
  transfersFrom: Array<Transfer>;
  transfersTo: Array<Transfer>;
  type: AccountType;
  workers: Array<Worker>;
  workers2: Array<Worker>;
};

export type AccountDelegationsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationOrderByInput>>;
  where?: InputMaybe<DelegationWhereInput>;
};

export type AccountDelegations2Args = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationOrderByInput>>;
  where?: InputMaybe<DelegationWhereInput>;
};

export type AccountGatewayStakesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayStakeOrderByInput>>;
  where?: InputMaybe<GatewayStakeWhereInput>;
};

export type AccountGatewaysArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayOrderByInput>>;
  where?: InputMaybe<GatewayWhereInput>;
};

export type AccountOwnedArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountTemporaryHoldingsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TemporaryHoldingDataOrderByInput>>;
  where?: InputMaybe<TemporaryHoldingDataWhereInput>;
};

export type AccountTransfersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<AccountTransferOrderByInput>>;
  where?: InputMaybe<AccountTransferWhereInput>;
};

export type AccountTransfersFromArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};

export type AccountTransfersToArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};

export type AccountWorkersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerOrderByInput>>;
  where?: InputMaybe<WorkerWhereInput>;
};

export type AccountWorkers2Args = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerOrderByInput>>;
  where?: InputMaybe<WorkerWhereInput>;
};

export type AccountBalanceEntry = {
  __typename?: "AccountBalanceEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["BigInt"]["output"]>;
};

export type AccountBalanceTimeseries = {
  __typename?: "AccountBalanceTimeseries";
  data: Array<AccountBalanceEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type AccountEdge = {
  __typename?: "AccountEdge";
  cursor: Scalars["String"]["output"];
  node: Account;
};

export enum AccountOrderByInput {
  BalanceAsc = "balance_ASC",
  BalanceAscNullsFirst = "balance_ASC_NULLS_FIRST",
  BalanceAscNullsLast = "balance_ASC_NULLS_LAST",
  BalanceDesc = "balance_DESC",
  BalanceDescNullsFirst = "balance_DESC_NULLS_FIRST",
  BalanceDescNullsLast = "balance_DESC_NULLS_LAST",
  ClaimableDelegationCountAsc = "claimableDelegationCount_ASC",
  ClaimableDelegationCountAscNullsFirst = "claimableDelegationCount_ASC_NULLS_FIRST",
  ClaimableDelegationCountAscNullsLast = "claimableDelegationCount_ASC_NULLS_LAST",
  ClaimableDelegationCountDesc = "claimableDelegationCount_DESC",
  ClaimableDelegationCountDescNullsFirst = "claimableDelegationCount_DESC_NULLS_FIRST",
  ClaimableDelegationCountDescNullsLast = "claimableDelegationCount_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  OwnerBalanceAsc = "owner_balance_ASC",
  OwnerBalanceAscNullsFirst = "owner_balance_ASC_NULLS_FIRST",
  OwnerBalanceAscNullsLast = "owner_balance_ASC_NULLS_LAST",
  OwnerBalanceDesc = "owner_balance_DESC",
  OwnerBalanceDescNullsFirst = "owner_balance_DESC_NULLS_FIRST",
  OwnerBalanceDescNullsLast = "owner_balance_DESC_NULLS_LAST",
  OwnerClaimableDelegationCountAsc = "owner_claimableDelegationCount_ASC",
  OwnerClaimableDelegationCountAscNullsFirst = "owner_claimableDelegationCount_ASC_NULLS_FIRST",
  OwnerClaimableDelegationCountAscNullsLast = "owner_claimableDelegationCount_ASC_NULLS_LAST",
  OwnerClaimableDelegationCountDesc = "owner_claimableDelegationCount_DESC",
  OwnerClaimableDelegationCountDescNullsFirst = "owner_claimableDelegationCount_DESC_NULLS_FIRST",
  OwnerClaimableDelegationCountDescNullsLast = "owner_claimableDelegationCount_DESC_NULLS_LAST",
  OwnerIdAsc = "owner_id_ASC",
  OwnerIdAscNullsFirst = "owner_id_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "owner_id_ASC_NULLS_LAST",
  OwnerIdDesc = "owner_id_DESC",
  OwnerIdDescNullsFirst = "owner_id_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "owner_id_DESC_NULLS_LAST",
  OwnerTypeAsc = "owner_type_ASC",
  OwnerTypeAscNullsFirst = "owner_type_ASC_NULLS_FIRST",
  OwnerTypeAscNullsLast = "owner_type_ASC_NULLS_LAST",
  OwnerTypeDesc = "owner_type_DESC",
  OwnerTypeDescNullsFirst = "owner_type_DESC_NULLS_FIRST",
  OwnerTypeDescNullsLast = "owner_type_DESC_NULLS_LAST",
  TemporaryHoldingIdAsc = "temporaryHolding_id_ASC",
  TemporaryHoldingIdAscNullsFirst = "temporaryHolding_id_ASC_NULLS_FIRST",
  TemporaryHoldingIdAscNullsLast = "temporaryHolding_id_ASC_NULLS_LAST",
  TemporaryHoldingIdDesc = "temporaryHolding_id_DESC",
  TemporaryHoldingIdDescNullsFirst = "temporaryHolding_id_DESC_NULLS_FIRST",
  TemporaryHoldingIdDescNullsLast = "temporaryHolding_id_DESC_NULLS_LAST",
  TemporaryHoldingLockedAsc = "temporaryHolding_locked_ASC",
  TemporaryHoldingLockedAscNullsFirst = "temporaryHolding_locked_ASC_NULLS_FIRST",
  TemporaryHoldingLockedAscNullsLast = "temporaryHolding_locked_ASC_NULLS_LAST",
  TemporaryHoldingLockedDesc = "temporaryHolding_locked_DESC",
  TemporaryHoldingLockedDescNullsFirst = "temporaryHolding_locked_DESC_NULLS_FIRST",
  TemporaryHoldingLockedDescNullsLast = "temporaryHolding_locked_DESC_NULLS_LAST",
  TemporaryHoldingUnlockedAtAsc = "temporaryHolding_unlockedAt_ASC",
  TemporaryHoldingUnlockedAtAscNullsFirst = "temporaryHolding_unlockedAt_ASC_NULLS_FIRST",
  TemporaryHoldingUnlockedAtAscNullsLast = "temporaryHolding_unlockedAt_ASC_NULLS_LAST",
  TemporaryHoldingUnlockedAtDesc = "temporaryHolding_unlockedAt_DESC",
  TemporaryHoldingUnlockedAtDescNullsFirst = "temporaryHolding_unlockedAt_DESC_NULLS_FIRST",
  TemporaryHoldingUnlockedAtDescNullsLast = "temporaryHolding_unlockedAt_DESC_NULLS_LAST",
  TypeAsc = "type_ASC",
  TypeAscNullsFirst = "type_ASC_NULLS_FIRST",
  TypeAscNullsLast = "type_ASC_NULLS_LAST",
  TypeDesc = "type_DESC",
  TypeDescNullsFirst = "type_DESC_NULLS_FIRST",
  TypeDescNullsLast = "type_DESC_NULLS_LAST",
}

export type AccountTransfer = {
  __typename?: "AccountTransfer";
  account: Account;
  balance: Scalars["BigInt"]["output"];
  direction: TransferDirection;
  id: Scalars["String"]["output"];
  transfer: Transfer;
};

export type AccountTransferEdge = {
  __typename?: "AccountTransferEdge";
  cursor: Scalars["String"]["output"];
  node: AccountTransfer;
};

export enum AccountTransferOrderByInput {
  AccountBalanceAsc = "account_balance_ASC",
  AccountBalanceAscNullsFirst = "account_balance_ASC_NULLS_FIRST",
  AccountBalanceAscNullsLast = "account_balance_ASC_NULLS_LAST",
  AccountBalanceDesc = "account_balance_DESC",
  AccountBalanceDescNullsFirst = "account_balance_DESC_NULLS_FIRST",
  AccountBalanceDescNullsLast = "account_balance_DESC_NULLS_LAST",
  AccountClaimableDelegationCountAsc = "account_claimableDelegationCount_ASC",
  AccountClaimableDelegationCountAscNullsFirst = "account_claimableDelegationCount_ASC_NULLS_FIRST",
  AccountClaimableDelegationCountAscNullsLast = "account_claimableDelegationCount_ASC_NULLS_LAST",
  AccountClaimableDelegationCountDesc = "account_claimableDelegationCount_DESC",
  AccountClaimableDelegationCountDescNullsFirst = "account_claimableDelegationCount_DESC_NULLS_FIRST",
  AccountClaimableDelegationCountDescNullsLast = "account_claimableDelegationCount_DESC_NULLS_LAST",
  AccountIdAsc = "account_id_ASC",
  AccountIdAscNullsFirst = "account_id_ASC_NULLS_FIRST",
  AccountIdAscNullsLast = "account_id_ASC_NULLS_LAST",
  AccountIdDesc = "account_id_DESC",
  AccountIdDescNullsFirst = "account_id_DESC_NULLS_FIRST",
  AccountIdDescNullsLast = "account_id_DESC_NULLS_LAST",
  AccountTypeAsc = "account_type_ASC",
  AccountTypeAscNullsFirst = "account_type_ASC_NULLS_FIRST",
  AccountTypeAscNullsLast = "account_type_ASC_NULLS_LAST",
  AccountTypeDesc = "account_type_DESC",
  AccountTypeDescNullsFirst = "account_type_DESC_NULLS_FIRST",
  AccountTypeDescNullsLast = "account_type_DESC_NULLS_LAST",
  BalanceAsc = "balance_ASC",
  BalanceAscNullsFirst = "balance_ASC_NULLS_FIRST",
  BalanceAscNullsLast = "balance_ASC_NULLS_LAST",
  BalanceDesc = "balance_DESC",
  BalanceDescNullsFirst = "balance_DESC_NULLS_FIRST",
  BalanceDescNullsLast = "balance_DESC_NULLS_LAST",
  DirectionAsc = "direction_ASC",
  DirectionAscNullsFirst = "direction_ASC_NULLS_FIRST",
  DirectionAscNullsLast = "direction_ASC_NULLS_LAST",
  DirectionDesc = "direction_DESC",
  DirectionDescNullsFirst = "direction_DESC_NULLS_FIRST",
  DirectionDescNullsLast = "direction_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  TransferAmountAsc = "transfer_amount_ASC",
  TransferAmountAscNullsFirst = "transfer_amount_ASC_NULLS_FIRST",
  TransferAmountAscNullsLast = "transfer_amount_ASC_NULLS_LAST",
  TransferAmountDesc = "transfer_amount_DESC",
  TransferAmountDescNullsFirst = "transfer_amount_DESC_NULLS_FIRST",
  TransferAmountDescNullsLast = "transfer_amount_DESC_NULLS_LAST",
  TransferBlockNumberAsc = "transfer_blockNumber_ASC",
  TransferBlockNumberAscNullsFirst = "transfer_blockNumber_ASC_NULLS_FIRST",
  TransferBlockNumberAscNullsLast = "transfer_blockNumber_ASC_NULLS_LAST",
  TransferBlockNumberDesc = "transfer_blockNumber_DESC",
  TransferBlockNumberDescNullsFirst = "transfer_blockNumber_DESC_NULLS_FIRST",
  TransferBlockNumberDescNullsLast = "transfer_blockNumber_DESC_NULLS_LAST",
  TransferIdAsc = "transfer_id_ASC",
  TransferIdAscNullsFirst = "transfer_id_ASC_NULLS_FIRST",
  TransferIdAscNullsLast = "transfer_id_ASC_NULLS_LAST",
  TransferIdDesc = "transfer_id_DESC",
  TransferIdDescNullsFirst = "transfer_id_DESC_NULLS_FIRST",
  TransferIdDescNullsLast = "transfer_id_DESC_NULLS_LAST",
  TransferTimestampAsc = "transfer_timestamp_ASC",
  TransferTimestampAscNullsFirst = "transfer_timestamp_ASC_NULLS_FIRST",
  TransferTimestampAscNullsLast = "transfer_timestamp_ASC_NULLS_LAST",
  TransferTimestampDesc = "transfer_timestamp_DESC",
  TransferTimestampDescNullsFirst = "transfer_timestamp_DESC_NULLS_FIRST",
  TransferTimestampDescNullsLast = "transfer_timestamp_DESC_NULLS_LAST",
  TransferTxHashAsc = "transfer_txHash_ASC",
  TransferTxHashAscNullsFirst = "transfer_txHash_ASC_NULLS_FIRST",
  TransferTxHashAscNullsLast = "transfer_txHash_ASC_NULLS_LAST",
  TransferTxHashDesc = "transfer_txHash_DESC",
  TransferTxHashDescNullsFirst = "transfer_txHash_DESC_NULLS_FIRST",
  TransferTxHashDescNullsLast = "transfer_txHash_DESC_NULLS_LAST",
  TransferTypeAsc = "transfer_type_ASC",
  TransferTypeAscNullsFirst = "transfer_type_ASC_NULLS_FIRST",
  TransferTypeAscNullsLast = "transfer_type_ASC_NULLS_LAST",
  TransferTypeDesc = "transfer_type_DESC",
  TransferTypeDescNullsFirst = "transfer_type_DESC_NULLS_FIRST",
  TransferTypeDescNullsLast = "transfer_type_DESC_NULLS_LAST",
}

export type AccountTransferWhereInput = {
  AND?: InputMaybe<Array<AccountTransferWhereInput>>;
  OR?: InputMaybe<Array<AccountTransferWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  balance_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  balance_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  balance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  direction_eq?: InputMaybe<TransferDirection>;
  direction_in?: InputMaybe<Array<TransferDirection>>;
  direction_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  direction_not_eq?: InputMaybe<TransferDirection>;
  direction_not_in?: InputMaybe<Array<TransferDirection>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  transfer?: InputMaybe<TransferWhereInput>;
  transfer_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type AccountTransfersConnection = {
  __typename?: "AccountTransfersConnection";
  edges: Array<AccountTransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum AccountType {
  TemporaryHolding = "TEMPORARY_HOLDING",
  User = "USER",
  Vesting = "VESTING",
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  balance_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  balance_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  balance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimableDelegationCount_eq?: InputMaybe<Scalars["Int"]["input"]>;
  claimableDelegationCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  claimableDelegationCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  claimableDelegationCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  claimableDelegationCount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  claimableDelegationCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  claimableDelegationCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  claimableDelegationCount_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  claimableDelegationCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegations2_every?: InputMaybe<DelegationWhereInput>;
  delegations2_none?: InputMaybe<DelegationWhereInput>;
  delegations2_some?: InputMaybe<DelegationWhereInput>;
  delegations_every?: InputMaybe<DelegationWhereInput>;
  delegations_none?: InputMaybe<DelegationWhereInput>;
  delegations_some?: InputMaybe<DelegationWhereInput>;
  gatewayStakes_every?: InputMaybe<GatewayStakeWhereInput>;
  gatewayStakes_none?: InputMaybe<GatewayStakeWhereInput>;
  gatewayStakes_some?: InputMaybe<GatewayStakeWhereInput>;
  gateways_every?: InputMaybe<GatewayWhereInput>;
  gateways_none?: InputMaybe<GatewayWhereInput>;
  gateways_some?: InputMaybe<GatewayWhereInput>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  owned_every?: InputMaybe<AccountWhereInput>;
  owned_none?: InputMaybe<AccountWhereInput>;
  owned_some?: InputMaybe<AccountWhereInput>;
  owner?: InputMaybe<AccountWhereInput>;
  owner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  temporaryHolding?: InputMaybe<TemporaryHoldingDataWhereInput>;
  temporaryHolding_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  temporaryHoldings_every?: InputMaybe<TemporaryHoldingDataWhereInput>;
  temporaryHoldings_none?: InputMaybe<TemporaryHoldingDataWhereInput>;
  temporaryHoldings_some?: InputMaybe<TemporaryHoldingDataWhereInput>;
  transfersFrom_every?: InputMaybe<TransferWhereInput>;
  transfersFrom_none?: InputMaybe<TransferWhereInput>;
  transfersFrom_some?: InputMaybe<TransferWhereInput>;
  transfersTo_every?: InputMaybe<TransferWhereInput>;
  transfersTo_none?: InputMaybe<TransferWhereInput>;
  transfersTo_some?: InputMaybe<TransferWhereInput>;
  transfers_every?: InputMaybe<AccountTransferWhereInput>;
  transfers_none?: InputMaybe<AccountTransferWhereInput>;
  transfers_some?: InputMaybe<AccountTransferWhereInput>;
  type_eq?: InputMaybe<AccountType>;
  type_in?: InputMaybe<Array<AccountType>>;
  type_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  type_not_eq?: InputMaybe<AccountType>;
  type_not_in?: InputMaybe<Array<AccountType>>;
  workers2_every?: InputMaybe<WorkerWhereInput>;
  workers2_none?: InputMaybe<WorkerWhereInput>;
  workers2_some?: InputMaybe<WorkerWhereInput>;
  workers_every?: InputMaybe<WorkerWhereInput>;
  workers_none?: InputMaybe<WorkerWhereInput>;
  workers_some?: InputMaybe<WorkerWhereInput>;
};

export type AccountsConnection = {
  __typename?: "AccountsConnection";
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type ActiveWorkersEntry = {
  __typename?: "ActiveWorkersEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type ActiveWorkersTimeseries = {
  __typename?: "ActiveWorkersTimeseries";
  data: Array<ActiveWorkersEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type AprEntry = {
  __typename?: "AprEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<AprValue>;
};

export type AprSnapshot = {
  __typename?: "AprSnapshot";
  stakerApr: Scalars["Float"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  workerApr: Scalars["Float"]["output"];
};

export type AprTimeseries = {
  __typename?: "AprTimeseries";
  data: Array<AprEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type AprValue = {
  __typename?: "AprValue";
  stakerApr: Scalars["Float"]["output"];
  workerApr: Scalars["Float"]["output"];
};

export type Block = {
  __typename?: "Block";
  hash: Scalars["String"]["output"];
  height: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  l1BlockNumber: Scalars["Int"]["output"];
  timestamp: Scalars["DateTime"]["output"];
};

export type BlockEdge = {
  __typename?: "BlockEdge";
  cursor: Scalars["String"]["output"];
  node: Block;
};

export enum BlockOrderByInput {
  HashAsc = "hash_ASC",
  HashAscNullsFirst = "hash_ASC_NULLS_FIRST",
  HashAscNullsLast = "hash_ASC_NULLS_LAST",
  HashDesc = "hash_DESC",
  HashDescNullsFirst = "hash_DESC_NULLS_FIRST",
  HashDescNullsLast = "hash_DESC_NULLS_LAST",
  HeightAsc = "height_ASC",
  HeightAscNullsFirst = "height_ASC_NULLS_FIRST",
  HeightAscNullsLast = "height_ASC_NULLS_LAST",
  HeightDesc = "height_DESC",
  HeightDescNullsFirst = "height_DESC_NULLS_FIRST",
  HeightDescNullsLast = "height_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  L1BlockNumberAsc = "l1BlockNumber_ASC",
  L1BlockNumberAscNullsFirst = "l1BlockNumber_ASC_NULLS_FIRST",
  L1BlockNumberAscNullsLast = "l1BlockNumber_ASC_NULLS_LAST",
  L1BlockNumberDesc = "l1BlockNumber_DESC",
  L1BlockNumberDescNullsFirst = "l1BlockNumber_DESC_NULLS_FIRST",
  L1BlockNumberDescNullsLast = "l1BlockNumber_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
}

export type BlockWhereInput = {
  AND?: InputMaybe<Array<BlockWhereInput>>;
  OR?: InputMaybe<Array<BlockWhereInput>>;
  hash_contains?: InputMaybe<Scalars["String"]["input"]>;
  hash_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  hash_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  hash_eq?: InputMaybe<Scalars["String"]["input"]>;
  hash_gt?: InputMaybe<Scalars["String"]["input"]>;
  hash_gte?: InputMaybe<Scalars["String"]["input"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hash_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  hash_lt?: InputMaybe<Scalars["String"]["input"]>;
  hash_lte?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hash_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  hash_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  height_eq?: InputMaybe<Scalars["Int"]["input"]>;
  height_gt?: InputMaybe<Scalars["Int"]["input"]>;
  height_gte?: InputMaybe<Scalars["Int"]["input"]>;
  height_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  height_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  height_lt?: InputMaybe<Scalars["Int"]["input"]>;
  height_lte?: InputMaybe<Scalars["Int"]["input"]>;
  height_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  height_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  l1BlockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  l1BlockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  l1BlockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  l1BlockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  l1BlockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  l1BlockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  l1BlockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  l1BlockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  l1BlockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type BlocksConnection = {
  __typename?: "BlocksConnection";
  edges: Array<BlockEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Commitment = {
  __typename?: "Commitment";
  from: Scalars["DateTime"]["output"];
  fromBlock: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  recipients: Array<CommitmentRecipient>;
  to: Scalars["DateTime"]["output"];
  toBlock: Scalars["Int"]["output"];
};

export type CommitmentEdge = {
  __typename?: "CommitmentEdge";
  cursor: Scalars["String"]["output"];
  node: Commitment;
};

export enum CommitmentOrderByInput {
  FromBlockAsc = "fromBlock_ASC",
  FromBlockAscNullsFirst = "fromBlock_ASC_NULLS_FIRST",
  FromBlockAscNullsLast = "fromBlock_ASC_NULLS_LAST",
  FromBlockDesc = "fromBlock_DESC",
  FromBlockDescNullsFirst = "fromBlock_DESC_NULLS_FIRST",
  FromBlockDescNullsLast = "fromBlock_DESC_NULLS_LAST",
  FromAsc = "from_ASC",
  FromAscNullsFirst = "from_ASC_NULLS_FIRST",
  FromAscNullsLast = "from_ASC_NULLS_LAST",
  FromDesc = "from_DESC",
  FromDescNullsFirst = "from_DESC_NULLS_FIRST",
  FromDescNullsLast = "from_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  ToBlockAsc = "toBlock_ASC",
  ToBlockAscNullsFirst = "toBlock_ASC_NULLS_FIRST",
  ToBlockAscNullsLast = "toBlock_ASC_NULLS_LAST",
  ToBlockDesc = "toBlock_DESC",
  ToBlockDescNullsFirst = "toBlock_DESC_NULLS_FIRST",
  ToBlockDescNullsLast = "toBlock_DESC_NULLS_LAST",
  ToAsc = "to_ASC",
  ToAscNullsFirst = "to_ASC_NULLS_FIRST",
  ToAscNullsLast = "to_ASC_NULLS_LAST",
  ToDesc = "to_DESC",
  ToDescNullsFirst = "to_DESC_NULLS_FIRST",
  ToDescNullsLast = "to_DESC_NULLS_LAST",
}

export type CommitmentRecipient = {
  __typename?: "CommitmentRecipient";
  stakerApr: Scalars["Float"]["output"];
  stakerReward: Scalars["BigInt"]["output"];
  workerApr: Scalars["Float"]["output"];
  workerId: Scalars["String"]["output"];
  workerReward: Scalars["BigInt"]["output"];
};

export type CommitmentWhereInput = {
  AND?: InputMaybe<Array<CommitmentWhereInput>>;
  OR?: InputMaybe<Array<CommitmentWhereInput>>;
  fromBlock_eq?: InputMaybe<Scalars["Int"]["input"]>;
  fromBlock_gt?: InputMaybe<Scalars["Int"]["input"]>;
  fromBlock_gte?: InputMaybe<Scalars["Int"]["input"]>;
  fromBlock_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  fromBlock_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  fromBlock_lt?: InputMaybe<Scalars["Int"]["input"]>;
  fromBlock_lte?: InputMaybe<Scalars["Int"]["input"]>;
  fromBlock_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  fromBlock_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  from_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  from_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  from_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  from_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  from_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  from_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  from_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  recipients_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  toBlock_eq?: InputMaybe<Scalars["Int"]["input"]>;
  toBlock_gt?: InputMaybe<Scalars["Int"]["input"]>;
  toBlock_gte?: InputMaybe<Scalars["Int"]["input"]>;
  toBlock_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  toBlock_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  toBlock_lt?: InputMaybe<Scalars["Int"]["input"]>;
  toBlock_lte?: InputMaybe<Scalars["Int"]["input"]>;
  toBlock_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  toBlock_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  to_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  to_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  to_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  to_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  to_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  to_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  to_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  to_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  to_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type CommitmentsConnection = {
  __typename?: "CommitmentsConnection";
  edges: Array<CommitmentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Contracts = {
  __typename?: "Contracts";
  distributedRewardsDistribution?: Maybe<Scalars["String"]["output"]>;
  gatewayRegistry?: Maybe<Scalars["String"]["output"]>;
  networkController?: Maybe<Scalars["String"]["output"]>;
  rewardCalculation?: Maybe<Scalars["String"]["output"]>;
  rewardTreasury?: Maybe<Scalars["String"]["output"]>;
  router?: Maybe<Scalars["String"]["output"]>;
  softCap?: Maybe<Scalars["String"]["output"]>;
  staking?: Maybe<Scalars["String"]["output"]>;
  temporaryHoldingFactory?: Maybe<Scalars["String"]["output"]>;
  vestingFactory?: Maybe<Scalars["String"]["output"]>;
  workerRegistration?: Maybe<Scalars["String"]["output"]>;
};

export type ContractsWhereInput = {
  distributedRewardsDistribution_contains?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_endsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_eq?: InputMaybe<Scalars["String"]["input"]>;
  distributedRewardsDistribution_gt?: InputMaybe<Scalars["String"]["input"]>;
  distributedRewardsDistribution_gte?: InputMaybe<Scalars["String"]["input"]>;
  distributedRewardsDistribution_in?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  distributedRewardsDistribution_isNull?: InputMaybe<
    Scalars["Boolean"]["input"]
  >;
  distributedRewardsDistribution_lt?: InputMaybe<Scalars["String"]["input"]>;
  distributedRewardsDistribution_lte?: InputMaybe<Scalars["String"]["input"]>;
  distributedRewardsDistribution_not_contains?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_not_endsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_not_eq?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_not_in?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  distributedRewardsDistribution_not_startsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  distributedRewardsDistribution_startsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  gatewayRegistry_contains?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_eq?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_gt?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_gte?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gatewayRegistry_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  gatewayRegistry_lt?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_lte?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  gatewayRegistry_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gatewayRegistry_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayRegistry_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  networkController_contains?: InputMaybe<Scalars["String"]["input"]>;
  networkController_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  networkController_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  networkController_eq?: InputMaybe<Scalars["String"]["input"]>;
  networkController_gt?: InputMaybe<Scalars["String"]["input"]>;
  networkController_gte?: InputMaybe<Scalars["String"]["input"]>;
  networkController_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  networkController_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  networkController_lt?: InputMaybe<Scalars["String"]["input"]>;
  networkController_lte?: InputMaybe<Scalars["String"]["input"]>;
  networkController_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  networkController_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  networkController_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  networkController_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  networkController_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  networkController_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  networkController_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  rewardCalculation_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_eq?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_gt?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_gte?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardCalculation_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewardCalculation_lt?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_lte?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  rewardCalculation_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardCalculation_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardCalculation_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_eq?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_gt?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_gte?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardTreasury_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewardTreasury_lt?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_lte?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  rewardTreasury_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardTreasury_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardTreasury_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  router_contains?: InputMaybe<Scalars["String"]["input"]>;
  router_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  router_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  router_eq?: InputMaybe<Scalars["String"]["input"]>;
  router_gt?: InputMaybe<Scalars["String"]["input"]>;
  router_gte?: InputMaybe<Scalars["String"]["input"]>;
  router_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  router_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  router_lt?: InputMaybe<Scalars["String"]["input"]>;
  router_lte?: InputMaybe<Scalars["String"]["input"]>;
  router_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  router_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  router_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  router_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  router_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  router_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  router_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  softCap_contains?: InputMaybe<Scalars["String"]["input"]>;
  softCap_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  softCap_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  softCap_eq?: InputMaybe<Scalars["String"]["input"]>;
  softCap_gt?: InputMaybe<Scalars["String"]["input"]>;
  softCap_gte?: InputMaybe<Scalars["String"]["input"]>;
  softCap_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  softCap_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  softCap_lt?: InputMaybe<Scalars["String"]["input"]>;
  softCap_lte?: InputMaybe<Scalars["String"]["input"]>;
  softCap_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  softCap_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  softCap_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  softCap_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  softCap_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  softCap_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  softCap_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  staking_contains?: InputMaybe<Scalars["String"]["input"]>;
  staking_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  staking_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  staking_eq?: InputMaybe<Scalars["String"]["input"]>;
  staking_gt?: InputMaybe<Scalars["String"]["input"]>;
  staking_gte?: InputMaybe<Scalars["String"]["input"]>;
  staking_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  staking_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  staking_lt?: InputMaybe<Scalars["String"]["input"]>;
  staking_lte?: InputMaybe<Scalars["String"]["input"]>;
  staking_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  staking_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  staking_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  staking_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  staking_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  staking_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  staking_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  temporaryHoldingFactory_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_eq?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  temporaryHoldingFactory_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  temporaryHoldingFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  temporaryHoldingFactory_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  temporaryHoldingFactory_not_in?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  temporaryHoldingFactory_not_startsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  temporaryHoldingFactory_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_eq?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  vestingFactory_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  vestingFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  vestingFactory_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  vestingFactory_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingFactory_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_contains?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  workerRegistration_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_eq?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_gt?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_gte?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  workerRegistration_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  workerRegistration_lt?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_lte?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  workerRegistration_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  workerRegistration_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerRegistration_startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type CumulativeRewardEntry = {
  __typename?: "CumulativeRewardEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<CumulativeRewardValue>;
};

export type CumulativeRewardTimeseries = {
  __typename?: "CumulativeRewardTimeseries";
  data: Array<CumulativeRewardEntry>;
  step: Scalars["Float"]["output"];
};

export type CumulativeRewardValue = {
  __typename?: "CumulativeRewardValue";
  stakerReward: Scalars["BigInt"]["output"];
  workerReward: Scalars["BigInt"]["output"];
};

export type Delegation = {
  __typename?: "Delegation";
  claimableReward: Scalars["BigInt"]["output"];
  claimedReward: Scalars["BigInt"]["output"];
  deposit: Scalars["BigInt"]["output"];
  id: Scalars["String"]["output"];
  lockEnd?: Maybe<Scalars["Int"]["output"]>;
  lockStart?: Maybe<Scalars["Int"]["output"]>;
  locked?: Maybe<Scalars["Boolean"]["output"]>;
  owner: Account;
  /** owner.owner for VESTING account */
  realOwner: Account;
  rewards: Array<DelegationReward>;
  status: DelegationStatus;
  statusHistory: Array<DelegationStatusChange>;
  worker: Worker;
};

export type DelegationRewardsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationRewardOrderByInput>>;
  where?: InputMaybe<DelegationRewardWhereInput>;
};

export type DelegationStatusHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationStatusChangeOrderByInput>>;
  where?: InputMaybe<DelegationStatusChangeWhereInput>;
};

export type DelegationEdge = {
  __typename?: "DelegationEdge";
  cursor: Scalars["String"]["output"];
  node: Delegation;
};

export enum DelegationOrderByInput {
  ClaimableRewardAsc = "claimableReward_ASC",
  ClaimableRewardAscNullsFirst = "claimableReward_ASC_NULLS_FIRST",
  ClaimableRewardAscNullsLast = "claimableReward_ASC_NULLS_LAST",
  ClaimableRewardDesc = "claimableReward_DESC",
  ClaimableRewardDescNullsFirst = "claimableReward_DESC_NULLS_FIRST",
  ClaimableRewardDescNullsLast = "claimableReward_DESC_NULLS_LAST",
  ClaimedRewardAsc = "claimedReward_ASC",
  ClaimedRewardAscNullsFirst = "claimedReward_ASC_NULLS_FIRST",
  ClaimedRewardAscNullsLast = "claimedReward_ASC_NULLS_LAST",
  ClaimedRewardDesc = "claimedReward_DESC",
  ClaimedRewardDescNullsFirst = "claimedReward_DESC_NULLS_FIRST",
  ClaimedRewardDescNullsLast = "claimedReward_DESC_NULLS_LAST",
  DepositAsc = "deposit_ASC",
  DepositAscNullsFirst = "deposit_ASC_NULLS_FIRST",
  DepositAscNullsLast = "deposit_ASC_NULLS_LAST",
  DepositDesc = "deposit_DESC",
  DepositDescNullsFirst = "deposit_DESC_NULLS_FIRST",
  DepositDescNullsLast = "deposit_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  LockEndAsc = "lockEnd_ASC",
  LockEndAscNullsFirst = "lockEnd_ASC_NULLS_FIRST",
  LockEndAscNullsLast = "lockEnd_ASC_NULLS_LAST",
  LockEndDesc = "lockEnd_DESC",
  LockEndDescNullsFirst = "lockEnd_DESC_NULLS_FIRST",
  LockEndDescNullsLast = "lockEnd_DESC_NULLS_LAST",
  LockStartAsc = "lockStart_ASC",
  LockStartAscNullsFirst = "lockStart_ASC_NULLS_FIRST",
  LockStartAscNullsLast = "lockStart_ASC_NULLS_LAST",
  LockStartDesc = "lockStart_DESC",
  LockStartDescNullsFirst = "lockStart_DESC_NULLS_FIRST",
  LockStartDescNullsLast = "lockStart_DESC_NULLS_LAST",
  LockedAsc = "locked_ASC",
  LockedAscNullsFirst = "locked_ASC_NULLS_FIRST",
  LockedAscNullsLast = "locked_ASC_NULLS_LAST",
  LockedDesc = "locked_DESC",
  LockedDescNullsFirst = "locked_DESC_NULLS_FIRST",
  LockedDescNullsLast = "locked_DESC_NULLS_LAST",
  OwnerBalanceAsc = "owner_balance_ASC",
  OwnerBalanceAscNullsFirst = "owner_balance_ASC_NULLS_FIRST",
  OwnerBalanceAscNullsLast = "owner_balance_ASC_NULLS_LAST",
  OwnerBalanceDesc = "owner_balance_DESC",
  OwnerBalanceDescNullsFirst = "owner_balance_DESC_NULLS_FIRST",
  OwnerBalanceDescNullsLast = "owner_balance_DESC_NULLS_LAST",
  OwnerClaimableDelegationCountAsc = "owner_claimableDelegationCount_ASC",
  OwnerClaimableDelegationCountAscNullsFirst = "owner_claimableDelegationCount_ASC_NULLS_FIRST",
  OwnerClaimableDelegationCountAscNullsLast = "owner_claimableDelegationCount_ASC_NULLS_LAST",
  OwnerClaimableDelegationCountDesc = "owner_claimableDelegationCount_DESC",
  OwnerClaimableDelegationCountDescNullsFirst = "owner_claimableDelegationCount_DESC_NULLS_FIRST",
  OwnerClaimableDelegationCountDescNullsLast = "owner_claimableDelegationCount_DESC_NULLS_LAST",
  OwnerIdAsc = "owner_id_ASC",
  OwnerIdAscNullsFirst = "owner_id_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "owner_id_ASC_NULLS_LAST",
  OwnerIdDesc = "owner_id_DESC",
  OwnerIdDescNullsFirst = "owner_id_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "owner_id_DESC_NULLS_LAST",
  OwnerTypeAsc = "owner_type_ASC",
  OwnerTypeAscNullsFirst = "owner_type_ASC_NULLS_FIRST",
  OwnerTypeAscNullsLast = "owner_type_ASC_NULLS_LAST",
  OwnerTypeDesc = "owner_type_DESC",
  OwnerTypeDescNullsFirst = "owner_type_DESC_NULLS_FIRST",
  OwnerTypeDescNullsLast = "owner_type_DESC_NULLS_LAST",
  RealOwnerBalanceAsc = "realOwner_balance_ASC",
  RealOwnerBalanceAscNullsFirst = "realOwner_balance_ASC_NULLS_FIRST",
  RealOwnerBalanceAscNullsLast = "realOwner_balance_ASC_NULLS_LAST",
  RealOwnerBalanceDesc = "realOwner_balance_DESC",
  RealOwnerBalanceDescNullsFirst = "realOwner_balance_DESC_NULLS_FIRST",
  RealOwnerBalanceDescNullsLast = "realOwner_balance_DESC_NULLS_LAST",
  RealOwnerClaimableDelegationCountAsc = "realOwner_claimableDelegationCount_ASC",
  RealOwnerClaimableDelegationCountAscNullsFirst = "realOwner_claimableDelegationCount_ASC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountAscNullsLast = "realOwner_claimableDelegationCount_ASC_NULLS_LAST",
  RealOwnerClaimableDelegationCountDesc = "realOwner_claimableDelegationCount_DESC",
  RealOwnerClaimableDelegationCountDescNullsFirst = "realOwner_claimableDelegationCount_DESC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountDescNullsLast = "realOwner_claimableDelegationCount_DESC_NULLS_LAST",
  RealOwnerIdAsc = "realOwner_id_ASC",
  RealOwnerIdAscNullsFirst = "realOwner_id_ASC_NULLS_FIRST",
  RealOwnerIdAscNullsLast = "realOwner_id_ASC_NULLS_LAST",
  RealOwnerIdDesc = "realOwner_id_DESC",
  RealOwnerIdDescNullsFirst = "realOwner_id_DESC_NULLS_FIRST",
  RealOwnerIdDescNullsLast = "realOwner_id_DESC_NULLS_LAST",
  RealOwnerTypeAsc = "realOwner_type_ASC",
  RealOwnerTypeAscNullsFirst = "realOwner_type_ASC_NULLS_FIRST",
  RealOwnerTypeAscNullsLast = "realOwner_type_ASC_NULLS_LAST",
  RealOwnerTypeDesc = "realOwner_type_DESC",
  RealOwnerTypeDescNullsFirst = "realOwner_type_DESC_NULLS_FIRST",
  RealOwnerTypeDescNullsLast = "realOwner_type_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
  WorkerAprAsc = "worker_apr_ASC",
  WorkerAprAscNullsFirst = "worker_apr_ASC_NULLS_FIRST",
  WorkerAprAscNullsLast = "worker_apr_ASC_NULLS_LAST",
  WorkerAprDesc = "worker_apr_DESC",
  WorkerAprDescNullsFirst = "worker_apr_DESC_NULLS_FIRST",
  WorkerAprDescNullsLast = "worker_apr_DESC_NULLS_LAST",
  WorkerBondAsc = "worker_bond_ASC",
  WorkerBondAscNullsFirst = "worker_bond_ASC_NULLS_FIRST",
  WorkerBondAscNullsLast = "worker_bond_ASC_NULLS_LAST",
  WorkerBondDesc = "worker_bond_DESC",
  WorkerBondDescNullsFirst = "worker_bond_DESC_NULLS_FIRST",
  WorkerBondDescNullsLast = "worker_bond_DESC_NULLS_LAST",
  WorkerCapedDelegationAsc = "worker_capedDelegation_ASC",
  WorkerCapedDelegationAscNullsFirst = "worker_capedDelegation_ASC_NULLS_FIRST",
  WorkerCapedDelegationAscNullsLast = "worker_capedDelegation_ASC_NULLS_LAST",
  WorkerCapedDelegationDesc = "worker_capedDelegation_DESC",
  WorkerCapedDelegationDescNullsFirst = "worker_capedDelegation_DESC_NULLS_FIRST",
  WorkerCapedDelegationDescNullsLast = "worker_capedDelegation_DESC_NULLS_LAST",
  WorkerClaimableRewardAsc = "worker_claimableReward_ASC",
  WorkerClaimableRewardAscNullsFirst = "worker_claimableReward_ASC_NULLS_FIRST",
  WorkerClaimableRewardAscNullsLast = "worker_claimableReward_ASC_NULLS_LAST",
  WorkerClaimableRewardDesc = "worker_claimableReward_DESC",
  WorkerClaimableRewardDescNullsFirst = "worker_claimableReward_DESC_NULLS_FIRST",
  WorkerClaimableRewardDescNullsLast = "worker_claimableReward_DESC_NULLS_LAST",
  WorkerClaimedRewardAsc = "worker_claimedReward_ASC",
  WorkerClaimedRewardAscNullsFirst = "worker_claimedReward_ASC_NULLS_FIRST",
  WorkerClaimedRewardAscNullsLast = "worker_claimedReward_ASC_NULLS_LAST",
  WorkerClaimedRewardDesc = "worker_claimedReward_DESC",
  WorkerClaimedRewardDescNullsFirst = "worker_claimedReward_DESC_NULLS_FIRST",
  WorkerClaimedRewardDescNullsLast = "worker_claimedReward_DESC_NULLS_LAST",
  WorkerCreatedAtAsc = "worker_createdAt_ASC",
  WorkerCreatedAtAscNullsFirst = "worker_createdAt_ASC_NULLS_FIRST",
  WorkerCreatedAtAscNullsLast = "worker_createdAt_ASC_NULLS_LAST",
  WorkerCreatedAtDesc = "worker_createdAt_DESC",
  WorkerCreatedAtDescNullsFirst = "worker_createdAt_DESC_NULLS_FIRST",
  WorkerCreatedAtDescNullsLast = "worker_createdAt_DESC_NULLS_LAST",
  WorkerDTenureAsc = "worker_dTenure_ASC",
  WorkerDTenureAscNullsFirst = "worker_dTenure_ASC_NULLS_FIRST",
  WorkerDTenureAscNullsLast = "worker_dTenure_ASC_NULLS_LAST",
  WorkerDTenureDesc = "worker_dTenure_DESC",
  WorkerDTenureDescNullsFirst = "worker_dTenure_DESC_NULLS_FIRST",
  WorkerDTenureDescNullsLast = "worker_dTenure_DESC_NULLS_LAST",
  WorkerDelegationCountAsc = "worker_delegationCount_ASC",
  WorkerDelegationCountAscNullsFirst = "worker_delegationCount_ASC_NULLS_FIRST",
  WorkerDelegationCountAscNullsLast = "worker_delegationCount_ASC_NULLS_LAST",
  WorkerDelegationCountDesc = "worker_delegationCount_DESC",
  WorkerDelegationCountDescNullsFirst = "worker_delegationCount_DESC_NULLS_FIRST",
  WorkerDelegationCountDescNullsLast = "worker_delegationCount_DESC_NULLS_LAST",
  WorkerDescriptionAsc = "worker_description_ASC",
  WorkerDescriptionAscNullsFirst = "worker_description_ASC_NULLS_FIRST",
  WorkerDescriptionAscNullsLast = "worker_description_ASC_NULLS_LAST",
  WorkerDescriptionDesc = "worker_description_DESC",
  WorkerDescriptionDescNullsFirst = "worker_description_DESC_NULLS_FIRST",
  WorkerDescriptionDescNullsLast = "worker_description_DESC_NULLS_LAST",
  WorkerDialOkAsc = "worker_dialOk_ASC",
  WorkerDialOkAscNullsFirst = "worker_dialOk_ASC_NULLS_FIRST",
  WorkerDialOkAscNullsLast = "worker_dialOk_ASC_NULLS_LAST",
  WorkerDialOkDesc = "worker_dialOk_DESC",
  WorkerDialOkDescNullsFirst = "worker_dialOk_DESC_NULLS_FIRST",
  WorkerDialOkDescNullsLast = "worker_dialOk_DESC_NULLS_LAST",
  WorkerEmailAsc = "worker_email_ASC",
  WorkerEmailAscNullsFirst = "worker_email_ASC_NULLS_FIRST",
  WorkerEmailAscNullsLast = "worker_email_ASC_NULLS_LAST",
  WorkerEmailDesc = "worker_email_DESC",
  WorkerEmailDescNullsFirst = "worker_email_DESC_NULLS_FIRST",
  WorkerEmailDescNullsLast = "worker_email_DESC_NULLS_LAST",
  WorkerIdAsc = "worker_id_ASC",
  WorkerIdAscNullsFirst = "worker_id_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "worker_id_ASC_NULLS_LAST",
  WorkerIdDesc = "worker_id_DESC",
  WorkerIdDescNullsFirst = "worker_id_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "worker_id_DESC_NULLS_LAST",
  WorkerJailReasonAsc = "worker_jailReason_ASC",
  WorkerJailReasonAscNullsFirst = "worker_jailReason_ASC_NULLS_FIRST",
  WorkerJailReasonAscNullsLast = "worker_jailReason_ASC_NULLS_LAST",
  WorkerJailReasonDesc = "worker_jailReason_DESC",
  WorkerJailReasonDescNullsFirst = "worker_jailReason_DESC_NULLS_FIRST",
  WorkerJailReasonDescNullsLast = "worker_jailReason_DESC_NULLS_LAST",
  WorkerJailedAsc = "worker_jailed_ASC",
  WorkerJailedAscNullsFirst = "worker_jailed_ASC_NULLS_FIRST",
  WorkerJailedAscNullsLast = "worker_jailed_ASC_NULLS_LAST",
  WorkerJailedDesc = "worker_jailed_DESC",
  WorkerJailedDescNullsFirst = "worker_jailed_DESC_NULLS_FIRST",
  WorkerJailedDescNullsLast = "worker_jailed_DESC_NULLS_LAST",
  WorkerLivenessAsc = "worker_liveness_ASC",
  WorkerLivenessAscNullsFirst = "worker_liveness_ASC_NULLS_FIRST",
  WorkerLivenessAscNullsLast = "worker_liveness_ASC_NULLS_LAST",
  WorkerLivenessDesc = "worker_liveness_DESC",
  WorkerLivenessDescNullsFirst = "worker_liveness_DESC_NULLS_FIRST",
  WorkerLivenessDescNullsLast = "worker_liveness_DESC_NULLS_LAST",
  WorkerLockEndAsc = "worker_lockEnd_ASC",
  WorkerLockEndAscNullsFirst = "worker_lockEnd_ASC_NULLS_FIRST",
  WorkerLockEndAscNullsLast = "worker_lockEnd_ASC_NULLS_LAST",
  WorkerLockEndDesc = "worker_lockEnd_DESC",
  WorkerLockEndDescNullsFirst = "worker_lockEnd_DESC_NULLS_FIRST",
  WorkerLockEndDescNullsLast = "worker_lockEnd_DESC_NULLS_LAST",
  WorkerLockStartAsc = "worker_lockStart_ASC",
  WorkerLockStartAscNullsFirst = "worker_lockStart_ASC_NULLS_FIRST",
  WorkerLockStartAscNullsLast = "worker_lockStart_ASC_NULLS_LAST",
  WorkerLockStartDesc = "worker_lockStart_DESC",
  WorkerLockStartDescNullsFirst = "worker_lockStart_DESC_NULLS_FIRST",
  WorkerLockStartDescNullsLast = "worker_lockStart_DESC_NULLS_LAST",
  WorkerLockedAsc = "worker_locked_ASC",
  WorkerLockedAscNullsFirst = "worker_locked_ASC_NULLS_FIRST",
  WorkerLockedAscNullsLast = "worker_locked_ASC_NULLS_LAST",
  WorkerLockedDesc = "worker_locked_DESC",
  WorkerLockedDescNullsFirst = "worker_locked_DESC_NULLS_FIRST",
  WorkerLockedDescNullsLast = "worker_locked_DESC_NULLS_LAST",
  WorkerNameAsc = "worker_name_ASC",
  WorkerNameAscNullsFirst = "worker_name_ASC_NULLS_FIRST",
  WorkerNameAscNullsLast = "worker_name_ASC_NULLS_LAST",
  WorkerNameDesc = "worker_name_DESC",
  WorkerNameDescNullsFirst = "worker_name_DESC_NULLS_FIRST",
  WorkerNameDescNullsLast = "worker_name_DESC_NULLS_LAST",
  WorkerOnlineAsc = "worker_online_ASC",
  WorkerOnlineAscNullsFirst = "worker_online_ASC_NULLS_FIRST",
  WorkerOnlineAscNullsLast = "worker_online_ASC_NULLS_LAST",
  WorkerOnlineDesc = "worker_online_DESC",
  WorkerOnlineDescNullsFirst = "worker_online_DESC_NULLS_FIRST",
  WorkerOnlineDescNullsLast = "worker_online_DESC_NULLS_LAST",
  WorkerPeerIdAsc = "worker_peerId_ASC",
  WorkerPeerIdAscNullsFirst = "worker_peerId_ASC_NULLS_FIRST",
  WorkerPeerIdAscNullsLast = "worker_peerId_ASC_NULLS_LAST",
  WorkerPeerIdDesc = "worker_peerId_DESC",
  WorkerPeerIdDescNullsFirst = "worker_peerId_DESC_NULLS_FIRST",
  WorkerPeerIdDescNullsLast = "worker_peerId_DESC_NULLS_LAST",
  WorkerQueries24HoursAsc = "worker_queries24Hours_ASC",
  WorkerQueries24HoursAscNullsFirst = "worker_queries24Hours_ASC_NULLS_FIRST",
  WorkerQueries24HoursAscNullsLast = "worker_queries24Hours_ASC_NULLS_LAST",
  WorkerQueries24HoursDesc = "worker_queries24Hours_DESC",
  WorkerQueries24HoursDescNullsFirst = "worker_queries24Hours_DESC_NULLS_FIRST",
  WorkerQueries24HoursDescNullsLast = "worker_queries24Hours_DESC_NULLS_LAST",
  WorkerQueries90DaysAsc = "worker_queries90Days_ASC",
  WorkerQueries90DaysAscNullsFirst = "worker_queries90Days_ASC_NULLS_FIRST",
  WorkerQueries90DaysAscNullsLast = "worker_queries90Days_ASC_NULLS_LAST",
  WorkerQueries90DaysDesc = "worker_queries90Days_DESC",
  WorkerQueries90DaysDescNullsFirst = "worker_queries90Days_DESC_NULLS_FIRST",
  WorkerQueries90DaysDescNullsLast = "worker_queries90Days_DESC_NULLS_LAST",
  WorkerScannedData24HoursAsc = "worker_scannedData24Hours_ASC",
  WorkerScannedData24HoursAscNullsFirst = "worker_scannedData24Hours_ASC_NULLS_FIRST",
  WorkerScannedData24HoursAscNullsLast = "worker_scannedData24Hours_ASC_NULLS_LAST",
  WorkerScannedData24HoursDesc = "worker_scannedData24Hours_DESC",
  WorkerScannedData24HoursDescNullsFirst = "worker_scannedData24Hours_DESC_NULLS_FIRST",
  WorkerScannedData24HoursDescNullsLast = "worker_scannedData24Hours_DESC_NULLS_LAST",
  WorkerScannedData90DaysAsc = "worker_scannedData90Days_ASC",
  WorkerScannedData90DaysAscNullsFirst = "worker_scannedData90Days_ASC_NULLS_FIRST",
  WorkerScannedData90DaysAscNullsLast = "worker_scannedData90Days_ASC_NULLS_LAST",
  WorkerScannedData90DaysDesc = "worker_scannedData90Days_DESC",
  WorkerScannedData90DaysDescNullsFirst = "worker_scannedData90Days_DESC_NULLS_FIRST",
  WorkerScannedData90DaysDescNullsLast = "worker_scannedData90Days_DESC_NULLS_LAST",
  WorkerServedData24HoursAsc = "worker_servedData24Hours_ASC",
  WorkerServedData24HoursAscNullsFirst = "worker_servedData24Hours_ASC_NULLS_FIRST",
  WorkerServedData24HoursAscNullsLast = "worker_servedData24Hours_ASC_NULLS_LAST",
  WorkerServedData24HoursDesc = "worker_servedData24Hours_DESC",
  WorkerServedData24HoursDescNullsFirst = "worker_servedData24Hours_DESC_NULLS_FIRST",
  WorkerServedData24HoursDescNullsLast = "worker_servedData24Hours_DESC_NULLS_LAST",
  WorkerServedData90DaysAsc = "worker_servedData90Days_ASC",
  WorkerServedData90DaysAscNullsFirst = "worker_servedData90Days_ASC_NULLS_FIRST",
  WorkerServedData90DaysAscNullsLast = "worker_servedData90Days_ASC_NULLS_LAST",
  WorkerServedData90DaysDesc = "worker_servedData90Days_DESC",
  WorkerServedData90DaysDescNullsFirst = "worker_servedData90Days_DESC_NULLS_FIRST",
  WorkerServedData90DaysDescNullsLast = "worker_servedData90Days_DESC_NULLS_LAST",
  WorkerStakerAprAsc = "worker_stakerApr_ASC",
  WorkerStakerAprAscNullsFirst = "worker_stakerApr_ASC_NULLS_FIRST",
  WorkerStakerAprAscNullsLast = "worker_stakerApr_ASC_NULLS_LAST",
  WorkerStakerAprDesc = "worker_stakerApr_DESC",
  WorkerStakerAprDescNullsFirst = "worker_stakerApr_DESC_NULLS_FIRST",
  WorkerStakerAprDescNullsLast = "worker_stakerApr_DESC_NULLS_LAST",
  WorkerStatusAsc = "worker_status_ASC",
  WorkerStatusAscNullsFirst = "worker_status_ASC_NULLS_FIRST",
  WorkerStatusAscNullsLast = "worker_status_ASC_NULLS_LAST",
  WorkerStatusDesc = "worker_status_DESC",
  WorkerStatusDescNullsFirst = "worker_status_DESC_NULLS_FIRST",
  WorkerStatusDescNullsLast = "worker_status_DESC_NULLS_LAST",
  WorkerStoredDataAsc = "worker_storedData_ASC",
  WorkerStoredDataAscNullsFirst = "worker_storedData_ASC_NULLS_FIRST",
  WorkerStoredDataAscNullsLast = "worker_storedData_ASC_NULLS_LAST",
  WorkerStoredDataDesc = "worker_storedData_DESC",
  WorkerStoredDataDescNullsFirst = "worker_storedData_DESC_NULLS_FIRST",
  WorkerStoredDataDescNullsLast = "worker_storedData_DESC_NULLS_LAST",
  WorkerTotalDelegationRewardsAsc = "worker_totalDelegationRewards_ASC",
  WorkerTotalDelegationRewardsAscNullsFirst = "worker_totalDelegationRewards_ASC_NULLS_FIRST",
  WorkerTotalDelegationRewardsAscNullsLast = "worker_totalDelegationRewards_ASC_NULLS_LAST",
  WorkerTotalDelegationRewardsDesc = "worker_totalDelegationRewards_DESC",
  WorkerTotalDelegationRewardsDescNullsFirst = "worker_totalDelegationRewards_DESC_NULLS_FIRST",
  WorkerTotalDelegationRewardsDescNullsLast = "worker_totalDelegationRewards_DESC_NULLS_LAST",
  WorkerTotalDelegationAsc = "worker_totalDelegation_ASC",
  WorkerTotalDelegationAscNullsFirst = "worker_totalDelegation_ASC_NULLS_FIRST",
  WorkerTotalDelegationAscNullsLast = "worker_totalDelegation_ASC_NULLS_LAST",
  WorkerTotalDelegationDesc = "worker_totalDelegation_DESC",
  WorkerTotalDelegationDescNullsFirst = "worker_totalDelegation_DESC_NULLS_FIRST",
  WorkerTotalDelegationDescNullsLast = "worker_totalDelegation_DESC_NULLS_LAST",
  WorkerTrafficWeightAsc = "worker_trafficWeight_ASC",
  WorkerTrafficWeightAscNullsFirst = "worker_trafficWeight_ASC_NULLS_FIRST",
  WorkerTrafficWeightAscNullsLast = "worker_trafficWeight_ASC_NULLS_LAST",
  WorkerTrafficWeightDesc = "worker_trafficWeight_DESC",
  WorkerTrafficWeightDescNullsFirst = "worker_trafficWeight_DESC_NULLS_FIRST",
  WorkerTrafficWeightDescNullsLast = "worker_trafficWeight_DESC_NULLS_LAST",
  WorkerUptime24HoursAsc = "worker_uptime24Hours_ASC",
  WorkerUptime24HoursAscNullsFirst = "worker_uptime24Hours_ASC_NULLS_FIRST",
  WorkerUptime24HoursAscNullsLast = "worker_uptime24Hours_ASC_NULLS_LAST",
  WorkerUptime24HoursDesc = "worker_uptime24Hours_DESC",
  WorkerUptime24HoursDescNullsFirst = "worker_uptime24Hours_DESC_NULLS_FIRST",
  WorkerUptime24HoursDescNullsLast = "worker_uptime24Hours_DESC_NULLS_LAST",
  WorkerUptime90DaysAsc = "worker_uptime90Days_ASC",
  WorkerUptime90DaysAscNullsFirst = "worker_uptime90Days_ASC_NULLS_FIRST",
  WorkerUptime90DaysAscNullsLast = "worker_uptime90Days_ASC_NULLS_LAST",
  WorkerUptime90DaysDesc = "worker_uptime90Days_DESC",
  WorkerUptime90DaysDescNullsFirst = "worker_uptime90Days_DESC_NULLS_FIRST",
  WorkerUptime90DaysDescNullsLast = "worker_uptime90Days_DESC_NULLS_LAST",
  WorkerVersionAsc = "worker_version_ASC",
  WorkerVersionAscNullsFirst = "worker_version_ASC_NULLS_FIRST",
  WorkerVersionAscNullsLast = "worker_version_ASC_NULLS_LAST",
  WorkerVersionDesc = "worker_version_DESC",
  WorkerVersionDescNullsFirst = "worker_version_DESC_NULLS_FIRST",
  WorkerVersionDescNullsLast = "worker_version_DESC_NULLS_LAST",
  WorkerWebsiteAsc = "worker_website_ASC",
  WorkerWebsiteAscNullsFirst = "worker_website_ASC_NULLS_FIRST",
  WorkerWebsiteAscNullsLast = "worker_website_ASC_NULLS_LAST",
  WorkerWebsiteDesc = "worker_website_DESC",
  WorkerWebsiteDescNullsFirst = "worker_website_DESC_NULLS_FIRST",
  WorkerWebsiteDescNullsLast = "worker_website_DESC_NULLS_LAST",
}

export type DelegationReward = {
  __typename?: "DelegationReward";
  amount: Scalars["BigInt"]["output"];
  apr: Scalars["Float"]["output"];
  blockNumber: Scalars["Int"]["output"];
  delegation: Delegation;
  id: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
};

export type DelegationRewardEdge = {
  __typename?: "DelegationRewardEdge";
  cursor: Scalars["String"]["output"];
  node: DelegationReward;
};

export enum DelegationRewardOrderByInput {
  AmountAsc = "amount_ASC",
  AmountAscNullsFirst = "amount_ASC_NULLS_FIRST",
  AmountAscNullsLast = "amount_ASC_NULLS_LAST",
  AmountDesc = "amount_DESC",
  AmountDescNullsFirst = "amount_DESC_NULLS_FIRST",
  AmountDescNullsLast = "amount_DESC_NULLS_LAST",
  AprAsc = "apr_ASC",
  AprAscNullsFirst = "apr_ASC_NULLS_FIRST",
  AprAscNullsLast = "apr_ASC_NULLS_LAST",
  AprDesc = "apr_DESC",
  AprDescNullsFirst = "apr_DESC_NULLS_FIRST",
  AprDescNullsLast = "apr_DESC_NULLS_LAST",
  BlockNumberAsc = "blockNumber_ASC",
  BlockNumberAscNullsFirst = "blockNumber_ASC_NULLS_FIRST",
  BlockNumberAscNullsLast = "blockNumber_ASC_NULLS_LAST",
  BlockNumberDesc = "blockNumber_DESC",
  BlockNumberDescNullsFirst = "blockNumber_DESC_NULLS_FIRST",
  BlockNumberDescNullsLast = "blockNumber_DESC_NULLS_LAST",
  DelegationClaimableRewardAsc = "delegation_claimableReward_ASC",
  DelegationClaimableRewardAscNullsFirst = "delegation_claimableReward_ASC_NULLS_FIRST",
  DelegationClaimableRewardAscNullsLast = "delegation_claimableReward_ASC_NULLS_LAST",
  DelegationClaimableRewardDesc = "delegation_claimableReward_DESC",
  DelegationClaimableRewardDescNullsFirst = "delegation_claimableReward_DESC_NULLS_FIRST",
  DelegationClaimableRewardDescNullsLast = "delegation_claimableReward_DESC_NULLS_LAST",
  DelegationClaimedRewardAsc = "delegation_claimedReward_ASC",
  DelegationClaimedRewardAscNullsFirst = "delegation_claimedReward_ASC_NULLS_FIRST",
  DelegationClaimedRewardAscNullsLast = "delegation_claimedReward_ASC_NULLS_LAST",
  DelegationClaimedRewardDesc = "delegation_claimedReward_DESC",
  DelegationClaimedRewardDescNullsFirst = "delegation_claimedReward_DESC_NULLS_FIRST",
  DelegationClaimedRewardDescNullsLast = "delegation_claimedReward_DESC_NULLS_LAST",
  DelegationDepositAsc = "delegation_deposit_ASC",
  DelegationDepositAscNullsFirst = "delegation_deposit_ASC_NULLS_FIRST",
  DelegationDepositAscNullsLast = "delegation_deposit_ASC_NULLS_LAST",
  DelegationDepositDesc = "delegation_deposit_DESC",
  DelegationDepositDescNullsFirst = "delegation_deposit_DESC_NULLS_FIRST",
  DelegationDepositDescNullsLast = "delegation_deposit_DESC_NULLS_LAST",
  DelegationIdAsc = "delegation_id_ASC",
  DelegationIdAscNullsFirst = "delegation_id_ASC_NULLS_FIRST",
  DelegationIdAscNullsLast = "delegation_id_ASC_NULLS_LAST",
  DelegationIdDesc = "delegation_id_DESC",
  DelegationIdDescNullsFirst = "delegation_id_DESC_NULLS_FIRST",
  DelegationIdDescNullsLast = "delegation_id_DESC_NULLS_LAST",
  DelegationLockEndAsc = "delegation_lockEnd_ASC",
  DelegationLockEndAscNullsFirst = "delegation_lockEnd_ASC_NULLS_FIRST",
  DelegationLockEndAscNullsLast = "delegation_lockEnd_ASC_NULLS_LAST",
  DelegationLockEndDesc = "delegation_lockEnd_DESC",
  DelegationLockEndDescNullsFirst = "delegation_lockEnd_DESC_NULLS_FIRST",
  DelegationLockEndDescNullsLast = "delegation_lockEnd_DESC_NULLS_LAST",
  DelegationLockStartAsc = "delegation_lockStart_ASC",
  DelegationLockStartAscNullsFirst = "delegation_lockStart_ASC_NULLS_FIRST",
  DelegationLockStartAscNullsLast = "delegation_lockStart_ASC_NULLS_LAST",
  DelegationLockStartDesc = "delegation_lockStart_DESC",
  DelegationLockStartDescNullsFirst = "delegation_lockStart_DESC_NULLS_FIRST",
  DelegationLockStartDescNullsLast = "delegation_lockStart_DESC_NULLS_LAST",
  DelegationLockedAsc = "delegation_locked_ASC",
  DelegationLockedAscNullsFirst = "delegation_locked_ASC_NULLS_FIRST",
  DelegationLockedAscNullsLast = "delegation_locked_ASC_NULLS_LAST",
  DelegationLockedDesc = "delegation_locked_DESC",
  DelegationLockedDescNullsFirst = "delegation_locked_DESC_NULLS_FIRST",
  DelegationLockedDescNullsLast = "delegation_locked_DESC_NULLS_LAST",
  DelegationStatusAsc = "delegation_status_ASC",
  DelegationStatusAscNullsFirst = "delegation_status_ASC_NULLS_FIRST",
  DelegationStatusAscNullsLast = "delegation_status_ASC_NULLS_LAST",
  DelegationStatusDesc = "delegation_status_DESC",
  DelegationStatusDescNullsFirst = "delegation_status_DESC_NULLS_FIRST",
  DelegationStatusDescNullsLast = "delegation_status_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
}

export type DelegationRewardWhereInput = {
  AND?: InputMaybe<Array<DelegationRewardWhereInput>>;
  OR?: InputMaybe<Array<DelegationRewardWhereInput>>;
  amount_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  apr_eq?: InputMaybe<Scalars["Float"]["input"]>;
  apr_gt?: InputMaybe<Scalars["Float"]["input"]>;
  apr_gte?: InputMaybe<Scalars["Float"]["input"]>;
  apr_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  apr_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  apr_lt?: InputMaybe<Scalars["Float"]["input"]>;
  apr_lte?: InputMaybe<Scalars["Float"]["input"]>;
  apr_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  apr_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  blockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegation?: InputMaybe<DelegationWhereInput>;
  delegation_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type DelegationRewardsConnection = {
  __typename?: "DelegationRewardsConnection";
  edges: Array<DelegationRewardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum DelegationStatus {
  Active = "ACTIVE",
  Unknown = "UNKNOWN",
  Withdrawn = "WITHDRAWN",
}

export type DelegationStatusChange = {
  __typename?: "DelegationStatusChange";
  blockNumber: Scalars["Int"]["output"];
  delegation: Delegation;
  id: Scalars["String"]["output"];
  pending: Scalars["Boolean"]["output"];
  status: DelegationStatus;
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
};

export type DelegationStatusChangeEdge = {
  __typename?: "DelegationStatusChangeEdge";
  cursor: Scalars["String"]["output"];
  node: DelegationStatusChange;
};

export enum DelegationStatusChangeOrderByInput {
  BlockNumberAsc = "blockNumber_ASC",
  BlockNumberAscNullsFirst = "blockNumber_ASC_NULLS_FIRST",
  BlockNumberAscNullsLast = "blockNumber_ASC_NULLS_LAST",
  BlockNumberDesc = "blockNumber_DESC",
  BlockNumberDescNullsFirst = "blockNumber_DESC_NULLS_FIRST",
  BlockNumberDescNullsLast = "blockNumber_DESC_NULLS_LAST",
  DelegationClaimableRewardAsc = "delegation_claimableReward_ASC",
  DelegationClaimableRewardAscNullsFirst = "delegation_claimableReward_ASC_NULLS_FIRST",
  DelegationClaimableRewardAscNullsLast = "delegation_claimableReward_ASC_NULLS_LAST",
  DelegationClaimableRewardDesc = "delegation_claimableReward_DESC",
  DelegationClaimableRewardDescNullsFirst = "delegation_claimableReward_DESC_NULLS_FIRST",
  DelegationClaimableRewardDescNullsLast = "delegation_claimableReward_DESC_NULLS_LAST",
  DelegationClaimedRewardAsc = "delegation_claimedReward_ASC",
  DelegationClaimedRewardAscNullsFirst = "delegation_claimedReward_ASC_NULLS_FIRST",
  DelegationClaimedRewardAscNullsLast = "delegation_claimedReward_ASC_NULLS_LAST",
  DelegationClaimedRewardDesc = "delegation_claimedReward_DESC",
  DelegationClaimedRewardDescNullsFirst = "delegation_claimedReward_DESC_NULLS_FIRST",
  DelegationClaimedRewardDescNullsLast = "delegation_claimedReward_DESC_NULLS_LAST",
  DelegationDepositAsc = "delegation_deposit_ASC",
  DelegationDepositAscNullsFirst = "delegation_deposit_ASC_NULLS_FIRST",
  DelegationDepositAscNullsLast = "delegation_deposit_ASC_NULLS_LAST",
  DelegationDepositDesc = "delegation_deposit_DESC",
  DelegationDepositDescNullsFirst = "delegation_deposit_DESC_NULLS_FIRST",
  DelegationDepositDescNullsLast = "delegation_deposit_DESC_NULLS_LAST",
  DelegationIdAsc = "delegation_id_ASC",
  DelegationIdAscNullsFirst = "delegation_id_ASC_NULLS_FIRST",
  DelegationIdAscNullsLast = "delegation_id_ASC_NULLS_LAST",
  DelegationIdDesc = "delegation_id_DESC",
  DelegationIdDescNullsFirst = "delegation_id_DESC_NULLS_FIRST",
  DelegationIdDescNullsLast = "delegation_id_DESC_NULLS_LAST",
  DelegationLockEndAsc = "delegation_lockEnd_ASC",
  DelegationLockEndAscNullsFirst = "delegation_lockEnd_ASC_NULLS_FIRST",
  DelegationLockEndAscNullsLast = "delegation_lockEnd_ASC_NULLS_LAST",
  DelegationLockEndDesc = "delegation_lockEnd_DESC",
  DelegationLockEndDescNullsFirst = "delegation_lockEnd_DESC_NULLS_FIRST",
  DelegationLockEndDescNullsLast = "delegation_lockEnd_DESC_NULLS_LAST",
  DelegationLockStartAsc = "delegation_lockStart_ASC",
  DelegationLockStartAscNullsFirst = "delegation_lockStart_ASC_NULLS_FIRST",
  DelegationLockStartAscNullsLast = "delegation_lockStart_ASC_NULLS_LAST",
  DelegationLockStartDesc = "delegation_lockStart_DESC",
  DelegationLockStartDescNullsFirst = "delegation_lockStart_DESC_NULLS_FIRST",
  DelegationLockStartDescNullsLast = "delegation_lockStart_DESC_NULLS_LAST",
  DelegationLockedAsc = "delegation_locked_ASC",
  DelegationLockedAscNullsFirst = "delegation_locked_ASC_NULLS_FIRST",
  DelegationLockedAscNullsLast = "delegation_locked_ASC_NULLS_LAST",
  DelegationLockedDesc = "delegation_locked_DESC",
  DelegationLockedDescNullsFirst = "delegation_locked_DESC_NULLS_FIRST",
  DelegationLockedDescNullsLast = "delegation_locked_DESC_NULLS_LAST",
  DelegationStatusAsc = "delegation_status_ASC",
  DelegationStatusAscNullsFirst = "delegation_status_ASC_NULLS_FIRST",
  DelegationStatusAscNullsLast = "delegation_status_ASC_NULLS_LAST",
  DelegationStatusDesc = "delegation_status_DESC",
  DelegationStatusDescNullsFirst = "delegation_status_DESC_NULLS_FIRST",
  DelegationStatusDescNullsLast = "delegation_status_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  PendingAsc = "pending_ASC",
  PendingAscNullsFirst = "pending_ASC_NULLS_FIRST",
  PendingAscNullsLast = "pending_ASC_NULLS_LAST",
  PendingDesc = "pending_DESC",
  PendingDescNullsFirst = "pending_DESC_NULLS_FIRST",
  PendingDescNullsLast = "pending_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
}

export type DelegationStatusChangeWhereInput = {
  AND?: InputMaybe<Array<DelegationStatusChangeWhereInput>>;
  OR?: InputMaybe<Array<DelegationStatusChangeWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegation?: InputMaybe<DelegationWhereInput>;
  delegation_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  pending_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  pending_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  pending_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_eq?: InputMaybe<DelegationStatus>;
  status_in?: InputMaybe<Array<DelegationStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<DelegationStatus>;
  status_not_in?: InputMaybe<Array<DelegationStatus>>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type DelegationStatusChangesConnection = {
  __typename?: "DelegationStatusChangesConnection";
  edges: Array<DelegationStatusChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type DelegationWhereInput = {
  AND?: InputMaybe<Array<DelegationWhereInput>>;
  OR?: InputMaybe<Array<DelegationWhereInput>>;
  claimableReward_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimableReward_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  claimableReward_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedReward_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedReward_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  claimedReward_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  deposit_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  deposit_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  deposit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposit_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  lockEnd_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockEnd_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockEnd_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockStart_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockStart_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockStart_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  locked_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<AccountWhereInput>;
  owner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  realOwner?: InputMaybe<AccountWhereInput>;
  realOwner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewards_every?: InputMaybe<DelegationRewardWhereInput>;
  rewards_none?: InputMaybe<DelegationRewardWhereInput>;
  rewards_some?: InputMaybe<DelegationRewardWhereInput>;
  statusHistory_every?: InputMaybe<DelegationStatusChangeWhereInput>;
  statusHistory_none?: InputMaybe<DelegationStatusChangeWhereInput>;
  statusHistory_some?: InputMaybe<DelegationStatusChangeWhereInput>;
  status_eq?: InputMaybe<DelegationStatus>;
  status_in?: InputMaybe<Array<DelegationStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<DelegationStatus>;
  status_not_in?: InputMaybe<Array<DelegationStatus>>;
  worker?: InputMaybe<WorkerWhereInput>;
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type DelegationsConnection = {
  __typename?: "DelegationsConnection";
  edges: Array<DelegationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type DelegationsEntry = {
  __typename?: "DelegationsEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DelegationsTimeseries = {
  __typename?: "DelegationsTimeseries";
  data: Array<DelegationsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type DelegatorsEntry = {
  __typename?: "DelegatorsEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DelegatorsTimeseries = {
  __typename?: "DelegatorsTimeseries";
  data: Array<DelegatorsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Epoch = {
  __typename?: "Epoch";
  activeWorkerIds?: Maybe<Array<Scalars["String"]["output"]>>;
  end: Scalars["Int"]["output"];
  endedAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["String"]["output"];
  number: Scalars["Int"]["output"];
  start: Scalars["Int"]["output"];
  startedAt?: Maybe<Scalars["DateTime"]["output"]>;
  status: EpochStatus;
};

export type EpochEdge = {
  __typename?: "EpochEdge";
  cursor: Scalars["String"]["output"];
  node: Epoch;
};

export enum EpochOrderByInput {
  EndAsc = "end_ASC",
  EndAscNullsFirst = "end_ASC_NULLS_FIRST",
  EndAscNullsLast = "end_ASC_NULLS_LAST",
  EndDesc = "end_DESC",
  EndDescNullsFirst = "end_DESC_NULLS_FIRST",
  EndDescNullsLast = "end_DESC_NULLS_LAST",
  EndedAtAsc = "endedAt_ASC",
  EndedAtAscNullsFirst = "endedAt_ASC_NULLS_FIRST",
  EndedAtAscNullsLast = "endedAt_ASC_NULLS_LAST",
  EndedAtDesc = "endedAt_DESC",
  EndedAtDescNullsFirst = "endedAt_DESC_NULLS_FIRST",
  EndedAtDescNullsLast = "endedAt_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  NumberAsc = "number_ASC",
  NumberAscNullsFirst = "number_ASC_NULLS_FIRST",
  NumberAscNullsLast = "number_ASC_NULLS_LAST",
  NumberDesc = "number_DESC",
  NumberDescNullsFirst = "number_DESC_NULLS_FIRST",
  NumberDescNullsLast = "number_DESC_NULLS_LAST",
  StartAsc = "start_ASC",
  StartAscNullsFirst = "start_ASC_NULLS_FIRST",
  StartAscNullsLast = "start_ASC_NULLS_LAST",
  StartDesc = "start_DESC",
  StartDescNullsFirst = "start_DESC_NULLS_FIRST",
  StartDescNullsLast = "start_DESC_NULLS_LAST",
  StartedAtAsc = "startedAt_ASC",
  StartedAtAscNullsFirst = "startedAt_ASC_NULLS_FIRST",
  StartedAtAscNullsLast = "startedAt_ASC_NULLS_LAST",
  StartedAtDesc = "startedAt_DESC",
  StartedAtDescNullsFirst = "startedAt_DESC_NULLS_FIRST",
  StartedAtDescNullsLast = "startedAt_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
}

export enum EpochStatus {
  Ended = "ENDED",
  Planned = "PLANNED",
  Started = "STARTED",
}

export type EpochWhereInput = {
  AND?: InputMaybe<Array<EpochWhereInput>>;
  OR?: InputMaybe<Array<EpochWhereInput>>;
  activeWorkerIds_containsAll?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeWorkerIds_containsAny?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeWorkerIds_containsNone?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeWorkerIds_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  end_eq?: InputMaybe<Scalars["Int"]["input"]>;
  end_gt?: InputMaybe<Scalars["Int"]["input"]>;
  end_gte?: InputMaybe<Scalars["Int"]["input"]>;
  end_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  end_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  end_lt?: InputMaybe<Scalars["Int"]["input"]>;
  end_lte?: InputMaybe<Scalars["Int"]["input"]>;
  end_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  end_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  endedAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  endedAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  endedAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  endedAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  endedAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  endedAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  endedAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  endedAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  endedAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  number_eq?: InputMaybe<Scalars["Int"]["input"]>;
  number_gt?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
  number_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  number_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  number_lt?: InputMaybe<Scalars["Int"]["input"]>;
  number_lte?: InputMaybe<Scalars["Int"]["input"]>;
  number_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  number_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  start_eq?: InputMaybe<Scalars["Int"]["input"]>;
  start_gt?: InputMaybe<Scalars["Int"]["input"]>;
  start_gte?: InputMaybe<Scalars["Int"]["input"]>;
  start_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  start_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_lt?: InputMaybe<Scalars["Int"]["input"]>;
  start_lte?: InputMaybe<Scalars["Int"]["input"]>;
  start_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  start_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  startedAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  startedAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  startedAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  startedAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  startedAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  startedAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  startedAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  startedAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  startedAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  status_eq?: InputMaybe<EpochStatus>;
  status_in?: InputMaybe<Array<EpochStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<EpochStatus>;
  status_not_in?: InputMaybe<Array<EpochStatus>>;
};

export type EpochesConnection = {
  __typename?: "EpochesConnection";
  edges: Array<EpochEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Gateway = {
  __typename?: "Gateway";
  createdAt: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  endpointUrl?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  owner: Account;
  realOwner: Account;
  stake: GatewayStake;
  status: GatewayStatus;
  statusHistory: Array<GatewayStatusChange>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type GatewayStatusHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayStatusChangeOrderByInput>>;
  where?: InputMaybe<GatewayStatusChangeWhereInput>;
};

export type GatewayEdge = {
  __typename?: "GatewayEdge";
  cursor: Scalars["String"]["output"];
  node: Gateway;
};

export enum GatewayOrderByInput {
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtAscNullsFirst = "createdAt_ASC_NULLS_FIRST",
  CreatedAtAscNullsLast = "createdAt_ASC_NULLS_LAST",
  CreatedAtDesc = "createdAt_DESC",
  CreatedAtDescNullsFirst = "createdAt_DESC_NULLS_FIRST",
  CreatedAtDescNullsLast = "createdAt_DESC_NULLS_LAST",
  DescriptionAsc = "description_ASC",
  DescriptionAscNullsFirst = "description_ASC_NULLS_FIRST",
  DescriptionAscNullsLast = "description_ASC_NULLS_LAST",
  DescriptionDesc = "description_DESC",
  DescriptionDescNullsFirst = "description_DESC_NULLS_FIRST",
  DescriptionDescNullsLast = "description_DESC_NULLS_LAST",
  EmailAsc = "email_ASC",
  EmailAscNullsFirst = "email_ASC_NULLS_FIRST",
  EmailAscNullsLast = "email_ASC_NULLS_LAST",
  EmailDesc = "email_DESC",
  EmailDescNullsFirst = "email_DESC_NULLS_FIRST",
  EmailDescNullsLast = "email_DESC_NULLS_LAST",
  EndpointUrlAsc = "endpointUrl_ASC",
  EndpointUrlAscNullsFirst = "endpointUrl_ASC_NULLS_FIRST",
  EndpointUrlAscNullsLast = "endpointUrl_ASC_NULLS_LAST",
  EndpointUrlDesc = "endpointUrl_DESC",
  EndpointUrlDescNullsFirst = "endpointUrl_DESC_NULLS_FIRST",
  EndpointUrlDescNullsLast = "endpointUrl_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  NameAsc = "name_ASC",
  NameAscNullsFirst = "name_ASC_NULLS_FIRST",
  NameAscNullsLast = "name_ASC_NULLS_LAST",
  NameDesc = "name_DESC",
  NameDescNullsFirst = "name_DESC_NULLS_FIRST",
  NameDescNullsLast = "name_DESC_NULLS_LAST",
  OwnerBalanceAsc = "owner_balance_ASC",
  OwnerBalanceAscNullsFirst = "owner_balance_ASC_NULLS_FIRST",
  OwnerBalanceAscNullsLast = "owner_balance_ASC_NULLS_LAST",
  OwnerBalanceDesc = "owner_balance_DESC",
  OwnerBalanceDescNullsFirst = "owner_balance_DESC_NULLS_FIRST",
  OwnerBalanceDescNullsLast = "owner_balance_DESC_NULLS_LAST",
  OwnerClaimableDelegationCountAsc = "owner_claimableDelegationCount_ASC",
  OwnerClaimableDelegationCountAscNullsFirst = "owner_claimableDelegationCount_ASC_NULLS_FIRST",
  OwnerClaimableDelegationCountAscNullsLast = "owner_claimableDelegationCount_ASC_NULLS_LAST",
  OwnerClaimableDelegationCountDesc = "owner_claimableDelegationCount_DESC",
  OwnerClaimableDelegationCountDescNullsFirst = "owner_claimableDelegationCount_DESC_NULLS_FIRST",
  OwnerClaimableDelegationCountDescNullsLast = "owner_claimableDelegationCount_DESC_NULLS_LAST",
  OwnerIdAsc = "owner_id_ASC",
  OwnerIdAscNullsFirst = "owner_id_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "owner_id_ASC_NULLS_LAST",
  OwnerIdDesc = "owner_id_DESC",
  OwnerIdDescNullsFirst = "owner_id_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "owner_id_DESC_NULLS_LAST",
  OwnerTypeAsc = "owner_type_ASC",
  OwnerTypeAscNullsFirst = "owner_type_ASC_NULLS_FIRST",
  OwnerTypeAscNullsLast = "owner_type_ASC_NULLS_LAST",
  OwnerTypeDesc = "owner_type_DESC",
  OwnerTypeDescNullsFirst = "owner_type_DESC_NULLS_FIRST",
  OwnerTypeDescNullsLast = "owner_type_DESC_NULLS_LAST",
  RealOwnerBalanceAsc = "realOwner_balance_ASC",
  RealOwnerBalanceAscNullsFirst = "realOwner_balance_ASC_NULLS_FIRST",
  RealOwnerBalanceAscNullsLast = "realOwner_balance_ASC_NULLS_LAST",
  RealOwnerBalanceDesc = "realOwner_balance_DESC",
  RealOwnerBalanceDescNullsFirst = "realOwner_balance_DESC_NULLS_FIRST",
  RealOwnerBalanceDescNullsLast = "realOwner_balance_DESC_NULLS_LAST",
  RealOwnerClaimableDelegationCountAsc = "realOwner_claimableDelegationCount_ASC",
  RealOwnerClaimableDelegationCountAscNullsFirst = "realOwner_claimableDelegationCount_ASC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountAscNullsLast = "realOwner_claimableDelegationCount_ASC_NULLS_LAST",
  RealOwnerClaimableDelegationCountDesc = "realOwner_claimableDelegationCount_DESC",
  RealOwnerClaimableDelegationCountDescNullsFirst = "realOwner_claimableDelegationCount_DESC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountDescNullsLast = "realOwner_claimableDelegationCount_DESC_NULLS_LAST",
  RealOwnerIdAsc = "realOwner_id_ASC",
  RealOwnerIdAscNullsFirst = "realOwner_id_ASC_NULLS_FIRST",
  RealOwnerIdAscNullsLast = "realOwner_id_ASC_NULLS_LAST",
  RealOwnerIdDesc = "realOwner_id_DESC",
  RealOwnerIdDescNullsFirst = "realOwner_id_DESC_NULLS_FIRST",
  RealOwnerIdDescNullsLast = "realOwner_id_DESC_NULLS_LAST",
  RealOwnerTypeAsc = "realOwner_type_ASC",
  RealOwnerTypeAscNullsFirst = "realOwner_type_ASC_NULLS_FIRST",
  RealOwnerTypeAscNullsLast = "realOwner_type_ASC_NULLS_LAST",
  RealOwnerTypeDesc = "realOwner_type_DESC",
  RealOwnerTypeDescNullsFirst = "realOwner_type_DESC_NULLS_FIRST",
  RealOwnerTypeDescNullsLast = "realOwner_type_DESC_NULLS_LAST",
  StakeAmountAsc = "stake_amount_ASC",
  StakeAmountAscNullsFirst = "stake_amount_ASC_NULLS_FIRST",
  StakeAmountAscNullsLast = "stake_amount_ASC_NULLS_LAST",
  StakeAmountDesc = "stake_amount_DESC",
  StakeAmountDescNullsFirst = "stake_amount_DESC_NULLS_FIRST",
  StakeAmountDescNullsLast = "stake_amount_DESC_NULLS_LAST",
  StakeAutoExtensionAsc = "stake_autoExtension_ASC",
  StakeAutoExtensionAscNullsFirst = "stake_autoExtension_ASC_NULLS_FIRST",
  StakeAutoExtensionAscNullsLast = "stake_autoExtension_ASC_NULLS_LAST",
  StakeAutoExtensionDesc = "stake_autoExtension_DESC",
  StakeAutoExtensionDescNullsFirst = "stake_autoExtension_DESC_NULLS_FIRST",
  StakeAutoExtensionDescNullsLast = "stake_autoExtension_DESC_NULLS_LAST",
  StakeComputationUnitsPendingAsc = "stake_computationUnitsPending_ASC",
  StakeComputationUnitsPendingAscNullsFirst = "stake_computationUnitsPending_ASC_NULLS_FIRST",
  StakeComputationUnitsPendingAscNullsLast = "stake_computationUnitsPending_ASC_NULLS_LAST",
  StakeComputationUnitsPendingDesc = "stake_computationUnitsPending_DESC",
  StakeComputationUnitsPendingDescNullsFirst = "stake_computationUnitsPending_DESC_NULLS_FIRST",
  StakeComputationUnitsPendingDescNullsLast = "stake_computationUnitsPending_DESC_NULLS_LAST",
  StakeComputationUnitsAsc = "stake_computationUnits_ASC",
  StakeComputationUnitsAscNullsFirst = "stake_computationUnits_ASC_NULLS_FIRST",
  StakeComputationUnitsAscNullsLast = "stake_computationUnits_ASC_NULLS_LAST",
  StakeComputationUnitsDesc = "stake_computationUnits_DESC",
  StakeComputationUnitsDescNullsFirst = "stake_computationUnits_DESC_NULLS_FIRST",
  StakeComputationUnitsDescNullsLast = "stake_computationUnits_DESC_NULLS_LAST",
  StakeIdAsc = "stake_id_ASC",
  StakeIdAscNullsFirst = "stake_id_ASC_NULLS_FIRST",
  StakeIdAscNullsLast = "stake_id_ASC_NULLS_LAST",
  StakeIdDesc = "stake_id_DESC",
  StakeIdDescNullsFirst = "stake_id_DESC_NULLS_FIRST",
  StakeIdDescNullsLast = "stake_id_DESC_NULLS_LAST",
  StakeLockEndAsc = "stake_lockEnd_ASC",
  StakeLockEndAscNullsFirst = "stake_lockEnd_ASC_NULLS_FIRST",
  StakeLockEndAscNullsLast = "stake_lockEnd_ASC_NULLS_LAST",
  StakeLockEndDesc = "stake_lockEnd_DESC",
  StakeLockEndDescNullsFirst = "stake_lockEnd_DESC_NULLS_FIRST",
  StakeLockEndDescNullsLast = "stake_lockEnd_DESC_NULLS_LAST",
  StakeLockStartAsc = "stake_lockStart_ASC",
  StakeLockStartAscNullsFirst = "stake_lockStart_ASC_NULLS_FIRST",
  StakeLockStartAscNullsLast = "stake_lockStart_ASC_NULLS_LAST",
  StakeLockStartDesc = "stake_lockStart_DESC",
  StakeLockStartDescNullsFirst = "stake_lockStart_DESC_NULLS_FIRST",
  StakeLockStartDescNullsLast = "stake_lockStart_DESC_NULLS_LAST",
  StakeLockedAsc = "stake_locked_ASC",
  StakeLockedAscNullsFirst = "stake_locked_ASC_NULLS_FIRST",
  StakeLockedAscNullsLast = "stake_locked_ASC_NULLS_LAST",
  StakeLockedDesc = "stake_locked_DESC",
  StakeLockedDescNullsFirst = "stake_locked_DESC_NULLS_FIRST",
  StakeLockedDescNullsLast = "stake_locked_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
  WebsiteAsc = "website_ASC",
  WebsiteAscNullsFirst = "website_ASC_NULLS_FIRST",
  WebsiteAscNullsLast = "website_ASC_NULLS_LAST",
  WebsiteDesc = "website_DESC",
  WebsiteDescNullsFirst = "website_DESC_NULLS_FIRST",
  WebsiteDescNullsLast = "website_DESC_NULLS_LAST",
}

export type GatewayStake = {
  __typename?: "GatewayStake";
  amount: Scalars["BigInt"]["output"];
  autoExtension: Scalars["Boolean"]["output"];
  computationUnits: Scalars["BigInt"]["output"];
  computationUnitsPending?: Maybe<Scalars["BigInt"]["output"]>;
  gateways: Array<Gateway>;
  id: Scalars["String"]["output"];
  lockEnd?: Maybe<Scalars["Int"]["output"]>;
  lockStart?: Maybe<Scalars["Int"]["output"]>;
  locked: Scalars["Boolean"]["output"];
  owner: Account;
  realOwner: Account;
};

export type GatewayStakeGatewaysArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayOrderByInput>>;
  where?: InputMaybe<GatewayWhereInput>;
};

export type GatewayStakeEdge = {
  __typename?: "GatewayStakeEdge";
  cursor: Scalars["String"]["output"];
  node: GatewayStake;
};

export enum GatewayStakeOrderByInput {
  AmountAsc = "amount_ASC",
  AmountAscNullsFirst = "amount_ASC_NULLS_FIRST",
  AmountAscNullsLast = "amount_ASC_NULLS_LAST",
  AmountDesc = "amount_DESC",
  AmountDescNullsFirst = "amount_DESC_NULLS_FIRST",
  AmountDescNullsLast = "amount_DESC_NULLS_LAST",
  AutoExtensionAsc = "autoExtension_ASC",
  AutoExtensionAscNullsFirst = "autoExtension_ASC_NULLS_FIRST",
  AutoExtensionAscNullsLast = "autoExtension_ASC_NULLS_LAST",
  AutoExtensionDesc = "autoExtension_DESC",
  AutoExtensionDescNullsFirst = "autoExtension_DESC_NULLS_FIRST",
  AutoExtensionDescNullsLast = "autoExtension_DESC_NULLS_LAST",
  ComputationUnitsPendingAsc = "computationUnitsPending_ASC",
  ComputationUnitsPendingAscNullsFirst = "computationUnitsPending_ASC_NULLS_FIRST",
  ComputationUnitsPendingAscNullsLast = "computationUnitsPending_ASC_NULLS_LAST",
  ComputationUnitsPendingDesc = "computationUnitsPending_DESC",
  ComputationUnitsPendingDescNullsFirst = "computationUnitsPending_DESC_NULLS_FIRST",
  ComputationUnitsPendingDescNullsLast = "computationUnitsPending_DESC_NULLS_LAST",
  ComputationUnitsAsc = "computationUnits_ASC",
  ComputationUnitsAscNullsFirst = "computationUnits_ASC_NULLS_FIRST",
  ComputationUnitsAscNullsLast = "computationUnits_ASC_NULLS_LAST",
  ComputationUnitsDesc = "computationUnits_DESC",
  ComputationUnitsDescNullsFirst = "computationUnits_DESC_NULLS_FIRST",
  ComputationUnitsDescNullsLast = "computationUnits_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  LockEndAsc = "lockEnd_ASC",
  LockEndAscNullsFirst = "lockEnd_ASC_NULLS_FIRST",
  LockEndAscNullsLast = "lockEnd_ASC_NULLS_LAST",
  LockEndDesc = "lockEnd_DESC",
  LockEndDescNullsFirst = "lockEnd_DESC_NULLS_FIRST",
  LockEndDescNullsLast = "lockEnd_DESC_NULLS_LAST",
  LockStartAsc = "lockStart_ASC",
  LockStartAscNullsFirst = "lockStart_ASC_NULLS_FIRST",
  LockStartAscNullsLast = "lockStart_ASC_NULLS_LAST",
  LockStartDesc = "lockStart_DESC",
  LockStartDescNullsFirst = "lockStart_DESC_NULLS_FIRST",
  LockStartDescNullsLast = "lockStart_DESC_NULLS_LAST",
  LockedAsc = "locked_ASC",
  LockedAscNullsFirst = "locked_ASC_NULLS_FIRST",
  LockedAscNullsLast = "locked_ASC_NULLS_LAST",
  LockedDesc = "locked_DESC",
  LockedDescNullsFirst = "locked_DESC_NULLS_FIRST",
  LockedDescNullsLast = "locked_DESC_NULLS_LAST",
  OwnerBalanceAsc = "owner_balance_ASC",
  OwnerBalanceAscNullsFirst = "owner_balance_ASC_NULLS_FIRST",
  OwnerBalanceAscNullsLast = "owner_balance_ASC_NULLS_LAST",
  OwnerBalanceDesc = "owner_balance_DESC",
  OwnerBalanceDescNullsFirst = "owner_balance_DESC_NULLS_FIRST",
  OwnerBalanceDescNullsLast = "owner_balance_DESC_NULLS_LAST",
  OwnerClaimableDelegationCountAsc = "owner_claimableDelegationCount_ASC",
  OwnerClaimableDelegationCountAscNullsFirst = "owner_claimableDelegationCount_ASC_NULLS_FIRST",
  OwnerClaimableDelegationCountAscNullsLast = "owner_claimableDelegationCount_ASC_NULLS_LAST",
  OwnerClaimableDelegationCountDesc = "owner_claimableDelegationCount_DESC",
  OwnerClaimableDelegationCountDescNullsFirst = "owner_claimableDelegationCount_DESC_NULLS_FIRST",
  OwnerClaimableDelegationCountDescNullsLast = "owner_claimableDelegationCount_DESC_NULLS_LAST",
  OwnerIdAsc = "owner_id_ASC",
  OwnerIdAscNullsFirst = "owner_id_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "owner_id_ASC_NULLS_LAST",
  OwnerIdDesc = "owner_id_DESC",
  OwnerIdDescNullsFirst = "owner_id_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "owner_id_DESC_NULLS_LAST",
  OwnerTypeAsc = "owner_type_ASC",
  OwnerTypeAscNullsFirst = "owner_type_ASC_NULLS_FIRST",
  OwnerTypeAscNullsLast = "owner_type_ASC_NULLS_LAST",
  OwnerTypeDesc = "owner_type_DESC",
  OwnerTypeDescNullsFirst = "owner_type_DESC_NULLS_FIRST",
  OwnerTypeDescNullsLast = "owner_type_DESC_NULLS_LAST",
  RealOwnerBalanceAsc = "realOwner_balance_ASC",
  RealOwnerBalanceAscNullsFirst = "realOwner_balance_ASC_NULLS_FIRST",
  RealOwnerBalanceAscNullsLast = "realOwner_balance_ASC_NULLS_LAST",
  RealOwnerBalanceDesc = "realOwner_balance_DESC",
  RealOwnerBalanceDescNullsFirst = "realOwner_balance_DESC_NULLS_FIRST",
  RealOwnerBalanceDescNullsLast = "realOwner_balance_DESC_NULLS_LAST",
  RealOwnerClaimableDelegationCountAsc = "realOwner_claimableDelegationCount_ASC",
  RealOwnerClaimableDelegationCountAscNullsFirst = "realOwner_claimableDelegationCount_ASC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountAscNullsLast = "realOwner_claimableDelegationCount_ASC_NULLS_LAST",
  RealOwnerClaimableDelegationCountDesc = "realOwner_claimableDelegationCount_DESC",
  RealOwnerClaimableDelegationCountDescNullsFirst = "realOwner_claimableDelegationCount_DESC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountDescNullsLast = "realOwner_claimableDelegationCount_DESC_NULLS_LAST",
  RealOwnerIdAsc = "realOwner_id_ASC",
  RealOwnerIdAscNullsFirst = "realOwner_id_ASC_NULLS_FIRST",
  RealOwnerIdAscNullsLast = "realOwner_id_ASC_NULLS_LAST",
  RealOwnerIdDesc = "realOwner_id_DESC",
  RealOwnerIdDescNullsFirst = "realOwner_id_DESC_NULLS_FIRST",
  RealOwnerIdDescNullsLast = "realOwner_id_DESC_NULLS_LAST",
  RealOwnerTypeAsc = "realOwner_type_ASC",
  RealOwnerTypeAscNullsFirst = "realOwner_type_ASC_NULLS_FIRST",
  RealOwnerTypeAscNullsLast = "realOwner_type_ASC_NULLS_LAST",
  RealOwnerTypeDesc = "realOwner_type_DESC",
  RealOwnerTypeDescNullsFirst = "realOwner_type_DESC_NULLS_FIRST",
  RealOwnerTypeDescNullsLast = "realOwner_type_DESC_NULLS_LAST",
}

export type GatewayStakeWhereInput = {
  AND?: InputMaybe<Array<GatewayStakeWhereInput>>;
  OR?: InputMaybe<Array<GatewayStakeWhereInput>>;
  amount_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  autoExtension_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  autoExtension_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  autoExtension_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  computationUnitsPending_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnitsPending_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnitsPending_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnitsPending_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  computationUnitsPending_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  computationUnitsPending_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnitsPending_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnitsPending_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnitsPending_not_in?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  computationUnits_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnits_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnits_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnits_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  computationUnits_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  computationUnits_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnits_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnits_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  computationUnits_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  gateways_every?: InputMaybe<GatewayWhereInput>;
  gateways_none?: InputMaybe<GatewayWhereInput>;
  gateways_some?: InputMaybe<GatewayWhereInput>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  lockEnd_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockEnd_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockEnd_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockStart_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockStart_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockStart_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  locked_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<AccountWhereInput>;
  owner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  realOwner?: InputMaybe<AccountWhereInput>;
  realOwner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GatewayStakesConnection = {
  __typename?: "GatewayStakesConnection";
  edges: Array<GatewayStakeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum GatewayStatus {
  Deregistered = "DEREGISTERED",
  Registered = "REGISTERED",
  Unknown = "UNKNOWN",
}

export type GatewayStatusChange = {
  __typename?: "GatewayStatusChange";
  blockNumber: Scalars["Int"]["output"];
  gateway: Gateway;
  id: Scalars["String"]["output"];
  status: GatewayStatus;
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
};

export type GatewayStatusChangeEdge = {
  __typename?: "GatewayStatusChangeEdge";
  cursor: Scalars["String"]["output"];
  node: GatewayStatusChange;
};

export enum GatewayStatusChangeOrderByInput {
  BlockNumberAsc = "blockNumber_ASC",
  BlockNumberAscNullsFirst = "blockNumber_ASC_NULLS_FIRST",
  BlockNumberAscNullsLast = "blockNumber_ASC_NULLS_LAST",
  BlockNumberDesc = "blockNumber_DESC",
  BlockNumberDescNullsFirst = "blockNumber_DESC_NULLS_FIRST",
  BlockNumberDescNullsLast = "blockNumber_DESC_NULLS_LAST",
  GatewayCreatedAtAsc = "gateway_createdAt_ASC",
  GatewayCreatedAtAscNullsFirst = "gateway_createdAt_ASC_NULLS_FIRST",
  GatewayCreatedAtAscNullsLast = "gateway_createdAt_ASC_NULLS_LAST",
  GatewayCreatedAtDesc = "gateway_createdAt_DESC",
  GatewayCreatedAtDescNullsFirst = "gateway_createdAt_DESC_NULLS_FIRST",
  GatewayCreatedAtDescNullsLast = "gateway_createdAt_DESC_NULLS_LAST",
  GatewayDescriptionAsc = "gateway_description_ASC",
  GatewayDescriptionAscNullsFirst = "gateway_description_ASC_NULLS_FIRST",
  GatewayDescriptionAscNullsLast = "gateway_description_ASC_NULLS_LAST",
  GatewayDescriptionDesc = "gateway_description_DESC",
  GatewayDescriptionDescNullsFirst = "gateway_description_DESC_NULLS_FIRST",
  GatewayDescriptionDescNullsLast = "gateway_description_DESC_NULLS_LAST",
  GatewayEmailAsc = "gateway_email_ASC",
  GatewayEmailAscNullsFirst = "gateway_email_ASC_NULLS_FIRST",
  GatewayEmailAscNullsLast = "gateway_email_ASC_NULLS_LAST",
  GatewayEmailDesc = "gateway_email_DESC",
  GatewayEmailDescNullsFirst = "gateway_email_DESC_NULLS_FIRST",
  GatewayEmailDescNullsLast = "gateway_email_DESC_NULLS_LAST",
  GatewayEndpointUrlAsc = "gateway_endpointUrl_ASC",
  GatewayEndpointUrlAscNullsFirst = "gateway_endpointUrl_ASC_NULLS_FIRST",
  GatewayEndpointUrlAscNullsLast = "gateway_endpointUrl_ASC_NULLS_LAST",
  GatewayEndpointUrlDesc = "gateway_endpointUrl_DESC",
  GatewayEndpointUrlDescNullsFirst = "gateway_endpointUrl_DESC_NULLS_FIRST",
  GatewayEndpointUrlDescNullsLast = "gateway_endpointUrl_DESC_NULLS_LAST",
  GatewayIdAsc = "gateway_id_ASC",
  GatewayIdAscNullsFirst = "gateway_id_ASC_NULLS_FIRST",
  GatewayIdAscNullsLast = "gateway_id_ASC_NULLS_LAST",
  GatewayIdDesc = "gateway_id_DESC",
  GatewayIdDescNullsFirst = "gateway_id_DESC_NULLS_FIRST",
  GatewayIdDescNullsLast = "gateway_id_DESC_NULLS_LAST",
  GatewayNameAsc = "gateway_name_ASC",
  GatewayNameAscNullsFirst = "gateway_name_ASC_NULLS_FIRST",
  GatewayNameAscNullsLast = "gateway_name_ASC_NULLS_LAST",
  GatewayNameDesc = "gateway_name_DESC",
  GatewayNameDescNullsFirst = "gateway_name_DESC_NULLS_FIRST",
  GatewayNameDescNullsLast = "gateway_name_DESC_NULLS_LAST",
  GatewayStatusAsc = "gateway_status_ASC",
  GatewayStatusAscNullsFirst = "gateway_status_ASC_NULLS_FIRST",
  GatewayStatusAscNullsLast = "gateway_status_ASC_NULLS_LAST",
  GatewayStatusDesc = "gateway_status_DESC",
  GatewayStatusDescNullsFirst = "gateway_status_DESC_NULLS_FIRST",
  GatewayStatusDescNullsLast = "gateway_status_DESC_NULLS_LAST",
  GatewayWebsiteAsc = "gateway_website_ASC",
  GatewayWebsiteAscNullsFirst = "gateway_website_ASC_NULLS_FIRST",
  GatewayWebsiteAscNullsLast = "gateway_website_ASC_NULLS_LAST",
  GatewayWebsiteDesc = "gateway_website_DESC",
  GatewayWebsiteDescNullsFirst = "gateway_website_DESC_NULLS_FIRST",
  GatewayWebsiteDescNullsLast = "gateway_website_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
}

export type GatewayStatusChangeWhereInput = {
  AND?: InputMaybe<Array<GatewayStatusChangeWhereInput>>;
  OR?: InputMaybe<Array<GatewayStatusChangeWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  gateway?: InputMaybe<GatewayWhereInput>;
  gateway_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  status_eq?: InputMaybe<GatewayStatus>;
  status_in?: InputMaybe<Array<GatewayStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<GatewayStatus>;
  status_not_in?: InputMaybe<Array<GatewayStatus>>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type GatewayStatusChangesConnection = {
  __typename?: "GatewayStatusChangesConnection";
  edges: Array<GatewayStatusChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GatewayWhereInput = {
  AND?: InputMaybe<Array<GatewayWhereInput>>;
  OR?: InputMaybe<Array<GatewayWhereInput>>;
  createdAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  createdAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  createdAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  description_contains?: InputMaybe<Scalars["String"]["input"]>;
  description_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  description_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  description_eq?: InputMaybe<Scalars["String"]["input"]>;
  description_gt?: InputMaybe<Scalars["String"]["input"]>;
  description_gte?: InputMaybe<Scalars["String"]["input"]>;
  description_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  description_lt?: InputMaybe<Scalars["String"]["input"]>;
  description_lte?: InputMaybe<Scalars["String"]["input"]>;
  description_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  description_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  description_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  description_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  description_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  description_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_contains?: InputMaybe<Scalars["String"]["input"]>;
  email_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  email_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_eq?: InputMaybe<Scalars["String"]["input"]>;
  email_gt?: InputMaybe<Scalars["String"]["input"]>;
  email_gte?: InputMaybe<Scalars["String"]["input"]>;
  email_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  email_lt?: InputMaybe<Scalars["String"]["input"]>;
  email_lte?: InputMaybe<Scalars["String"]["input"]>;
  email_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  email_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  email_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  email_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_contains?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_eq?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_gt?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_gte?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  endpointUrl_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  endpointUrl_lt?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_lte?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  endpointUrl_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  endpointUrl_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  name_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_eq?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  name_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<AccountWhereInput>;
  owner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  realOwner?: InputMaybe<AccountWhereInput>;
  realOwner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  stake?: InputMaybe<GatewayStakeWhereInput>;
  stake_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  statusHistory_every?: InputMaybe<GatewayStatusChangeWhereInput>;
  statusHistory_none?: InputMaybe<GatewayStatusChangeWhereInput>;
  statusHistory_some?: InputMaybe<GatewayStatusChangeWhereInput>;
  status_eq?: InputMaybe<GatewayStatus>;
  status_in?: InputMaybe<Array<GatewayStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<GatewayStatus>;
  status_not_in?: InputMaybe<Array<GatewayStatus>>;
  website_contains?: InputMaybe<Scalars["String"]["input"]>;
  website_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  website_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_eq?: InputMaybe<Scalars["String"]["input"]>;
  website_gt?: InputMaybe<Scalars["String"]["input"]>;
  website_gte?: InputMaybe<Scalars["String"]["input"]>;
  website_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  website_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  website_lt?: InputMaybe<Scalars["String"]["input"]>;
  website_lte?: InputMaybe<Scalars["String"]["input"]>;
  website_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  website_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  website_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  website_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  website_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type GatewaysConnection = {
  __typename?: "GatewaysConnection";
  edges: Array<GatewayEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type HoldersCountEntry = {
  __typename?: "HoldersCountEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type HoldersCountTimeseries = {
  __typename?: "HoldersCountTimeseries";
  data: Array<HoldersCountEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type LockedValueTimeseries = {
  __typename?: "LockedValueTimeseries";
  data: Array<TvlEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type NetworkStats = {
  __typename?: "NetworkStats";
  aprs: Array<AprSnapshot>;
  blockTime: Scalars["Float"]["output"];
  blockTimeL1: Scalars["Float"]["output"];
  lastBlock: Scalars["Float"]["output"];
  lastBlockL1: Scalars["Float"]["output"];
  lastBlockTimestamp: Scalars["DateTime"]["output"];
  lastBlockTimestampL1: Scalars["DateTime"]["output"];
  onlineWorkersCount: Scalars["Float"]["output"];
  queries24Hours: Scalars["BigInt"]["output"];
  queries90Days: Scalars["BigInt"]["output"];
  servedData24Hours: Scalars["BigInt"]["output"];
  servedData90Days: Scalars["BigInt"]["output"];
  stakerApr: Scalars["Float"]["output"];
  storedData: Scalars["BigInt"]["output"];
  totalBond: Scalars["BigInt"]["output"];
  totalDelegation: Scalars["BigInt"]["output"];
  totalPortalLock: Scalars["BigInt"]["output"];
  workerApr: Scalars["Float"]["output"];
  workersCount: Scalars["Float"]["output"];
};

export type OperatorsEntry = {
  __typename?: "OperatorsEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor: Scalars["String"]["output"];
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor: Scalars["String"]["output"];
};

export type QueriesCountEntry = {
  __typename?: "QueriesCountEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type QueriesCountTimeseries = {
  __typename?: "QueriesCountTimeseries";
  data: Array<QueriesCountEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Query = {
  __typename?: "Query";
  accountBalanceTimeseries: AccountBalanceTimeseries;
  accountById?: Maybe<Account>;
  accountTransferById?: Maybe<AccountTransfer>;
  accountTransfers: Array<AccountTransfer>;
  accountTransfersConnection: AccountTransfersConnection;
  accounts: Array<Account>;
  accountsConnection: AccountsConnection;
  activeWorkersTimeseries: ActiveWorkersTimeseries;
  aprTimeseries: AprTimeseries;
  blockById?: Maybe<Block>;
  blocks: Array<Block>;
  blocksConnection: BlocksConnection;
  commitmentById?: Maybe<Commitment>;
  commitments: Array<Commitment>;
  commitmentsConnection: CommitmentsConnection;
  delegationById?: Maybe<Delegation>;
  delegationRewardById?: Maybe<DelegationReward>;
  delegationRewards: Array<DelegationReward>;
  delegationRewardsConnection: DelegationRewardsConnection;
  delegationStatusChangeById?: Maybe<DelegationStatusChange>;
  delegationStatusChanges: Array<DelegationStatusChange>;
  delegationStatusChangesConnection: DelegationStatusChangesConnection;
  delegations: Array<Delegation>;
  delegationsConnection: DelegationsConnection;
  delegationsTimeseries: DelegationsTimeseries;
  delegatorsTimeseries: DelegatorsTimeseries;
  epochById?: Maybe<Epoch>;
  epoches: Array<Epoch>;
  epochesConnection: EpochesConnection;
  gatewayById?: Maybe<Gateway>;
  gatewayStakeById?: Maybe<GatewayStake>;
  gatewayStakes: Array<GatewayStake>;
  gatewayStakesConnection: GatewayStakesConnection;
  gatewayStatusChangeById?: Maybe<GatewayStatusChange>;
  gatewayStatusChanges: Array<GatewayStatusChange>;
  gatewayStatusChangesConnection: GatewayStatusChangesConnection;
  gateways: Array<Gateway>;
  gatewaysConnection: GatewaysConnection;
  holdersCountTimeseries: HoldersCountTimeseries;
  lockedValueTimeseries: LockedValueTimeseries;
  networkStats: NetworkStats;
  queriesCountTimeseries: QueriesCountTimeseries;
  rewardTimeseries: RewardTimeseries;
  servedDataTimeseries: ServedDataTimeseries;
  settings: Array<Settings>;
  settingsById?: Maybe<Settings>;
  settingsConnection: SettingsConnection;
  squidStatus: SquidStatus;
  storedDataTimeseries: StoredDataTimeseries;
  temporaryHoldingData: Array<TemporaryHoldingData>;
  temporaryHoldingDataById?: Maybe<TemporaryHoldingData>;
  temporaryHoldingDataConnection: TemporaryHoldingDataConnection;
  transferById?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  transfersByTypeTimeseries: TransfersByTypeTimeseries;
  transfersConnection: TransfersConnection;
  uniqueAccountsTimeseries: UniqueAccountsTimeseries;
  uniqueOperatorsTimeseries: UniqueOperatorsTimeseries;
  uptimeTimeseries: UptimeTimeseries;
  workerById?: Maybe<Worker>;
  workerMetrics: Array<WorkerMetrics>;
  workerMetricsById?: Maybe<WorkerMetrics>;
  workerMetricsConnection: WorkerMetricsConnection;
  workerRewardById?: Maybe<WorkerReward>;
  workerRewards: Array<WorkerReward>;
  workerRewardsConnection: WorkerRewardsConnection;
  workerSnapshotById?: Maybe<WorkerSnapshot>;
  workerSnapshots: Array<WorkerSnapshot>;
  workerSnapshotsByDay: Array<WorkerSnapshotDay>;
  workerSnapshotsConnection: WorkerSnapshotsConnection;
  workerStatusChangeById?: Maybe<WorkerStatusChange>;
  workerStatusChanges: Array<WorkerStatusChange>;
  workerStatusChangesConnection: WorkerStatusChangesConnection;
  workers: Array<Worker>;
  workersConnection: WorkersConnection;
};

export type QueryAccountBalanceTimeseriesArgs = {
  accountId: Scalars["String"]["input"];
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryAccountByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryAccountTransferByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryAccountTransfersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<AccountTransferOrderByInput>>;
  where?: InputMaybe<AccountTransferWhereInput>;
};

export type QueryAccountTransfersConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<AccountTransferOrderByInput>;
  where?: InputMaybe<AccountTransferWhereInput>;
};

export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  where?: InputMaybe<AccountWhereInput>;
};

export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<AccountOrderByInput>;
  where?: InputMaybe<AccountWhereInput>;
};

export type QueryActiveWorkersTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryAprTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryBlockByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryBlocksArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<BlockOrderByInput>>;
  where?: InputMaybe<BlockWhereInput>;
};

export type QueryBlocksConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<BlockOrderByInput>;
  where?: InputMaybe<BlockWhereInput>;
};

export type QueryCommitmentByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryCommitmentsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<CommitmentOrderByInput>>;
  where?: InputMaybe<CommitmentWhereInput>;
};

export type QueryCommitmentsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<CommitmentOrderByInput>;
  where?: InputMaybe<CommitmentWhereInput>;
};

export type QueryDelegationByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryDelegationRewardByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryDelegationRewardsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationRewardOrderByInput>>;
  where?: InputMaybe<DelegationRewardWhereInput>;
};

export type QueryDelegationRewardsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<DelegationRewardOrderByInput>;
  where?: InputMaybe<DelegationRewardWhereInput>;
};

export type QueryDelegationStatusChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryDelegationStatusChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationStatusChangeOrderByInput>>;
  where?: InputMaybe<DelegationStatusChangeWhereInput>;
};

export type QueryDelegationStatusChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<DelegationStatusChangeOrderByInput>;
  where?: InputMaybe<DelegationStatusChangeWhereInput>;
};

export type QueryDelegationsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationOrderByInput>>;
  where?: InputMaybe<DelegationWhereInput>;
};

export type QueryDelegationsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<DelegationOrderByInput>;
  where?: InputMaybe<DelegationWhereInput>;
};

export type QueryDelegationsTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryDelegatorsTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryEpochByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryEpochesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<EpochOrderByInput>>;
  where?: InputMaybe<EpochWhereInput>;
};

export type QueryEpochesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<EpochOrderByInput>;
  where?: InputMaybe<EpochWhereInput>;
};

export type QueryGatewayByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGatewayStakeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGatewayStakesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayStakeOrderByInput>>;
  where?: InputMaybe<GatewayStakeWhereInput>;
};

export type QueryGatewayStakesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<GatewayStakeOrderByInput>;
  where?: InputMaybe<GatewayStakeWhereInput>;
};

export type QueryGatewayStatusChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGatewayStatusChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayStatusChangeOrderByInput>>;
  where?: InputMaybe<GatewayStatusChangeWhereInput>;
};

export type QueryGatewayStatusChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<GatewayStatusChangeOrderByInput>;
  where?: InputMaybe<GatewayStatusChangeWhereInput>;
};

export type QueryGatewaysArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayOrderByInput>>;
  where?: InputMaybe<GatewayWhereInput>;
};

export type QueryGatewaysConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<GatewayOrderByInput>;
  where?: InputMaybe<GatewayWhereInput>;
};

export type QueryHoldersCountTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryLockedValueTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryQueriesCountTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryRewardTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryServedDataTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QuerySettingsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<SettingsOrderByInput>>;
  where?: InputMaybe<SettingsWhereInput>;
};

export type QuerySettingsByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QuerySettingsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<SettingsOrderByInput>;
  where?: InputMaybe<SettingsWhereInput>;
};

export type QueryStoredDataTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryTemporaryHoldingDataArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TemporaryHoldingDataOrderByInput>>;
  where?: InputMaybe<TemporaryHoldingDataWhereInput>;
};

export type QueryTemporaryHoldingDataByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryTemporaryHoldingDataConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<TemporaryHoldingDataOrderByInput>;
  where?: InputMaybe<TemporaryHoldingDataWhereInput>;
};

export type QueryTransferByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryTransfersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};

export type QueryTransfersByTypeTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryTransfersConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<TransferOrderByInput>;
  where?: InputMaybe<TransferWhereInput>;
};

export type QueryUniqueAccountsTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryUniqueOperatorsTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryUptimeTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryWorkerByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryWorkerMetricsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerMetricsOrderByInput>>;
  where?: InputMaybe<WorkerMetricsWhereInput>;
};

export type QueryWorkerMetricsByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryWorkerMetricsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<WorkerMetricsOrderByInput>;
  where?: InputMaybe<WorkerMetricsWhereInput>;
};

export type QueryWorkerRewardByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryWorkerRewardsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerRewardOrderByInput>>;
  where?: InputMaybe<WorkerRewardWhereInput>;
};

export type QueryWorkerRewardsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<WorkerRewardOrderByInput>;
  where?: InputMaybe<WorkerRewardWhereInput>;
};

export type QueryWorkerSnapshotByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryWorkerSnapshotsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerSnapshotOrderByInput>>;
  where?: InputMaybe<WorkerSnapshotWhereInput>;
};

export type QueryWorkerSnapshotsByDayArgs = {
  from: Scalars["DateTime"]["input"];
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  workerId: Scalars["String"]["input"];
};

export type QueryWorkerSnapshotsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<WorkerSnapshotOrderByInput>;
  where?: InputMaybe<WorkerSnapshotWhereInput>;
};

export type QueryWorkerStatusChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryWorkerStatusChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerStatusChangeOrderByInput>>;
  where?: InputMaybe<WorkerStatusChangeWhereInput>;
};

export type QueryWorkerStatusChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<WorkerStatusChangeOrderByInput>;
  where?: InputMaybe<WorkerStatusChangeWhereInput>;
};

export type QueryWorkersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerOrderByInput>>;
  where?: InputMaybe<WorkerWhereInput>;
};

export type QueryWorkersConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<WorkerOrderByInput>;
  where?: InputMaybe<WorkerWhereInput>;
};

export type RewardEntry = {
  __typename?: "RewardEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<RewardValue>;
};

export type RewardTimeseries = {
  __typename?: "RewardTimeseries";
  data: Array<RewardEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type RewardValue = {
  __typename?: "RewardValue";
  stakerReward: Scalars["BigInt"]["output"];
  workerReward: Scalars["BigInt"]["output"];
};

export type ServedDataEntry = {
  __typename?: "ServedDataEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type ServedDataTimeseries = {
  __typename?: "ServedDataTimeseries";
  data: Array<ServedDataEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Settings = {
  __typename?: "Settings";
  baseApr: Scalars["Float"]["output"];
  bondAmount?: Maybe<Scalars["BigInt"]["output"]>;
  contracts: Contracts;
  currentEpoch?: Maybe<Scalars["Int"]["output"]>;
  delegationLimitCoefficient: Scalars["Float"]["output"];
  epochLength?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["String"]["output"];
  lockPeriod?: Maybe<Scalars["Int"]["output"]>;
  minimalWorkerVersion?: Maybe<Scalars["String"]["output"]>;
  recommendedWorkerVersion?: Maybe<Scalars["String"]["output"]>;
  utilizedStake: Scalars["BigInt"]["output"];
};

export type SettingsConnection = {
  __typename?: "SettingsConnection";
  edges: Array<SettingsEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type SettingsEdge = {
  __typename?: "SettingsEdge";
  cursor: Scalars["String"]["output"];
  node: Settings;
};

export enum SettingsOrderByInput {
  BaseAprAsc = "baseApr_ASC",
  BaseAprAscNullsFirst = "baseApr_ASC_NULLS_FIRST",
  BaseAprAscNullsLast = "baseApr_ASC_NULLS_LAST",
  BaseAprDesc = "baseApr_DESC",
  BaseAprDescNullsFirst = "baseApr_DESC_NULLS_FIRST",
  BaseAprDescNullsLast = "baseApr_DESC_NULLS_LAST",
  BondAmountAsc = "bondAmount_ASC",
  BondAmountAscNullsFirst = "bondAmount_ASC_NULLS_FIRST",
  BondAmountAscNullsLast = "bondAmount_ASC_NULLS_LAST",
  BondAmountDesc = "bondAmount_DESC",
  BondAmountDescNullsFirst = "bondAmount_DESC_NULLS_FIRST",
  BondAmountDescNullsLast = "bondAmount_DESC_NULLS_LAST",
  ContractsDistributedRewardsDistributionAsc = "contracts_distributedRewardsDistribution_ASC",
  ContractsDistributedRewardsDistributionAscNullsFirst = "contracts_distributedRewardsDistribution_ASC_NULLS_FIRST",
  ContractsDistributedRewardsDistributionAscNullsLast = "contracts_distributedRewardsDistribution_ASC_NULLS_LAST",
  ContractsDistributedRewardsDistributionDesc = "contracts_distributedRewardsDistribution_DESC",
  ContractsDistributedRewardsDistributionDescNullsFirst = "contracts_distributedRewardsDistribution_DESC_NULLS_FIRST",
  ContractsDistributedRewardsDistributionDescNullsLast = "contracts_distributedRewardsDistribution_DESC_NULLS_LAST",
  ContractsGatewayRegistryAsc = "contracts_gatewayRegistry_ASC",
  ContractsGatewayRegistryAscNullsFirst = "contracts_gatewayRegistry_ASC_NULLS_FIRST",
  ContractsGatewayRegistryAscNullsLast = "contracts_gatewayRegistry_ASC_NULLS_LAST",
  ContractsGatewayRegistryDesc = "contracts_gatewayRegistry_DESC",
  ContractsGatewayRegistryDescNullsFirst = "contracts_gatewayRegistry_DESC_NULLS_FIRST",
  ContractsGatewayRegistryDescNullsLast = "contracts_gatewayRegistry_DESC_NULLS_LAST",
  ContractsNetworkControllerAsc = "contracts_networkController_ASC",
  ContractsNetworkControllerAscNullsFirst = "contracts_networkController_ASC_NULLS_FIRST",
  ContractsNetworkControllerAscNullsLast = "contracts_networkController_ASC_NULLS_LAST",
  ContractsNetworkControllerDesc = "contracts_networkController_DESC",
  ContractsNetworkControllerDescNullsFirst = "contracts_networkController_DESC_NULLS_FIRST",
  ContractsNetworkControllerDescNullsLast = "contracts_networkController_DESC_NULLS_LAST",
  ContractsRewardCalculationAsc = "contracts_rewardCalculation_ASC",
  ContractsRewardCalculationAscNullsFirst = "contracts_rewardCalculation_ASC_NULLS_FIRST",
  ContractsRewardCalculationAscNullsLast = "contracts_rewardCalculation_ASC_NULLS_LAST",
  ContractsRewardCalculationDesc = "contracts_rewardCalculation_DESC",
  ContractsRewardCalculationDescNullsFirst = "contracts_rewardCalculation_DESC_NULLS_FIRST",
  ContractsRewardCalculationDescNullsLast = "contracts_rewardCalculation_DESC_NULLS_LAST",
  ContractsRewardTreasuryAsc = "contracts_rewardTreasury_ASC",
  ContractsRewardTreasuryAscNullsFirst = "contracts_rewardTreasury_ASC_NULLS_FIRST",
  ContractsRewardTreasuryAscNullsLast = "contracts_rewardTreasury_ASC_NULLS_LAST",
  ContractsRewardTreasuryDesc = "contracts_rewardTreasury_DESC",
  ContractsRewardTreasuryDescNullsFirst = "contracts_rewardTreasury_DESC_NULLS_FIRST",
  ContractsRewardTreasuryDescNullsLast = "contracts_rewardTreasury_DESC_NULLS_LAST",
  ContractsRouterAsc = "contracts_router_ASC",
  ContractsRouterAscNullsFirst = "contracts_router_ASC_NULLS_FIRST",
  ContractsRouterAscNullsLast = "contracts_router_ASC_NULLS_LAST",
  ContractsRouterDesc = "contracts_router_DESC",
  ContractsRouterDescNullsFirst = "contracts_router_DESC_NULLS_FIRST",
  ContractsRouterDescNullsLast = "contracts_router_DESC_NULLS_LAST",
  ContractsSoftCapAsc = "contracts_softCap_ASC",
  ContractsSoftCapAscNullsFirst = "contracts_softCap_ASC_NULLS_FIRST",
  ContractsSoftCapAscNullsLast = "contracts_softCap_ASC_NULLS_LAST",
  ContractsSoftCapDesc = "contracts_softCap_DESC",
  ContractsSoftCapDescNullsFirst = "contracts_softCap_DESC_NULLS_FIRST",
  ContractsSoftCapDescNullsLast = "contracts_softCap_DESC_NULLS_LAST",
  ContractsStakingAsc = "contracts_staking_ASC",
  ContractsStakingAscNullsFirst = "contracts_staking_ASC_NULLS_FIRST",
  ContractsStakingAscNullsLast = "contracts_staking_ASC_NULLS_LAST",
  ContractsStakingDesc = "contracts_staking_DESC",
  ContractsStakingDescNullsFirst = "contracts_staking_DESC_NULLS_FIRST",
  ContractsStakingDescNullsLast = "contracts_staking_DESC_NULLS_LAST",
  ContractsTemporaryHoldingFactoryAsc = "contracts_temporaryHoldingFactory_ASC",
  ContractsTemporaryHoldingFactoryAscNullsFirst = "contracts_temporaryHoldingFactory_ASC_NULLS_FIRST",
  ContractsTemporaryHoldingFactoryAscNullsLast = "contracts_temporaryHoldingFactory_ASC_NULLS_LAST",
  ContractsTemporaryHoldingFactoryDesc = "contracts_temporaryHoldingFactory_DESC",
  ContractsTemporaryHoldingFactoryDescNullsFirst = "contracts_temporaryHoldingFactory_DESC_NULLS_FIRST",
  ContractsTemporaryHoldingFactoryDescNullsLast = "contracts_temporaryHoldingFactory_DESC_NULLS_LAST",
  ContractsVestingFactoryAsc = "contracts_vestingFactory_ASC",
  ContractsVestingFactoryAscNullsFirst = "contracts_vestingFactory_ASC_NULLS_FIRST",
  ContractsVestingFactoryAscNullsLast = "contracts_vestingFactory_ASC_NULLS_LAST",
  ContractsVestingFactoryDesc = "contracts_vestingFactory_DESC",
  ContractsVestingFactoryDescNullsFirst = "contracts_vestingFactory_DESC_NULLS_FIRST",
  ContractsVestingFactoryDescNullsLast = "contracts_vestingFactory_DESC_NULLS_LAST",
  ContractsWorkerRegistrationAsc = "contracts_workerRegistration_ASC",
  ContractsWorkerRegistrationAscNullsFirst = "contracts_workerRegistration_ASC_NULLS_FIRST",
  ContractsWorkerRegistrationAscNullsLast = "contracts_workerRegistration_ASC_NULLS_LAST",
  ContractsWorkerRegistrationDesc = "contracts_workerRegistration_DESC",
  ContractsWorkerRegistrationDescNullsFirst = "contracts_workerRegistration_DESC_NULLS_FIRST",
  ContractsWorkerRegistrationDescNullsLast = "contracts_workerRegistration_DESC_NULLS_LAST",
  CurrentEpochAsc = "currentEpoch_ASC",
  CurrentEpochAscNullsFirst = "currentEpoch_ASC_NULLS_FIRST",
  CurrentEpochAscNullsLast = "currentEpoch_ASC_NULLS_LAST",
  CurrentEpochDesc = "currentEpoch_DESC",
  CurrentEpochDescNullsFirst = "currentEpoch_DESC_NULLS_FIRST",
  CurrentEpochDescNullsLast = "currentEpoch_DESC_NULLS_LAST",
  DelegationLimitCoefficientAsc = "delegationLimitCoefficient_ASC",
  DelegationLimitCoefficientAscNullsFirst = "delegationLimitCoefficient_ASC_NULLS_FIRST",
  DelegationLimitCoefficientAscNullsLast = "delegationLimitCoefficient_ASC_NULLS_LAST",
  DelegationLimitCoefficientDesc = "delegationLimitCoefficient_DESC",
  DelegationLimitCoefficientDescNullsFirst = "delegationLimitCoefficient_DESC_NULLS_FIRST",
  DelegationLimitCoefficientDescNullsLast = "delegationLimitCoefficient_DESC_NULLS_LAST",
  EpochLengthAsc = "epochLength_ASC",
  EpochLengthAscNullsFirst = "epochLength_ASC_NULLS_FIRST",
  EpochLengthAscNullsLast = "epochLength_ASC_NULLS_LAST",
  EpochLengthDesc = "epochLength_DESC",
  EpochLengthDescNullsFirst = "epochLength_DESC_NULLS_FIRST",
  EpochLengthDescNullsLast = "epochLength_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  LockPeriodAsc = "lockPeriod_ASC",
  LockPeriodAscNullsFirst = "lockPeriod_ASC_NULLS_FIRST",
  LockPeriodAscNullsLast = "lockPeriod_ASC_NULLS_LAST",
  LockPeriodDesc = "lockPeriod_DESC",
  LockPeriodDescNullsFirst = "lockPeriod_DESC_NULLS_FIRST",
  LockPeriodDescNullsLast = "lockPeriod_DESC_NULLS_LAST",
  MinimalWorkerVersionAsc = "minimalWorkerVersion_ASC",
  MinimalWorkerVersionAscNullsFirst = "minimalWorkerVersion_ASC_NULLS_FIRST",
  MinimalWorkerVersionAscNullsLast = "minimalWorkerVersion_ASC_NULLS_LAST",
  MinimalWorkerVersionDesc = "minimalWorkerVersion_DESC",
  MinimalWorkerVersionDescNullsFirst = "minimalWorkerVersion_DESC_NULLS_FIRST",
  MinimalWorkerVersionDescNullsLast = "minimalWorkerVersion_DESC_NULLS_LAST",
  RecommendedWorkerVersionAsc = "recommendedWorkerVersion_ASC",
  RecommendedWorkerVersionAscNullsFirst = "recommendedWorkerVersion_ASC_NULLS_FIRST",
  RecommendedWorkerVersionAscNullsLast = "recommendedWorkerVersion_ASC_NULLS_LAST",
  RecommendedWorkerVersionDesc = "recommendedWorkerVersion_DESC",
  RecommendedWorkerVersionDescNullsFirst = "recommendedWorkerVersion_DESC_NULLS_FIRST",
  RecommendedWorkerVersionDescNullsLast = "recommendedWorkerVersion_DESC_NULLS_LAST",
  UtilizedStakeAsc = "utilizedStake_ASC",
  UtilizedStakeAscNullsFirst = "utilizedStake_ASC_NULLS_FIRST",
  UtilizedStakeAscNullsLast = "utilizedStake_ASC_NULLS_LAST",
  UtilizedStakeDesc = "utilizedStake_DESC",
  UtilizedStakeDescNullsFirst = "utilizedStake_DESC_NULLS_FIRST",
  UtilizedStakeDescNullsLast = "utilizedStake_DESC_NULLS_LAST",
}

export type SettingsWhereInput = {
  AND?: InputMaybe<Array<SettingsWhereInput>>;
  OR?: InputMaybe<Array<SettingsWhereInput>>;
  baseApr_eq?: InputMaybe<Scalars["Float"]["input"]>;
  baseApr_gt?: InputMaybe<Scalars["Float"]["input"]>;
  baseApr_gte?: InputMaybe<Scalars["Float"]["input"]>;
  baseApr_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  baseApr_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  baseApr_lt?: InputMaybe<Scalars["Float"]["input"]>;
  baseApr_lte?: InputMaybe<Scalars["Float"]["input"]>;
  baseApr_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  baseApr_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  bondAmount_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  bondAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  bondAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  bondAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bondAmount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  bondAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  bondAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  bondAmount_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  bondAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  contracts?: InputMaybe<ContractsWhereInput>;
  contracts_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  currentEpoch_eq?: InputMaybe<Scalars["Int"]["input"]>;
  currentEpoch_gt?: InputMaybe<Scalars["Int"]["input"]>;
  currentEpoch_gte?: InputMaybe<Scalars["Int"]["input"]>;
  currentEpoch_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  currentEpoch_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  currentEpoch_lt?: InputMaybe<Scalars["Int"]["input"]>;
  currentEpoch_lte?: InputMaybe<Scalars["Int"]["input"]>;
  currentEpoch_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  currentEpoch_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegationLimitCoefficient_eq?: InputMaybe<Scalars["Float"]["input"]>;
  delegationLimitCoefficient_gt?: InputMaybe<Scalars["Float"]["input"]>;
  delegationLimitCoefficient_gte?: InputMaybe<Scalars["Float"]["input"]>;
  delegationLimitCoefficient_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  delegationLimitCoefficient_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  delegationLimitCoefficient_lt?: InputMaybe<Scalars["Float"]["input"]>;
  delegationLimitCoefficient_lte?: InputMaybe<Scalars["Float"]["input"]>;
  delegationLimitCoefficient_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  delegationLimitCoefficient_not_in?: InputMaybe<
    Array<Scalars["Float"]["input"]>
  >;
  epochLength_eq?: InputMaybe<Scalars["Int"]["input"]>;
  epochLength_gt?: InputMaybe<Scalars["Int"]["input"]>;
  epochLength_gte?: InputMaybe<Scalars["Int"]["input"]>;
  epochLength_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  epochLength_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  epochLength_lt?: InputMaybe<Scalars["Int"]["input"]>;
  epochLength_lte?: InputMaybe<Scalars["Int"]["input"]>;
  epochLength_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  epochLength_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  lockPeriod_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockPeriod_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockPeriod_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockPeriod_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockPeriod_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockPeriod_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockPeriod_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockPeriod_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockPeriod_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  minimalWorkerVersion_contains?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  minimalWorkerVersion_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_eq?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_gt?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_gte?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  minimalWorkerVersion_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  minimalWorkerVersion_lt?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_lte?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  minimalWorkerVersion_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  minimalWorkerVersion_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  minimalWorkerVersion_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_contains?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  recommendedWorkerVersion_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_eq?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_gt?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_gte?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  recommendedWorkerVersion_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  recommendedWorkerVersion_lt?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_lte?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_not_contains?: InputMaybe<
    Scalars["String"]["input"]
  >;
  recommendedWorkerVersion_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  recommendedWorkerVersion_not_endsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  recommendedWorkerVersion_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  recommendedWorkerVersion_not_in?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  recommendedWorkerVersion_not_startsWith?: InputMaybe<
    Scalars["String"]["input"]
  >;
  recommendedWorkerVersion_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  utilizedStake_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  utilizedStake_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  utilizedStake_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  utilizedStake_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  utilizedStake_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  utilizedStake_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  utilizedStake_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  utilizedStake_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  utilizedStake_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export type SquidStatus = {
  __typename?: "SquidStatus";
  finalizedHeight: Scalars["Float"]["output"];
  height: Scalars["Float"]["output"];
};

export type StoredDataEntry = {
  __typename?: "StoredDataEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type StoredDataTimeseries = {
  __typename?: "StoredDataTimeseries";
  data: Array<StoredDataEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type TemporaryHoldingData = {
  __typename?: "TemporaryHoldingData";
  account: Account;
  admin: Account;
  beneficiary: Account;
  id: Scalars["String"]["output"];
  locked: Scalars["Boolean"]["output"];
  unlockedAt: Scalars["DateTime"]["output"];
};

export type TemporaryHoldingDataConnection = {
  __typename?: "TemporaryHoldingDataConnection";
  edges: Array<TemporaryHoldingDataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type TemporaryHoldingDataEdge = {
  __typename?: "TemporaryHoldingDataEdge";
  cursor: Scalars["String"]["output"];
  node: TemporaryHoldingData;
};

export enum TemporaryHoldingDataOrderByInput {
  AccountBalanceAsc = "account_balance_ASC",
  AccountBalanceAscNullsFirst = "account_balance_ASC_NULLS_FIRST",
  AccountBalanceAscNullsLast = "account_balance_ASC_NULLS_LAST",
  AccountBalanceDesc = "account_balance_DESC",
  AccountBalanceDescNullsFirst = "account_balance_DESC_NULLS_FIRST",
  AccountBalanceDescNullsLast = "account_balance_DESC_NULLS_LAST",
  AccountClaimableDelegationCountAsc = "account_claimableDelegationCount_ASC",
  AccountClaimableDelegationCountAscNullsFirst = "account_claimableDelegationCount_ASC_NULLS_FIRST",
  AccountClaimableDelegationCountAscNullsLast = "account_claimableDelegationCount_ASC_NULLS_LAST",
  AccountClaimableDelegationCountDesc = "account_claimableDelegationCount_DESC",
  AccountClaimableDelegationCountDescNullsFirst = "account_claimableDelegationCount_DESC_NULLS_FIRST",
  AccountClaimableDelegationCountDescNullsLast = "account_claimableDelegationCount_DESC_NULLS_LAST",
  AccountIdAsc = "account_id_ASC",
  AccountIdAscNullsFirst = "account_id_ASC_NULLS_FIRST",
  AccountIdAscNullsLast = "account_id_ASC_NULLS_LAST",
  AccountIdDesc = "account_id_DESC",
  AccountIdDescNullsFirst = "account_id_DESC_NULLS_FIRST",
  AccountIdDescNullsLast = "account_id_DESC_NULLS_LAST",
  AccountTypeAsc = "account_type_ASC",
  AccountTypeAscNullsFirst = "account_type_ASC_NULLS_FIRST",
  AccountTypeAscNullsLast = "account_type_ASC_NULLS_LAST",
  AccountTypeDesc = "account_type_DESC",
  AccountTypeDescNullsFirst = "account_type_DESC_NULLS_FIRST",
  AccountTypeDescNullsLast = "account_type_DESC_NULLS_LAST",
  AdminBalanceAsc = "admin_balance_ASC",
  AdminBalanceAscNullsFirst = "admin_balance_ASC_NULLS_FIRST",
  AdminBalanceAscNullsLast = "admin_balance_ASC_NULLS_LAST",
  AdminBalanceDesc = "admin_balance_DESC",
  AdminBalanceDescNullsFirst = "admin_balance_DESC_NULLS_FIRST",
  AdminBalanceDescNullsLast = "admin_balance_DESC_NULLS_LAST",
  AdminClaimableDelegationCountAsc = "admin_claimableDelegationCount_ASC",
  AdminClaimableDelegationCountAscNullsFirst = "admin_claimableDelegationCount_ASC_NULLS_FIRST",
  AdminClaimableDelegationCountAscNullsLast = "admin_claimableDelegationCount_ASC_NULLS_LAST",
  AdminClaimableDelegationCountDesc = "admin_claimableDelegationCount_DESC",
  AdminClaimableDelegationCountDescNullsFirst = "admin_claimableDelegationCount_DESC_NULLS_FIRST",
  AdminClaimableDelegationCountDescNullsLast = "admin_claimableDelegationCount_DESC_NULLS_LAST",
  AdminIdAsc = "admin_id_ASC",
  AdminIdAscNullsFirst = "admin_id_ASC_NULLS_FIRST",
  AdminIdAscNullsLast = "admin_id_ASC_NULLS_LAST",
  AdminIdDesc = "admin_id_DESC",
  AdminIdDescNullsFirst = "admin_id_DESC_NULLS_FIRST",
  AdminIdDescNullsLast = "admin_id_DESC_NULLS_LAST",
  AdminTypeAsc = "admin_type_ASC",
  AdminTypeAscNullsFirst = "admin_type_ASC_NULLS_FIRST",
  AdminTypeAscNullsLast = "admin_type_ASC_NULLS_LAST",
  AdminTypeDesc = "admin_type_DESC",
  AdminTypeDescNullsFirst = "admin_type_DESC_NULLS_FIRST",
  AdminTypeDescNullsLast = "admin_type_DESC_NULLS_LAST",
  BeneficiaryBalanceAsc = "beneficiary_balance_ASC",
  BeneficiaryBalanceAscNullsFirst = "beneficiary_balance_ASC_NULLS_FIRST",
  BeneficiaryBalanceAscNullsLast = "beneficiary_balance_ASC_NULLS_LAST",
  BeneficiaryBalanceDesc = "beneficiary_balance_DESC",
  BeneficiaryBalanceDescNullsFirst = "beneficiary_balance_DESC_NULLS_FIRST",
  BeneficiaryBalanceDescNullsLast = "beneficiary_balance_DESC_NULLS_LAST",
  BeneficiaryClaimableDelegationCountAsc = "beneficiary_claimableDelegationCount_ASC",
  BeneficiaryClaimableDelegationCountAscNullsFirst = "beneficiary_claimableDelegationCount_ASC_NULLS_FIRST",
  BeneficiaryClaimableDelegationCountAscNullsLast = "beneficiary_claimableDelegationCount_ASC_NULLS_LAST",
  BeneficiaryClaimableDelegationCountDesc = "beneficiary_claimableDelegationCount_DESC",
  BeneficiaryClaimableDelegationCountDescNullsFirst = "beneficiary_claimableDelegationCount_DESC_NULLS_FIRST",
  BeneficiaryClaimableDelegationCountDescNullsLast = "beneficiary_claimableDelegationCount_DESC_NULLS_LAST",
  BeneficiaryIdAsc = "beneficiary_id_ASC",
  BeneficiaryIdAscNullsFirst = "beneficiary_id_ASC_NULLS_FIRST",
  BeneficiaryIdAscNullsLast = "beneficiary_id_ASC_NULLS_LAST",
  BeneficiaryIdDesc = "beneficiary_id_DESC",
  BeneficiaryIdDescNullsFirst = "beneficiary_id_DESC_NULLS_FIRST",
  BeneficiaryIdDescNullsLast = "beneficiary_id_DESC_NULLS_LAST",
  BeneficiaryTypeAsc = "beneficiary_type_ASC",
  BeneficiaryTypeAscNullsFirst = "beneficiary_type_ASC_NULLS_FIRST",
  BeneficiaryTypeAscNullsLast = "beneficiary_type_ASC_NULLS_LAST",
  BeneficiaryTypeDesc = "beneficiary_type_DESC",
  BeneficiaryTypeDescNullsFirst = "beneficiary_type_DESC_NULLS_FIRST",
  BeneficiaryTypeDescNullsLast = "beneficiary_type_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  LockedAsc = "locked_ASC",
  LockedAscNullsFirst = "locked_ASC_NULLS_FIRST",
  LockedAscNullsLast = "locked_ASC_NULLS_LAST",
  LockedDesc = "locked_DESC",
  LockedDescNullsFirst = "locked_DESC_NULLS_FIRST",
  LockedDescNullsLast = "locked_DESC_NULLS_LAST",
  UnlockedAtAsc = "unlockedAt_ASC",
  UnlockedAtAscNullsFirst = "unlockedAt_ASC_NULLS_FIRST",
  UnlockedAtAscNullsLast = "unlockedAt_ASC_NULLS_LAST",
  UnlockedAtDesc = "unlockedAt_DESC",
  UnlockedAtDescNullsFirst = "unlockedAt_DESC_NULLS_FIRST",
  UnlockedAtDescNullsLast = "unlockedAt_DESC_NULLS_LAST",
}

export type TemporaryHoldingDataWhereInput = {
  AND?: InputMaybe<Array<TemporaryHoldingDataWhereInput>>;
  OR?: InputMaybe<Array<TemporaryHoldingDataWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  admin?: InputMaybe<AccountWhereInput>;
  admin_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  beneficiary?: InputMaybe<AccountWhereInput>;
  beneficiary_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  locked_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  unlockedAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  unlockedAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  unlockedAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  unlockedAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  unlockedAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  unlockedAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  unlockedAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  unlockedAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  unlockedAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type Transfer = {
  __typename?: "Transfer";
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  delegation?: Maybe<Delegation>;
  from: Account;
  gatewayStake?: Maybe<GatewayStake>;
  id: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  to: Account;
  txHash: Scalars["String"]["output"];
  type: TransferType;
  vesting?: Maybe<Account>;
  worker?: Maybe<Worker>;
};

export type TransferCountByType = {
  __typename?: "TransferCountByType";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<TransferCountByTypeValue>;
};

export type TransferCountByTypeValue = {
  __typename?: "TransferCountByTypeValue";
  deposit: Scalars["Float"]["output"];
  release: Scalars["Float"]["output"];
  reward: Scalars["Float"]["output"];
  transfer: Scalars["Float"]["output"];
  withdraw: Scalars["Float"]["output"];
};

export enum TransferDirection {
  From = "FROM",
  To = "TO",
}

export type TransferEdge = {
  __typename?: "TransferEdge";
  cursor: Scalars["String"]["output"];
  node: Transfer;
};

export enum TransferOrderByInput {
  AmountAsc = "amount_ASC",
  AmountAscNullsFirst = "amount_ASC_NULLS_FIRST",
  AmountAscNullsLast = "amount_ASC_NULLS_LAST",
  AmountDesc = "amount_DESC",
  AmountDescNullsFirst = "amount_DESC_NULLS_FIRST",
  AmountDescNullsLast = "amount_DESC_NULLS_LAST",
  BlockNumberAsc = "blockNumber_ASC",
  BlockNumberAscNullsFirst = "blockNumber_ASC_NULLS_FIRST",
  BlockNumberAscNullsLast = "blockNumber_ASC_NULLS_LAST",
  BlockNumberDesc = "blockNumber_DESC",
  BlockNumberDescNullsFirst = "blockNumber_DESC_NULLS_FIRST",
  BlockNumberDescNullsLast = "blockNumber_DESC_NULLS_LAST",
  DelegationClaimableRewardAsc = "delegation_claimableReward_ASC",
  DelegationClaimableRewardAscNullsFirst = "delegation_claimableReward_ASC_NULLS_FIRST",
  DelegationClaimableRewardAscNullsLast = "delegation_claimableReward_ASC_NULLS_LAST",
  DelegationClaimableRewardDesc = "delegation_claimableReward_DESC",
  DelegationClaimableRewardDescNullsFirst = "delegation_claimableReward_DESC_NULLS_FIRST",
  DelegationClaimableRewardDescNullsLast = "delegation_claimableReward_DESC_NULLS_LAST",
  DelegationClaimedRewardAsc = "delegation_claimedReward_ASC",
  DelegationClaimedRewardAscNullsFirst = "delegation_claimedReward_ASC_NULLS_FIRST",
  DelegationClaimedRewardAscNullsLast = "delegation_claimedReward_ASC_NULLS_LAST",
  DelegationClaimedRewardDesc = "delegation_claimedReward_DESC",
  DelegationClaimedRewardDescNullsFirst = "delegation_claimedReward_DESC_NULLS_FIRST",
  DelegationClaimedRewardDescNullsLast = "delegation_claimedReward_DESC_NULLS_LAST",
  DelegationDepositAsc = "delegation_deposit_ASC",
  DelegationDepositAscNullsFirst = "delegation_deposit_ASC_NULLS_FIRST",
  DelegationDepositAscNullsLast = "delegation_deposit_ASC_NULLS_LAST",
  DelegationDepositDesc = "delegation_deposit_DESC",
  DelegationDepositDescNullsFirst = "delegation_deposit_DESC_NULLS_FIRST",
  DelegationDepositDescNullsLast = "delegation_deposit_DESC_NULLS_LAST",
  DelegationIdAsc = "delegation_id_ASC",
  DelegationIdAscNullsFirst = "delegation_id_ASC_NULLS_FIRST",
  DelegationIdAscNullsLast = "delegation_id_ASC_NULLS_LAST",
  DelegationIdDesc = "delegation_id_DESC",
  DelegationIdDescNullsFirst = "delegation_id_DESC_NULLS_FIRST",
  DelegationIdDescNullsLast = "delegation_id_DESC_NULLS_LAST",
  DelegationLockEndAsc = "delegation_lockEnd_ASC",
  DelegationLockEndAscNullsFirst = "delegation_lockEnd_ASC_NULLS_FIRST",
  DelegationLockEndAscNullsLast = "delegation_lockEnd_ASC_NULLS_LAST",
  DelegationLockEndDesc = "delegation_lockEnd_DESC",
  DelegationLockEndDescNullsFirst = "delegation_lockEnd_DESC_NULLS_FIRST",
  DelegationLockEndDescNullsLast = "delegation_lockEnd_DESC_NULLS_LAST",
  DelegationLockStartAsc = "delegation_lockStart_ASC",
  DelegationLockStartAscNullsFirst = "delegation_lockStart_ASC_NULLS_FIRST",
  DelegationLockStartAscNullsLast = "delegation_lockStart_ASC_NULLS_LAST",
  DelegationLockStartDesc = "delegation_lockStart_DESC",
  DelegationLockStartDescNullsFirst = "delegation_lockStart_DESC_NULLS_FIRST",
  DelegationLockStartDescNullsLast = "delegation_lockStart_DESC_NULLS_LAST",
  DelegationLockedAsc = "delegation_locked_ASC",
  DelegationLockedAscNullsFirst = "delegation_locked_ASC_NULLS_FIRST",
  DelegationLockedAscNullsLast = "delegation_locked_ASC_NULLS_LAST",
  DelegationLockedDesc = "delegation_locked_DESC",
  DelegationLockedDescNullsFirst = "delegation_locked_DESC_NULLS_FIRST",
  DelegationLockedDescNullsLast = "delegation_locked_DESC_NULLS_LAST",
  DelegationStatusAsc = "delegation_status_ASC",
  DelegationStatusAscNullsFirst = "delegation_status_ASC_NULLS_FIRST",
  DelegationStatusAscNullsLast = "delegation_status_ASC_NULLS_LAST",
  DelegationStatusDesc = "delegation_status_DESC",
  DelegationStatusDescNullsFirst = "delegation_status_DESC_NULLS_FIRST",
  DelegationStatusDescNullsLast = "delegation_status_DESC_NULLS_LAST",
  FromBalanceAsc = "from_balance_ASC",
  FromBalanceAscNullsFirst = "from_balance_ASC_NULLS_FIRST",
  FromBalanceAscNullsLast = "from_balance_ASC_NULLS_LAST",
  FromBalanceDesc = "from_balance_DESC",
  FromBalanceDescNullsFirst = "from_balance_DESC_NULLS_FIRST",
  FromBalanceDescNullsLast = "from_balance_DESC_NULLS_LAST",
  FromClaimableDelegationCountAsc = "from_claimableDelegationCount_ASC",
  FromClaimableDelegationCountAscNullsFirst = "from_claimableDelegationCount_ASC_NULLS_FIRST",
  FromClaimableDelegationCountAscNullsLast = "from_claimableDelegationCount_ASC_NULLS_LAST",
  FromClaimableDelegationCountDesc = "from_claimableDelegationCount_DESC",
  FromClaimableDelegationCountDescNullsFirst = "from_claimableDelegationCount_DESC_NULLS_FIRST",
  FromClaimableDelegationCountDescNullsLast = "from_claimableDelegationCount_DESC_NULLS_LAST",
  FromIdAsc = "from_id_ASC",
  FromIdAscNullsFirst = "from_id_ASC_NULLS_FIRST",
  FromIdAscNullsLast = "from_id_ASC_NULLS_LAST",
  FromIdDesc = "from_id_DESC",
  FromIdDescNullsFirst = "from_id_DESC_NULLS_FIRST",
  FromIdDescNullsLast = "from_id_DESC_NULLS_LAST",
  FromTypeAsc = "from_type_ASC",
  FromTypeAscNullsFirst = "from_type_ASC_NULLS_FIRST",
  FromTypeAscNullsLast = "from_type_ASC_NULLS_LAST",
  FromTypeDesc = "from_type_DESC",
  FromTypeDescNullsFirst = "from_type_DESC_NULLS_FIRST",
  FromTypeDescNullsLast = "from_type_DESC_NULLS_LAST",
  GatewayStakeAmountAsc = "gatewayStake_amount_ASC",
  GatewayStakeAmountAscNullsFirst = "gatewayStake_amount_ASC_NULLS_FIRST",
  GatewayStakeAmountAscNullsLast = "gatewayStake_amount_ASC_NULLS_LAST",
  GatewayStakeAmountDesc = "gatewayStake_amount_DESC",
  GatewayStakeAmountDescNullsFirst = "gatewayStake_amount_DESC_NULLS_FIRST",
  GatewayStakeAmountDescNullsLast = "gatewayStake_amount_DESC_NULLS_LAST",
  GatewayStakeAutoExtensionAsc = "gatewayStake_autoExtension_ASC",
  GatewayStakeAutoExtensionAscNullsFirst = "gatewayStake_autoExtension_ASC_NULLS_FIRST",
  GatewayStakeAutoExtensionAscNullsLast = "gatewayStake_autoExtension_ASC_NULLS_LAST",
  GatewayStakeAutoExtensionDesc = "gatewayStake_autoExtension_DESC",
  GatewayStakeAutoExtensionDescNullsFirst = "gatewayStake_autoExtension_DESC_NULLS_FIRST",
  GatewayStakeAutoExtensionDescNullsLast = "gatewayStake_autoExtension_DESC_NULLS_LAST",
  GatewayStakeComputationUnitsPendingAsc = "gatewayStake_computationUnitsPending_ASC",
  GatewayStakeComputationUnitsPendingAscNullsFirst = "gatewayStake_computationUnitsPending_ASC_NULLS_FIRST",
  GatewayStakeComputationUnitsPendingAscNullsLast = "gatewayStake_computationUnitsPending_ASC_NULLS_LAST",
  GatewayStakeComputationUnitsPendingDesc = "gatewayStake_computationUnitsPending_DESC",
  GatewayStakeComputationUnitsPendingDescNullsFirst = "gatewayStake_computationUnitsPending_DESC_NULLS_FIRST",
  GatewayStakeComputationUnitsPendingDescNullsLast = "gatewayStake_computationUnitsPending_DESC_NULLS_LAST",
  GatewayStakeComputationUnitsAsc = "gatewayStake_computationUnits_ASC",
  GatewayStakeComputationUnitsAscNullsFirst = "gatewayStake_computationUnits_ASC_NULLS_FIRST",
  GatewayStakeComputationUnitsAscNullsLast = "gatewayStake_computationUnits_ASC_NULLS_LAST",
  GatewayStakeComputationUnitsDesc = "gatewayStake_computationUnits_DESC",
  GatewayStakeComputationUnitsDescNullsFirst = "gatewayStake_computationUnits_DESC_NULLS_FIRST",
  GatewayStakeComputationUnitsDescNullsLast = "gatewayStake_computationUnits_DESC_NULLS_LAST",
  GatewayStakeIdAsc = "gatewayStake_id_ASC",
  GatewayStakeIdAscNullsFirst = "gatewayStake_id_ASC_NULLS_FIRST",
  GatewayStakeIdAscNullsLast = "gatewayStake_id_ASC_NULLS_LAST",
  GatewayStakeIdDesc = "gatewayStake_id_DESC",
  GatewayStakeIdDescNullsFirst = "gatewayStake_id_DESC_NULLS_FIRST",
  GatewayStakeIdDescNullsLast = "gatewayStake_id_DESC_NULLS_LAST",
  GatewayStakeLockEndAsc = "gatewayStake_lockEnd_ASC",
  GatewayStakeLockEndAscNullsFirst = "gatewayStake_lockEnd_ASC_NULLS_FIRST",
  GatewayStakeLockEndAscNullsLast = "gatewayStake_lockEnd_ASC_NULLS_LAST",
  GatewayStakeLockEndDesc = "gatewayStake_lockEnd_DESC",
  GatewayStakeLockEndDescNullsFirst = "gatewayStake_lockEnd_DESC_NULLS_FIRST",
  GatewayStakeLockEndDescNullsLast = "gatewayStake_lockEnd_DESC_NULLS_LAST",
  GatewayStakeLockStartAsc = "gatewayStake_lockStart_ASC",
  GatewayStakeLockStartAscNullsFirst = "gatewayStake_lockStart_ASC_NULLS_FIRST",
  GatewayStakeLockStartAscNullsLast = "gatewayStake_lockStart_ASC_NULLS_LAST",
  GatewayStakeLockStartDesc = "gatewayStake_lockStart_DESC",
  GatewayStakeLockStartDescNullsFirst = "gatewayStake_lockStart_DESC_NULLS_FIRST",
  GatewayStakeLockStartDescNullsLast = "gatewayStake_lockStart_DESC_NULLS_LAST",
  GatewayStakeLockedAsc = "gatewayStake_locked_ASC",
  GatewayStakeLockedAscNullsFirst = "gatewayStake_locked_ASC_NULLS_FIRST",
  GatewayStakeLockedAscNullsLast = "gatewayStake_locked_ASC_NULLS_LAST",
  GatewayStakeLockedDesc = "gatewayStake_locked_DESC",
  GatewayStakeLockedDescNullsFirst = "gatewayStake_locked_DESC_NULLS_FIRST",
  GatewayStakeLockedDescNullsLast = "gatewayStake_locked_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  ToBalanceAsc = "to_balance_ASC",
  ToBalanceAscNullsFirst = "to_balance_ASC_NULLS_FIRST",
  ToBalanceAscNullsLast = "to_balance_ASC_NULLS_LAST",
  ToBalanceDesc = "to_balance_DESC",
  ToBalanceDescNullsFirst = "to_balance_DESC_NULLS_FIRST",
  ToBalanceDescNullsLast = "to_balance_DESC_NULLS_LAST",
  ToClaimableDelegationCountAsc = "to_claimableDelegationCount_ASC",
  ToClaimableDelegationCountAscNullsFirst = "to_claimableDelegationCount_ASC_NULLS_FIRST",
  ToClaimableDelegationCountAscNullsLast = "to_claimableDelegationCount_ASC_NULLS_LAST",
  ToClaimableDelegationCountDesc = "to_claimableDelegationCount_DESC",
  ToClaimableDelegationCountDescNullsFirst = "to_claimableDelegationCount_DESC_NULLS_FIRST",
  ToClaimableDelegationCountDescNullsLast = "to_claimableDelegationCount_DESC_NULLS_LAST",
  ToIdAsc = "to_id_ASC",
  ToIdAscNullsFirst = "to_id_ASC_NULLS_FIRST",
  ToIdAscNullsLast = "to_id_ASC_NULLS_LAST",
  ToIdDesc = "to_id_DESC",
  ToIdDescNullsFirst = "to_id_DESC_NULLS_FIRST",
  ToIdDescNullsLast = "to_id_DESC_NULLS_LAST",
  ToTypeAsc = "to_type_ASC",
  ToTypeAscNullsFirst = "to_type_ASC_NULLS_FIRST",
  ToTypeAscNullsLast = "to_type_ASC_NULLS_LAST",
  ToTypeDesc = "to_type_DESC",
  ToTypeDescNullsFirst = "to_type_DESC_NULLS_FIRST",
  ToTypeDescNullsLast = "to_type_DESC_NULLS_LAST",
  TxHashAsc = "txHash_ASC",
  TxHashAscNullsFirst = "txHash_ASC_NULLS_FIRST",
  TxHashAscNullsLast = "txHash_ASC_NULLS_LAST",
  TxHashDesc = "txHash_DESC",
  TxHashDescNullsFirst = "txHash_DESC_NULLS_FIRST",
  TxHashDescNullsLast = "txHash_DESC_NULLS_LAST",
  TypeAsc = "type_ASC",
  TypeAscNullsFirst = "type_ASC_NULLS_FIRST",
  TypeAscNullsLast = "type_ASC_NULLS_LAST",
  TypeDesc = "type_DESC",
  TypeDescNullsFirst = "type_DESC_NULLS_FIRST",
  TypeDescNullsLast = "type_DESC_NULLS_LAST",
  VestingBalanceAsc = "vesting_balance_ASC",
  VestingBalanceAscNullsFirst = "vesting_balance_ASC_NULLS_FIRST",
  VestingBalanceAscNullsLast = "vesting_balance_ASC_NULLS_LAST",
  VestingBalanceDesc = "vesting_balance_DESC",
  VestingBalanceDescNullsFirst = "vesting_balance_DESC_NULLS_FIRST",
  VestingBalanceDescNullsLast = "vesting_balance_DESC_NULLS_LAST",
  VestingClaimableDelegationCountAsc = "vesting_claimableDelegationCount_ASC",
  VestingClaimableDelegationCountAscNullsFirst = "vesting_claimableDelegationCount_ASC_NULLS_FIRST",
  VestingClaimableDelegationCountAscNullsLast = "vesting_claimableDelegationCount_ASC_NULLS_LAST",
  VestingClaimableDelegationCountDesc = "vesting_claimableDelegationCount_DESC",
  VestingClaimableDelegationCountDescNullsFirst = "vesting_claimableDelegationCount_DESC_NULLS_FIRST",
  VestingClaimableDelegationCountDescNullsLast = "vesting_claimableDelegationCount_DESC_NULLS_LAST",
  VestingIdAsc = "vesting_id_ASC",
  VestingIdAscNullsFirst = "vesting_id_ASC_NULLS_FIRST",
  VestingIdAscNullsLast = "vesting_id_ASC_NULLS_LAST",
  VestingIdDesc = "vesting_id_DESC",
  VestingIdDescNullsFirst = "vesting_id_DESC_NULLS_FIRST",
  VestingIdDescNullsLast = "vesting_id_DESC_NULLS_LAST",
  VestingTypeAsc = "vesting_type_ASC",
  VestingTypeAscNullsFirst = "vesting_type_ASC_NULLS_FIRST",
  VestingTypeAscNullsLast = "vesting_type_ASC_NULLS_LAST",
  VestingTypeDesc = "vesting_type_DESC",
  VestingTypeDescNullsFirst = "vesting_type_DESC_NULLS_FIRST",
  VestingTypeDescNullsLast = "vesting_type_DESC_NULLS_LAST",
  WorkerAprAsc = "worker_apr_ASC",
  WorkerAprAscNullsFirst = "worker_apr_ASC_NULLS_FIRST",
  WorkerAprAscNullsLast = "worker_apr_ASC_NULLS_LAST",
  WorkerAprDesc = "worker_apr_DESC",
  WorkerAprDescNullsFirst = "worker_apr_DESC_NULLS_FIRST",
  WorkerAprDescNullsLast = "worker_apr_DESC_NULLS_LAST",
  WorkerBondAsc = "worker_bond_ASC",
  WorkerBondAscNullsFirst = "worker_bond_ASC_NULLS_FIRST",
  WorkerBondAscNullsLast = "worker_bond_ASC_NULLS_LAST",
  WorkerBondDesc = "worker_bond_DESC",
  WorkerBondDescNullsFirst = "worker_bond_DESC_NULLS_FIRST",
  WorkerBondDescNullsLast = "worker_bond_DESC_NULLS_LAST",
  WorkerCapedDelegationAsc = "worker_capedDelegation_ASC",
  WorkerCapedDelegationAscNullsFirst = "worker_capedDelegation_ASC_NULLS_FIRST",
  WorkerCapedDelegationAscNullsLast = "worker_capedDelegation_ASC_NULLS_LAST",
  WorkerCapedDelegationDesc = "worker_capedDelegation_DESC",
  WorkerCapedDelegationDescNullsFirst = "worker_capedDelegation_DESC_NULLS_FIRST",
  WorkerCapedDelegationDescNullsLast = "worker_capedDelegation_DESC_NULLS_LAST",
  WorkerClaimableRewardAsc = "worker_claimableReward_ASC",
  WorkerClaimableRewardAscNullsFirst = "worker_claimableReward_ASC_NULLS_FIRST",
  WorkerClaimableRewardAscNullsLast = "worker_claimableReward_ASC_NULLS_LAST",
  WorkerClaimableRewardDesc = "worker_claimableReward_DESC",
  WorkerClaimableRewardDescNullsFirst = "worker_claimableReward_DESC_NULLS_FIRST",
  WorkerClaimableRewardDescNullsLast = "worker_claimableReward_DESC_NULLS_LAST",
  WorkerClaimedRewardAsc = "worker_claimedReward_ASC",
  WorkerClaimedRewardAscNullsFirst = "worker_claimedReward_ASC_NULLS_FIRST",
  WorkerClaimedRewardAscNullsLast = "worker_claimedReward_ASC_NULLS_LAST",
  WorkerClaimedRewardDesc = "worker_claimedReward_DESC",
  WorkerClaimedRewardDescNullsFirst = "worker_claimedReward_DESC_NULLS_FIRST",
  WorkerClaimedRewardDescNullsLast = "worker_claimedReward_DESC_NULLS_LAST",
  WorkerCreatedAtAsc = "worker_createdAt_ASC",
  WorkerCreatedAtAscNullsFirst = "worker_createdAt_ASC_NULLS_FIRST",
  WorkerCreatedAtAscNullsLast = "worker_createdAt_ASC_NULLS_LAST",
  WorkerCreatedAtDesc = "worker_createdAt_DESC",
  WorkerCreatedAtDescNullsFirst = "worker_createdAt_DESC_NULLS_FIRST",
  WorkerCreatedAtDescNullsLast = "worker_createdAt_DESC_NULLS_LAST",
  WorkerDTenureAsc = "worker_dTenure_ASC",
  WorkerDTenureAscNullsFirst = "worker_dTenure_ASC_NULLS_FIRST",
  WorkerDTenureAscNullsLast = "worker_dTenure_ASC_NULLS_LAST",
  WorkerDTenureDesc = "worker_dTenure_DESC",
  WorkerDTenureDescNullsFirst = "worker_dTenure_DESC_NULLS_FIRST",
  WorkerDTenureDescNullsLast = "worker_dTenure_DESC_NULLS_LAST",
  WorkerDelegationCountAsc = "worker_delegationCount_ASC",
  WorkerDelegationCountAscNullsFirst = "worker_delegationCount_ASC_NULLS_FIRST",
  WorkerDelegationCountAscNullsLast = "worker_delegationCount_ASC_NULLS_LAST",
  WorkerDelegationCountDesc = "worker_delegationCount_DESC",
  WorkerDelegationCountDescNullsFirst = "worker_delegationCount_DESC_NULLS_FIRST",
  WorkerDelegationCountDescNullsLast = "worker_delegationCount_DESC_NULLS_LAST",
  WorkerDescriptionAsc = "worker_description_ASC",
  WorkerDescriptionAscNullsFirst = "worker_description_ASC_NULLS_FIRST",
  WorkerDescriptionAscNullsLast = "worker_description_ASC_NULLS_LAST",
  WorkerDescriptionDesc = "worker_description_DESC",
  WorkerDescriptionDescNullsFirst = "worker_description_DESC_NULLS_FIRST",
  WorkerDescriptionDescNullsLast = "worker_description_DESC_NULLS_LAST",
  WorkerDialOkAsc = "worker_dialOk_ASC",
  WorkerDialOkAscNullsFirst = "worker_dialOk_ASC_NULLS_FIRST",
  WorkerDialOkAscNullsLast = "worker_dialOk_ASC_NULLS_LAST",
  WorkerDialOkDesc = "worker_dialOk_DESC",
  WorkerDialOkDescNullsFirst = "worker_dialOk_DESC_NULLS_FIRST",
  WorkerDialOkDescNullsLast = "worker_dialOk_DESC_NULLS_LAST",
  WorkerEmailAsc = "worker_email_ASC",
  WorkerEmailAscNullsFirst = "worker_email_ASC_NULLS_FIRST",
  WorkerEmailAscNullsLast = "worker_email_ASC_NULLS_LAST",
  WorkerEmailDesc = "worker_email_DESC",
  WorkerEmailDescNullsFirst = "worker_email_DESC_NULLS_FIRST",
  WorkerEmailDescNullsLast = "worker_email_DESC_NULLS_LAST",
  WorkerIdAsc = "worker_id_ASC",
  WorkerIdAscNullsFirst = "worker_id_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "worker_id_ASC_NULLS_LAST",
  WorkerIdDesc = "worker_id_DESC",
  WorkerIdDescNullsFirst = "worker_id_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "worker_id_DESC_NULLS_LAST",
  WorkerJailReasonAsc = "worker_jailReason_ASC",
  WorkerJailReasonAscNullsFirst = "worker_jailReason_ASC_NULLS_FIRST",
  WorkerJailReasonAscNullsLast = "worker_jailReason_ASC_NULLS_LAST",
  WorkerJailReasonDesc = "worker_jailReason_DESC",
  WorkerJailReasonDescNullsFirst = "worker_jailReason_DESC_NULLS_FIRST",
  WorkerJailReasonDescNullsLast = "worker_jailReason_DESC_NULLS_LAST",
  WorkerJailedAsc = "worker_jailed_ASC",
  WorkerJailedAscNullsFirst = "worker_jailed_ASC_NULLS_FIRST",
  WorkerJailedAscNullsLast = "worker_jailed_ASC_NULLS_LAST",
  WorkerJailedDesc = "worker_jailed_DESC",
  WorkerJailedDescNullsFirst = "worker_jailed_DESC_NULLS_FIRST",
  WorkerJailedDescNullsLast = "worker_jailed_DESC_NULLS_LAST",
  WorkerLivenessAsc = "worker_liveness_ASC",
  WorkerLivenessAscNullsFirst = "worker_liveness_ASC_NULLS_FIRST",
  WorkerLivenessAscNullsLast = "worker_liveness_ASC_NULLS_LAST",
  WorkerLivenessDesc = "worker_liveness_DESC",
  WorkerLivenessDescNullsFirst = "worker_liveness_DESC_NULLS_FIRST",
  WorkerLivenessDescNullsLast = "worker_liveness_DESC_NULLS_LAST",
  WorkerLockEndAsc = "worker_lockEnd_ASC",
  WorkerLockEndAscNullsFirst = "worker_lockEnd_ASC_NULLS_FIRST",
  WorkerLockEndAscNullsLast = "worker_lockEnd_ASC_NULLS_LAST",
  WorkerLockEndDesc = "worker_lockEnd_DESC",
  WorkerLockEndDescNullsFirst = "worker_lockEnd_DESC_NULLS_FIRST",
  WorkerLockEndDescNullsLast = "worker_lockEnd_DESC_NULLS_LAST",
  WorkerLockStartAsc = "worker_lockStart_ASC",
  WorkerLockStartAscNullsFirst = "worker_lockStart_ASC_NULLS_FIRST",
  WorkerLockStartAscNullsLast = "worker_lockStart_ASC_NULLS_LAST",
  WorkerLockStartDesc = "worker_lockStart_DESC",
  WorkerLockStartDescNullsFirst = "worker_lockStart_DESC_NULLS_FIRST",
  WorkerLockStartDescNullsLast = "worker_lockStart_DESC_NULLS_LAST",
  WorkerLockedAsc = "worker_locked_ASC",
  WorkerLockedAscNullsFirst = "worker_locked_ASC_NULLS_FIRST",
  WorkerLockedAscNullsLast = "worker_locked_ASC_NULLS_LAST",
  WorkerLockedDesc = "worker_locked_DESC",
  WorkerLockedDescNullsFirst = "worker_locked_DESC_NULLS_FIRST",
  WorkerLockedDescNullsLast = "worker_locked_DESC_NULLS_LAST",
  WorkerNameAsc = "worker_name_ASC",
  WorkerNameAscNullsFirst = "worker_name_ASC_NULLS_FIRST",
  WorkerNameAscNullsLast = "worker_name_ASC_NULLS_LAST",
  WorkerNameDesc = "worker_name_DESC",
  WorkerNameDescNullsFirst = "worker_name_DESC_NULLS_FIRST",
  WorkerNameDescNullsLast = "worker_name_DESC_NULLS_LAST",
  WorkerOnlineAsc = "worker_online_ASC",
  WorkerOnlineAscNullsFirst = "worker_online_ASC_NULLS_FIRST",
  WorkerOnlineAscNullsLast = "worker_online_ASC_NULLS_LAST",
  WorkerOnlineDesc = "worker_online_DESC",
  WorkerOnlineDescNullsFirst = "worker_online_DESC_NULLS_FIRST",
  WorkerOnlineDescNullsLast = "worker_online_DESC_NULLS_LAST",
  WorkerPeerIdAsc = "worker_peerId_ASC",
  WorkerPeerIdAscNullsFirst = "worker_peerId_ASC_NULLS_FIRST",
  WorkerPeerIdAscNullsLast = "worker_peerId_ASC_NULLS_LAST",
  WorkerPeerIdDesc = "worker_peerId_DESC",
  WorkerPeerIdDescNullsFirst = "worker_peerId_DESC_NULLS_FIRST",
  WorkerPeerIdDescNullsLast = "worker_peerId_DESC_NULLS_LAST",
  WorkerQueries24HoursAsc = "worker_queries24Hours_ASC",
  WorkerQueries24HoursAscNullsFirst = "worker_queries24Hours_ASC_NULLS_FIRST",
  WorkerQueries24HoursAscNullsLast = "worker_queries24Hours_ASC_NULLS_LAST",
  WorkerQueries24HoursDesc = "worker_queries24Hours_DESC",
  WorkerQueries24HoursDescNullsFirst = "worker_queries24Hours_DESC_NULLS_FIRST",
  WorkerQueries24HoursDescNullsLast = "worker_queries24Hours_DESC_NULLS_LAST",
  WorkerQueries90DaysAsc = "worker_queries90Days_ASC",
  WorkerQueries90DaysAscNullsFirst = "worker_queries90Days_ASC_NULLS_FIRST",
  WorkerQueries90DaysAscNullsLast = "worker_queries90Days_ASC_NULLS_LAST",
  WorkerQueries90DaysDesc = "worker_queries90Days_DESC",
  WorkerQueries90DaysDescNullsFirst = "worker_queries90Days_DESC_NULLS_FIRST",
  WorkerQueries90DaysDescNullsLast = "worker_queries90Days_DESC_NULLS_LAST",
  WorkerScannedData24HoursAsc = "worker_scannedData24Hours_ASC",
  WorkerScannedData24HoursAscNullsFirst = "worker_scannedData24Hours_ASC_NULLS_FIRST",
  WorkerScannedData24HoursAscNullsLast = "worker_scannedData24Hours_ASC_NULLS_LAST",
  WorkerScannedData24HoursDesc = "worker_scannedData24Hours_DESC",
  WorkerScannedData24HoursDescNullsFirst = "worker_scannedData24Hours_DESC_NULLS_FIRST",
  WorkerScannedData24HoursDescNullsLast = "worker_scannedData24Hours_DESC_NULLS_LAST",
  WorkerScannedData90DaysAsc = "worker_scannedData90Days_ASC",
  WorkerScannedData90DaysAscNullsFirst = "worker_scannedData90Days_ASC_NULLS_FIRST",
  WorkerScannedData90DaysAscNullsLast = "worker_scannedData90Days_ASC_NULLS_LAST",
  WorkerScannedData90DaysDesc = "worker_scannedData90Days_DESC",
  WorkerScannedData90DaysDescNullsFirst = "worker_scannedData90Days_DESC_NULLS_FIRST",
  WorkerScannedData90DaysDescNullsLast = "worker_scannedData90Days_DESC_NULLS_LAST",
  WorkerServedData24HoursAsc = "worker_servedData24Hours_ASC",
  WorkerServedData24HoursAscNullsFirst = "worker_servedData24Hours_ASC_NULLS_FIRST",
  WorkerServedData24HoursAscNullsLast = "worker_servedData24Hours_ASC_NULLS_LAST",
  WorkerServedData24HoursDesc = "worker_servedData24Hours_DESC",
  WorkerServedData24HoursDescNullsFirst = "worker_servedData24Hours_DESC_NULLS_FIRST",
  WorkerServedData24HoursDescNullsLast = "worker_servedData24Hours_DESC_NULLS_LAST",
  WorkerServedData90DaysAsc = "worker_servedData90Days_ASC",
  WorkerServedData90DaysAscNullsFirst = "worker_servedData90Days_ASC_NULLS_FIRST",
  WorkerServedData90DaysAscNullsLast = "worker_servedData90Days_ASC_NULLS_LAST",
  WorkerServedData90DaysDesc = "worker_servedData90Days_DESC",
  WorkerServedData90DaysDescNullsFirst = "worker_servedData90Days_DESC_NULLS_FIRST",
  WorkerServedData90DaysDescNullsLast = "worker_servedData90Days_DESC_NULLS_LAST",
  WorkerStakerAprAsc = "worker_stakerApr_ASC",
  WorkerStakerAprAscNullsFirst = "worker_stakerApr_ASC_NULLS_FIRST",
  WorkerStakerAprAscNullsLast = "worker_stakerApr_ASC_NULLS_LAST",
  WorkerStakerAprDesc = "worker_stakerApr_DESC",
  WorkerStakerAprDescNullsFirst = "worker_stakerApr_DESC_NULLS_FIRST",
  WorkerStakerAprDescNullsLast = "worker_stakerApr_DESC_NULLS_LAST",
  WorkerStatusAsc = "worker_status_ASC",
  WorkerStatusAscNullsFirst = "worker_status_ASC_NULLS_FIRST",
  WorkerStatusAscNullsLast = "worker_status_ASC_NULLS_LAST",
  WorkerStatusDesc = "worker_status_DESC",
  WorkerStatusDescNullsFirst = "worker_status_DESC_NULLS_FIRST",
  WorkerStatusDescNullsLast = "worker_status_DESC_NULLS_LAST",
  WorkerStoredDataAsc = "worker_storedData_ASC",
  WorkerStoredDataAscNullsFirst = "worker_storedData_ASC_NULLS_FIRST",
  WorkerStoredDataAscNullsLast = "worker_storedData_ASC_NULLS_LAST",
  WorkerStoredDataDesc = "worker_storedData_DESC",
  WorkerStoredDataDescNullsFirst = "worker_storedData_DESC_NULLS_FIRST",
  WorkerStoredDataDescNullsLast = "worker_storedData_DESC_NULLS_LAST",
  WorkerTotalDelegationRewardsAsc = "worker_totalDelegationRewards_ASC",
  WorkerTotalDelegationRewardsAscNullsFirst = "worker_totalDelegationRewards_ASC_NULLS_FIRST",
  WorkerTotalDelegationRewardsAscNullsLast = "worker_totalDelegationRewards_ASC_NULLS_LAST",
  WorkerTotalDelegationRewardsDesc = "worker_totalDelegationRewards_DESC",
  WorkerTotalDelegationRewardsDescNullsFirst = "worker_totalDelegationRewards_DESC_NULLS_FIRST",
  WorkerTotalDelegationRewardsDescNullsLast = "worker_totalDelegationRewards_DESC_NULLS_LAST",
  WorkerTotalDelegationAsc = "worker_totalDelegation_ASC",
  WorkerTotalDelegationAscNullsFirst = "worker_totalDelegation_ASC_NULLS_FIRST",
  WorkerTotalDelegationAscNullsLast = "worker_totalDelegation_ASC_NULLS_LAST",
  WorkerTotalDelegationDesc = "worker_totalDelegation_DESC",
  WorkerTotalDelegationDescNullsFirst = "worker_totalDelegation_DESC_NULLS_FIRST",
  WorkerTotalDelegationDescNullsLast = "worker_totalDelegation_DESC_NULLS_LAST",
  WorkerTrafficWeightAsc = "worker_trafficWeight_ASC",
  WorkerTrafficWeightAscNullsFirst = "worker_trafficWeight_ASC_NULLS_FIRST",
  WorkerTrafficWeightAscNullsLast = "worker_trafficWeight_ASC_NULLS_LAST",
  WorkerTrafficWeightDesc = "worker_trafficWeight_DESC",
  WorkerTrafficWeightDescNullsFirst = "worker_trafficWeight_DESC_NULLS_FIRST",
  WorkerTrafficWeightDescNullsLast = "worker_trafficWeight_DESC_NULLS_LAST",
  WorkerUptime24HoursAsc = "worker_uptime24Hours_ASC",
  WorkerUptime24HoursAscNullsFirst = "worker_uptime24Hours_ASC_NULLS_FIRST",
  WorkerUptime24HoursAscNullsLast = "worker_uptime24Hours_ASC_NULLS_LAST",
  WorkerUptime24HoursDesc = "worker_uptime24Hours_DESC",
  WorkerUptime24HoursDescNullsFirst = "worker_uptime24Hours_DESC_NULLS_FIRST",
  WorkerUptime24HoursDescNullsLast = "worker_uptime24Hours_DESC_NULLS_LAST",
  WorkerUptime90DaysAsc = "worker_uptime90Days_ASC",
  WorkerUptime90DaysAscNullsFirst = "worker_uptime90Days_ASC_NULLS_FIRST",
  WorkerUptime90DaysAscNullsLast = "worker_uptime90Days_ASC_NULLS_LAST",
  WorkerUptime90DaysDesc = "worker_uptime90Days_DESC",
  WorkerUptime90DaysDescNullsFirst = "worker_uptime90Days_DESC_NULLS_FIRST",
  WorkerUptime90DaysDescNullsLast = "worker_uptime90Days_DESC_NULLS_LAST",
  WorkerVersionAsc = "worker_version_ASC",
  WorkerVersionAscNullsFirst = "worker_version_ASC_NULLS_FIRST",
  WorkerVersionAscNullsLast = "worker_version_ASC_NULLS_LAST",
  WorkerVersionDesc = "worker_version_DESC",
  WorkerVersionDescNullsFirst = "worker_version_DESC_NULLS_FIRST",
  WorkerVersionDescNullsLast = "worker_version_DESC_NULLS_LAST",
  WorkerWebsiteAsc = "worker_website_ASC",
  WorkerWebsiteAscNullsFirst = "worker_website_ASC_NULLS_FIRST",
  WorkerWebsiteAscNullsLast = "worker_website_ASC_NULLS_LAST",
  WorkerWebsiteDesc = "worker_website_DESC",
  WorkerWebsiteDescNullsFirst = "worker_website_DESC_NULLS_FIRST",
  WorkerWebsiteDescNullsLast = "worker_website_DESC_NULLS_LAST",
}

export enum TransferType {
  Claim = "CLAIM",
  Deposit = "DEPOSIT",
  Release = "RELEASE",
  Transfer = "TRANSFER",
  Withdraw = "WITHDRAW",
}

export type TransferWhereInput = {
  AND?: InputMaybe<Array<TransferWhereInput>>;
  OR?: InputMaybe<Array<TransferWhereInput>>;
  amount_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegation?: InputMaybe<DelegationWhereInput>;
  delegation_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  from?: InputMaybe<AccountWhereInput>;
  from_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  gatewayStake?: InputMaybe<GatewayStakeWhereInput>;
  gatewayStake_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  to?: InputMaybe<AccountWhereInput>;
  to_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  txHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  txHash_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  txHash_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  txHash_eq?: InputMaybe<Scalars["String"]["input"]>;
  txHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  txHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  txHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txHash_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  txHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  txHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  txHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  txHash_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  txHash_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  txHash_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  txHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txHash_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  txHash_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  type_eq?: InputMaybe<TransferType>;
  type_in?: InputMaybe<Array<TransferType>>;
  type_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  type_not_eq?: InputMaybe<TransferType>;
  type_not_in?: InputMaybe<Array<TransferType>>;
  vesting?: InputMaybe<AccountWhereInput>;
  vesting_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  worker?: InputMaybe<WorkerWhereInput>;
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TransfersByTypeTimeseries = {
  __typename?: "TransfersByTypeTimeseries";
  data: Array<TransferCountByType>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type TransfersConnection = {
  __typename?: "TransfersConnection";
  edges: Array<TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type TvlEntry = {
  __typename?: "TvlEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["BigInt"]["output"]>;
};

export type UniqueAccountsEntry = {
  __typename?: "UniqueAccountsEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type UniqueAccountsTimeseries = {
  __typename?: "UniqueAccountsTimeseries";
  data: Array<UniqueAccountsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type UniqueOperatorsTimeseries = {
  __typename?: "UniqueOperatorsTimeseries";
  data: Array<OperatorsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type UptimeEntry = {
  __typename?: "UptimeEntry";
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type UptimeTimeseries = {
  __typename?: "UptimeTimeseries";
  data: Array<UptimeEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Worker = {
  __typename?: "Worker";
  apr?: Maybe<Scalars["Float"]["output"]>;
  bond: Scalars["BigInt"]["output"];
  capedDelegation: Scalars["BigInt"]["output"];
  claimableReward: Scalars["BigInt"]["output"];
  claimedReward: Scalars["BigInt"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  dTenure?: Maybe<Scalars["Float"]["output"]>;
  dayUptimes?: Maybe<Array<WorkerDayUptime>>;
  delegationCount: Scalars["Int"]["output"];
  delegations: Array<Delegation>;
  description?: Maybe<Scalars["String"]["output"]>;
  dialOk?: Maybe<Scalars["Boolean"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  jailReason?: Maybe<Scalars["String"]["output"]>;
  jailed?: Maybe<Scalars["Boolean"]["output"]>;
  liveness?: Maybe<Scalars["Float"]["output"]>;
  lockEnd?: Maybe<Scalars["Int"]["output"]>;
  lockStart?: Maybe<Scalars["Int"]["output"]>;
  locked?: Maybe<Scalars["Boolean"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  online?: Maybe<Scalars["Boolean"]["output"]>;
  owner: Account;
  peerId: Scalars["String"]["output"];
  queries24Hours?: Maybe<Scalars["BigInt"]["output"]>;
  queries90Days?: Maybe<Scalars["BigInt"]["output"]>;
  /** owner.owner for VESTING account */
  realOwner: Account;
  rewards: Array<WorkerReward>;
  scannedData24Hours?: Maybe<Scalars["BigInt"]["output"]>;
  scannedData90Days?: Maybe<Scalars["BigInt"]["output"]>;
  servedData24Hours?: Maybe<Scalars["BigInt"]["output"]>;
  servedData90Days?: Maybe<Scalars["BigInt"]["output"]>;
  snapshots: Array<WorkerSnapshot>;
  stakerApr?: Maybe<Scalars["Float"]["output"]>;
  status: WorkerStatus;
  statusHistory: Array<WorkerStatusChange>;
  storedData?: Maybe<Scalars["BigInt"]["output"]>;
  totalDelegation: Scalars["BigInt"]["output"];
  totalDelegationRewards: Scalars["BigInt"]["output"];
  trafficWeight?: Maybe<Scalars["Float"]["output"]>;
  uptime24Hours?: Maybe<Scalars["Float"]["output"]>;
  uptime90Days?: Maybe<Scalars["Float"]["output"]>;
  version?: Maybe<Scalars["String"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type WorkerDelegationsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DelegationOrderByInput>>;
  where?: InputMaybe<DelegationWhereInput>;
};

export type WorkerRewardsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerRewardOrderByInput>>;
  where?: InputMaybe<WorkerRewardWhereInput>;
};

export type WorkerSnapshotsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerSnapshotOrderByInput>>;
  where?: InputMaybe<WorkerSnapshotWhereInput>;
};

export type WorkerStatusHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkerStatusChangeOrderByInput>>;
  where?: InputMaybe<WorkerStatusChangeWhereInput>;
};

export type WorkerDayUptime = {
  __typename?: "WorkerDayUptime";
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
};

export type WorkerEdge = {
  __typename?: "WorkerEdge";
  cursor: Scalars["String"]["output"];
  node: Worker;
};

export type WorkerMetrics = {
  __typename?: "WorkerMetrics";
  id: Scalars["String"]["output"];
  pings: Scalars["Int"]["output"];
  queries: Scalars["Int"]["output"];
  scannedData: Scalars["BigInt"]["output"];
  servedData: Scalars["BigInt"]["output"];
  storedData: Scalars["BigInt"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
  worker: Worker;
};

export type WorkerMetricsConnection = {
  __typename?: "WorkerMetricsConnection";
  edges: Array<WorkerMetricsEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type WorkerMetricsEdge = {
  __typename?: "WorkerMetricsEdge";
  cursor: Scalars["String"]["output"];
  node: WorkerMetrics;
};

export enum WorkerMetricsOrderByInput {
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  PingsAsc = "pings_ASC",
  PingsAscNullsFirst = "pings_ASC_NULLS_FIRST",
  PingsAscNullsLast = "pings_ASC_NULLS_LAST",
  PingsDesc = "pings_DESC",
  PingsDescNullsFirst = "pings_DESC_NULLS_FIRST",
  PingsDescNullsLast = "pings_DESC_NULLS_LAST",
  QueriesAsc = "queries_ASC",
  QueriesAscNullsFirst = "queries_ASC_NULLS_FIRST",
  QueriesAscNullsLast = "queries_ASC_NULLS_LAST",
  QueriesDesc = "queries_DESC",
  QueriesDescNullsFirst = "queries_DESC_NULLS_FIRST",
  QueriesDescNullsLast = "queries_DESC_NULLS_LAST",
  ScannedDataAsc = "scannedData_ASC",
  ScannedDataAscNullsFirst = "scannedData_ASC_NULLS_FIRST",
  ScannedDataAscNullsLast = "scannedData_ASC_NULLS_LAST",
  ScannedDataDesc = "scannedData_DESC",
  ScannedDataDescNullsFirst = "scannedData_DESC_NULLS_FIRST",
  ScannedDataDescNullsLast = "scannedData_DESC_NULLS_LAST",
  ServedDataAsc = "servedData_ASC",
  ServedDataAscNullsFirst = "servedData_ASC_NULLS_FIRST",
  ServedDataAscNullsLast = "servedData_ASC_NULLS_LAST",
  ServedDataDesc = "servedData_DESC",
  ServedDataDescNullsFirst = "servedData_DESC_NULLS_FIRST",
  ServedDataDescNullsLast = "servedData_DESC_NULLS_LAST",
  StoredDataAsc = "storedData_ASC",
  StoredDataAscNullsFirst = "storedData_ASC_NULLS_FIRST",
  StoredDataAscNullsLast = "storedData_ASC_NULLS_LAST",
  StoredDataDesc = "storedData_DESC",
  StoredDataDescNullsFirst = "storedData_DESC_NULLS_FIRST",
  StoredDataDescNullsLast = "storedData_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  UptimeAsc = "uptime_ASC",
  UptimeAscNullsFirst = "uptime_ASC_NULLS_FIRST",
  UptimeAscNullsLast = "uptime_ASC_NULLS_LAST",
  UptimeDesc = "uptime_DESC",
  UptimeDescNullsFirst = "uptime_DESC_NULLS_FIRST",
  UptimeDescNullsLast = "uptime_DESC_NULLS_LAST",
  WorkerAprAsc = "worker_apr_ASC",
  WorkerAprAscNullsFirst = "worker_apr_ASC_NULLS_FIRST",
  WorkerAprAscNullsLast = "worker_apr_ASC_NULLS_LAST",
  WorkerAprDesc = "worker_apr_DESC",
  WorkerAprDescNullsFirst = "worker_apr_DESC_NULLS_FIRST",
  WorkerAprDescNullsLast = "worker_apr_DESC_NULLS_LAST",
  WorkerBondAsc = "worker_bond_ASC",
  WorkerBondAscNullsFirst = "worker_bond_ASC_NULLS_FIRST",
  WorkerBondAscNullsLast = "worker_bond_ASC_NULLS_LAST",
  WorkerBondDesc = "worker_bond_DESC",
  WorkerBondDescNullsFirst = "worker_bond_DESC_NULLS_FIRST",
  WorkerBondDescNullsLast = "worker_bond_DESC_NULLS_LAST",
  WorkerCapedDelegationAsc = "worker_capedDelegation_ASC",
  WorkerCapedDelegationAscNullsFirst = "worker_capedDelegation_ASC_NULLS_FIRST",
  WorkerCapedDelegationAscNullsLast = "worker_capedDelegation_ASC_NULLS_LAST",
  WorkerCapedDelegationDesc = "worker_capedDelegation_DESC",
  WorkerCapedDelegationDescNullsFirst = "worker_capedDelegation_DESC_NULLS_FIRST",
  WorkerCapedDelegationDescNullsLast = "worker_capedDelegation_DESC_NULLS_LAST",
  WorkerClaimableRewardAsc = "worker_claimableReward_ASC",
  WorkerClaimableRewardAscNullsFirst = "worker_claimableReward_ASC_NULLS_FIRST",
  WorkerClaimableRewardAscNullsLast = "worker_claimableReward_ASC_NULLS_LAST",
  WorkerClaimableRewardDesc = "worker_claimableReward_DESC",
  WorkerClaimableRewardDescNullsFirst = "worker_claimableReward_DESC_NULLS_FIRST",
  WorkerClaimableRewardDescNullsLast = "worker_claimableReward_DESC_NULLS_LAST",
  WorkerClaimedRewardAsc = "worker_claimedReward_ASC",
  WorkerClaimedRewardAscNullsFirst = "worker_claimedReward_ASC_NULLS_FIRST",
  WorkerClaimedRewardAscNullsLast = "worker_claimedReward_ASC_NULLS_LAST",
  WorkerClaimedRewardDesc = "worker_claimedReward_DESC",
  WorkerClaimedRewardDescNullsFirst = "worker_claimedReward_DESC_NULLS_FIRST",
  WorkerClaimedRewardDescNullsLast = "worker_claimedReward_DESC_NULLS_LAST",
  WorkerCreatedAtAsc = "worker_createdAt_ASC",
  WorkerCreatedAtAscNullsFirst = "worker_createdAt_ASC_NULLS_FIRST",
  WorkerCreatedAtAscNullsLast = "worker_createdAt_ASC_NULLS_LAST",
  WorkerCreatedAtDesc = "worker_createdAt_DESC",
  WorkerCreatedAtDescNullsFirst = "worker_createdAt_DESC_NULLS_FIRST",
  WorkerCreatedAtDescNullsLast = "worker_createdAt_DESC_NULLS_LAST",
  WorkerDTenureAsc = "worker_dTenure_ASC",
  WorkerDTenureAscNullsFirst = "worker_dTenure_ASC_NULLS_FIRST",
  WorkerDTenureAscNullsLast = "worker_dTenure_ASC_NULLS_LAST",
  WorkerDTenureDesc = "worker_dTenure_DESC",
  WorkerDTenureDescNullsFirst = "worker_dTenure_DESC_NULLS_FIRST",
  WorkerDTenureDescNullsLast = "worker_dTenure_DESC_NULLS_LAST",
  WorkerDelegationCountAsc = "worker_delegationCount_ASC",
  WorkerDelegationCountAscNullsFirst = "worker_delegationCount_ASC_NULLS_FIRST",
  WorkerDelegationCountAscNullsLast = "worker_delegationCount_ASC_NULLS_LAST",
  WorkerDelegationCountDesc = "worker_delegationCount_DESC",
  WorkerDelegationCountDescNullsFirst = "worker_delegationCount_DESC_NULLS_FIRST",
  WorkerDelegationCountDescNullsLast = "worker_delegationCount_DESC_NULLS_LAST",
  WorkerDescriptionAsc = "worker_description_ASC",
  WorkerDescriptionAscNullsFirst = "worker_description_ASC_NULLS_FIRST",
  WorkerDescriptionAscNullsLast = "worker_description_ASC_NULLS_LAST",
  WorkerDescriptionDesc = "worker_description_DESC",
  WorkerDescriptionDescNullsFirst = "worker_description_DESC_NULLS_FIRST",
  WorkerDescriptionDescNullsLast = "worker_description_DESC_NULLS_LAST",
  WorkerDialOkAsc = "worker_dialOk_ASC",
  WorkerDialOkAscNullsFirst = "worker_dialOk_ASC_NULLS_FIRST",
  WorkerDialOkAscNullsLast = "worker_dialOk_ASC_NULLS_LAST",
  WorkerDialOkDesc = "worker_dialOk_DESC",
  WorkerDialOkDescNullsFirst = "worker_dialOk_DESC_NULLS_FIRST",
  WorkerDialOkDescNullsLast = "worker_dialOk_DESC_NULLS_LAST",
  WorkerEmailAsc = "worker_email_ASC",
  WorkerEmailAscNullsFirst = "worker_email_ASC_NULLS_FIRST",
  WorkerEmailAscNullsLast = "worker_email_ASC_NULLS_LAST",
  WorkerEmailDesc = "worker_email_DESC",
  WorkerEmailDescNullsFirst = "worker_email_DESC_NULLS_FIRST",
  WorkerEmailDescNullsLast = "worker_email_DESC_NULLS_LAST",
  WorkerIdAsc = "worker_id_ASC",
  WorkerIdAscNullsFirst = "worker_id_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "worker_id_ASC_NULLS_LAST",
  WorkerIdDesc = "worker_id_DESC",
  WorkerIdDescNullsFirst = "worker_id_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "worker_id_DESC_NULLS_LAST",
  WorkerJailReasonAsc = "worker_jailReason_ASC",
  WorkerJailReasonAscNullsFirst = "worker_jailReason_ASC_NULLS_FIRST",
  WorkerJailReasonAscNullsLast = "worker_jailReason_ASC_NULLS_LAST",
  WorkerJailReasonDesc = "worker_jailReason_DESC",
  WorkerJailReasonDescNullsFirst = "worker_jailReason_DESC_NULLS_FIRST",
  WorkerJailReasonDescNullsLast = "worker_jailReason_DESC_NULLS_LAST",
  WorkerJailedAsc = "worker_jailed_ASC",
  WorkerJailedAscNullsFirst = "worker_jailed_ASC_NULLS_FIRST",
  WorkerJailedAscNullsLast = "worker_jailed_ASC_NULLS_LAST",
  WorkerJailedDesc = "worker_jailed_DESC",
  WorkerJailedDescNullsFirst = "worker_jailed_DESC_NULLS_FIRST",
  WorkerJailedDescNullsLast = "worker_jailed_DESC_NULLS_LAST",
  WorkerLivenessAsc = "worker_liveness_ASC",
  WorkerLivenessAscNullsFirst = "worker_liveness_ASC_NULLS_FIRST",
  WorkerLivenessAscNullsLast = "worker_liveness_ASC_NULLS_LAST",
  WorkerLivenessDesc = "worker_liveness_DESC",
  WorkerLivenessDescNullsFirst = "worker_liveness_DESC_NULLS_FIRST",
  WorkerLivenessDescNullsLast = "worker_liveness_DESC_NULLS_LAST",
  WorkerLockEndAsc = "worker_lockEnd_ASC",
  WorkerLockEndAscNullsFirst = "worker_lockEnd_ASC_NULLS_FIRST",
  WorkerLockEndAscNullsLast = "worker_lockEnd_ASC_NULLS_LAST",
  WorkerLockEndDesc = "worker_lockEnd_DESC",
  WorkerLockEndDescNullsFirst = "worker_lockEnd_DESC_NULLS_FIRST",
  WorkerLockEndDescNullsLast = "worker_lockEnd_DESC_NULLS_LAST",
  WorkerLockStartAsc = "worker_lockStart_ASC",
  WorkerLockStartAscNullsFirst = "worker_lockStart_ASC_NULLS_FIRST",
  WorkerLockStartAscNullsLast = "worker_lockStart_ASC_NULLS_LAST",
  WorkerLockStartDesc = "worker_lockStart_DESC",
  WorkerLockStartDescNullsFirst = "worker_lockStart_DESC_NULLS_FIRST",
  WorkerLockStartDescNullsLast = "worker_lockStart_DESC_NULLS_LAST",
  WorkerLockedAsc = "worker_locked_ASC",
  WorkerLockedAscNullsFirst = "worker_locked_ASC_NULLS_FIRST",
  WorkerLockedAscNullsLast = "worker_locked_ASC_NULLS_LAST",
  WorkerLockedDesc = "worker_locked_DESC",
  WorkerLockedDescNullsFirst = "worker_locked_DESC_NULLS_FIRST",
  WorkerLockedDescNullsLast = "worker_locked_DESC_NULLS_LAST",
  WorkerNameAsc = "worker_name_ASC",
  WorkerNameAscNullsFirst = "worker_name_ASC_NULLS_FIRST",
  WorkerNameAscNullsLast = "worker_name_ASC_NULLS_LAST",
  WorkerNameDesc = "worker_name_DESC",
  WorkerNameDescNullsFirst = "worker_name_DESC_NULLS_FIRST",
  WorkerNameDescNullsLast = "worker_name_DESC_NULLS_LAST",
  WorkerOnlineAsc = "worker_online_ASC",
  WorkerOnlineAscNullsFirst = "worker_online_ASC_NULLS_FIRST",
  WorkerOnlineAscNullsLast = "worker_online_ASC_NULLS_LAST",
  WorkerOnlineDesc = "worker_online_DESC",
  WorkerOnlineDescNullsFirst = "worker_online_DESC_NULLS_FIRST",
  WorkerOnlineDescNullsLast = "worker_online_DESC_NULLS_LAST",
  WorkerPeerIdAsc = "worker_peerId_ASC",
  WorkerPeerIdAscNullsFirst = "worker_peerId_ASC_NULLS_FIRST",
  WorkerPeerIdAscNullsLast = "worker_peerId_ASC_NULLS_LAST",
  WorkerPeerIdDesc = "worker_peerId_DESC",
  WorkerPeerIdDescNullsFirst = "worker_peerId_DESC_NULLS_FIRST",
  WorkerPeerIdDescNullsLast = "worker_peerId_DESC_NULLS_LAST",
  WorkerQueries24HoursAsc = "worker_queries24Hours_ASC",
  WorkerQueries24HoursAscNullsFirst = "worker_queries24Hours_ASC_NULLS_FIRST",
  WorkerQueries24HoursAscNullsLast = "worker_queries24Hours_ASC_NULLS_LAST",
  WorkerQueries24HoursDesc = "worker_queries24Hours_DESC",
  WorkerQueries24HoursDescNullsFirst = "worker_queries24Hours_DESC_NULLS_FIRST",
  WorkerQueries24HoursDescNullsLast = "worker_queries24Hours_DESC_NULLS_LAST",
  WorkerQueries90DaysAsc = "worker_queries90Days_ASC",
  WorkerQueries90DaysAscNullsFirst = "worker_queries90Days_ASC_NULLS_FIRST",
  WorkerQueries90DaysAscNullsLast = "worker_queries90Days_ASC_NULLS_LAST",
  WorkerQueries90DaysDesc = "worker_queries90Days_DESC",
  WorkerQueries90DaysDescNullsFirst = "worker_queries90Days_DESC_NULLS_FIRST",
  WorkerQueries90DaysDescNullsLast = "worker_queries90Days_DESC_NULLS_LAST",
  WorkerScannedData24HoursAsc = "worker_scannedData24Hours_ASC",
  WorkerScannedData24HoursAscNullsFirst = "worker_scannedData24Hours_ASC_NULLS_FIRST",
  WorkerScannedData24HoursAscNullsLast = "worker_scannedData24Hours_ASC_NULLS_LAST",
  WorkerScannedData24HoursDesc = "worker_scannedData24Hours_DESC",
  WorkerScannedData24HoursDescNullsFirst = "worker_scannedData24Hours_DESC_NULLS_FIRST",
  WorkerScannedData24HoursDescNullsLast = "worker_scannedData24Hours_DESC_NULLS_LAST",
  WorkerScannedData90DaysAsc = "worker_scannedData90Days_ASC",
  WorkerScannedData90DaysAscNullsFirst = "worker_scannedData90Days_ASC_NULLS_FIRST",
  WorkerScannedData90DaysAscNullsLast = "worker_scannedData90Days_ASC_NULLS_LAST",
  WorkerScannedData90DaysDesc = "worker_scannedData90Days_DESC",
  WorkerScannedData90DaysDescNullsFirst = "worker_scannedData90Days_DESC_NULLS_FIRST",
  WorkerScannedData90DaysDescNullsLast = "worker_scannedData90Days_DESC_NULLS_LAST",
  WorkerServedData24HoursAsc = "worker_servedData24Hours_ASC",
  WorkerServedData24HoursAscNullsFirst = "worker_servedData24Hours_ASC_NULLS_FIRST",
  WorkerServedData24HoursAscNullsLast = "worker_servedData24Hours_ASC_NULLS_LAST",
  WorkerServedData24HoursDesc = "worker_servedData24Hours_DESC",
  WorkerServedData24HoursDescNullsFirst = "worker_servedData24Hours_DESC_NULLS_FIRST",
  WorkerServedData24HoursDescNullsLast = "worker_servedData24Hours_DESC_NULLS_LAST",
  WorkerServedData90DaysAsc = "worker_servedData90Days_ASC",
  WorkerServedData90DaysAscNullsFirst = "worker_servedData90Days_ASC_NULLS_FIRST",
  WorkerServedData90DaysAscNullsLast = "worker_servedData90Days_ASC_NULLS_LAST",
  WorkerServedData90DaysDesc = "worker_servedData90Days_DESC",
  WorkerServedData90DaysDescNullsFirst = "worker_servedData90Days_DESC_NULLS_FIRST",
  WorkerServedData90DaysDescNullsLast = "worker_servedData90Days_DESC_NULLS_LAST",
  WorkerStakerAprAsc = "worker_stakerApr_ASC",
  WorkerStakerAprAscNullsFirst = "worker_stakerApr_ASC_NULLS_FIRST",
  WorkerStakerAprAscNullsLast = "worker_stakerApr_ASC_NULLS_LAST",
  WorkerStakerAprDesc = "worker_stakerApr_DESC",
  WorkerStakerAprDescNullsFirst = "worker_stakerApr_DESC_NULLS_FIRST",
  WorkerStakerAprDescNullsLast = "worker_stakerApr_DESC_NULLS_LAST",
  WorkerStatusAsc = "worker_status_ASC",
  WorkerStatusAscNullsFirst = "worker_status_ASC_NULLS_FIRST",
  WorkerStatusAscNullsLast = "worker_status_ASC_NULLS_LAST",
  WorkerStatusDesc = "worker_status_DESC",
  WorkerStatusDescNullsFirst = "worker_status_DESC_NULLS_FIRST",
  WorkerStatusDescNullsLast = "worker_status_DESC_NULLS_LAST",
  WorkerStoredDataAsc = "worker_storedData_ASC",
  WorkerStoredDataAscNullsFirst = "worker_storedData_ASC_NULLS_FIRST",
  WorkerStoredDataAscNullsLast = "worker_storedData_ASC_NULLS_LAST",
  WorkerStoredDataDesc = "worker_storedData_DESC",
  WorkerStoredDataDescNullsFirst = "worker_storedData_DESC_NULLS_FIRST",
  WorkerStoredDataDescNullsLast = "worker_storedData_DESC_NULLS_LAST",
  WorkerTotalDelegationRewardsAsc = "worker_totalDelegationRewards_ASC",
  WorkerTotalDelegationRewardsAscNullsFirst = "worker_totalDelegationRewards_ASC_NULLS_FIRST",
  WorkerTotalDelegationRewardsAscNullsLast = "worker_totalDelegationRewards_ASC_NULLS_LAST",
  WorkerTotalDelegationRewardsDesc = "worker_totalDelegationRewards_DESC",
  WorkerTotalDelegationRewardsDescNullsFirst = "worker_totalDelegationRewards_DESC_NULLS_FIRST",
  WorkerTotalDelegationRewardsDescNullsLast = "worker_totalDelegationRewards_DESC_NULLS_LAST",
  WorkerTotalDelegationAsc = "worker_totalDelegation_ASC",
  WorkerTotalDelegationAscNullsFirst = "worker_totalDelegation_ASC_NULLS_FIRST",
  WorkerTotalDelegationAscNullsLast = "worker_totalDelegation_ASC_NULLS_LAST",
  WorkerTotalDelegationDesc = "worker_totalDelegation_DESC",
  WorkerTotalDelegationDescNullsFirst = "worker_totalDelegation_DESC_NULLS_FIRST",
  WorkerTotalDelegationDescNullsLast = "worker_totalDelegation_DESC_NULLS_LAST",
  WorkerTrafficWeightAsc = "worker_trafficWeight_ASC",
  WorkerTrafficWeightAscNullsFirst = "worker_trafficWeight_ASC_NULLS_FIRST",
  WorkerTrafficWeightAscNullsLast = "worker_trafficWeight_ASC_NULLS_LAST",
  WorkerTrafficWeightDesc = "worker_trafficWeight_DESC",
  WorkerTrafficWeightDescNullsFirst = "worker_trafficWeight_DESC_NULLS_FIRST",
  WorkerTrafficWeightDescNullsLast = "worker_trafficWeight_DESC_NULLS_LAST",
  WorkerUptime24HoursAsc = "worker_uptime24Hours_ASC",
  WorkerUptime24HoursAscNullsFirst = "worker_uptime24Hours_ASC_NULLS_FIRST",
  WorkerUptime24HoursAscNullsLast = "worker_uptime24Hours_ASC_NULLS_LAST",
  WorkerUptime24HoursDesc = "worker_uptime24Hours_DESC",
  WorkerUptime24HoursDescNullsFirst = "worker_uptime24Hours_DESC_NULLS_FIRST",
  WorkerUptime24HoursDescNullsLast = "worker_uptime24Hours_DESC_NULLS_LAST",
  WorkerUptime90DaysAsc = "worker_uptime90Days_ASC",
  WorkerUptime90DaysAscNullsFirst = "worker_uptime90Days_ASC_NULLS_FIRST",
  WorkerUptime90DaysAscNullsLast = "worker_uptime90Days_ASC_NULLS_LAST",
  WorkerUptime90DaysDesc = "worker_uptime90Days_DESC",
  WorkerUptime90DaysDescNullsFirst = "worker_uptime90Days_DESC_NULLS_FIRST",
  WorkerUptime90DaysDescNullsLast = "worker_uptime90Days_DESC_NULLS_LAST",
  WorkerVersionAsc = "worker_version_ASC",
  WorkerVersionAscNullsFirst = "worker_version_ASC_NULLS_FIRST",
  WorkerVersionAscNullsLast = "worker_version_ASC_NULLS_LAST",
  WorkerVersionDesc = "worker_version_DESC",
  WorkerVersionDescNullsFirst = "worker_version_DESC_NULLS_FIRST",
  WorkerVersionDescNullsLast = "worker_version_DESC_NULLS_LAST",
  WorkerWebsiteAsc = "worker_website_ASC",
  WorkerWebsiteAscNullsFirst = "worker_website_ASC_NULLS_FIRST",
  WorkerWebsiteAscNullsLast = "worker_website_ASC_NULLS_LAST",
  WorkerWebsiteDesc = "worker_website_DESC",
  WorkerWebsiteDescNullsFirst = "worker_website_DESC_NULLS_FIRST",
  WorkerWebsiteDescNullsLast = "worker_website_DESC_NULLS_LAST",
}

export type WorkerMetricsWhereInput = {
  AND?: InputMaybe<Array<WorkerMetricsWhereInput>>;
  OR?: InputMaybe<Array<WorkerMetricsWhereInput>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  pings_eq?: InputMaybe<Scalars["Int"]["input"]>;
  pings_gt?: InputMaybe<Scalars["Int"]["input"]>;
  pings_gte?: InputMaybe<Scalars["Int"]["input"]>;
  pings_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  pings_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  pings_lt?: InputMaybe<Scalars["Int"]["input"]>;
  pings_lte?: InputMaybe<Scalars["Int"]["input"]>;
  pings_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  pings_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  queries_eq?: InputMaybe<Scalars["Int"]["input"]>;
  queries_gt?: InputMaybe<Scalars["Int"]["input"]>;
  queries_gte?: InputMaybe<Scalars["Int"]["input"]>;
  queries_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  queries_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  queries_lt?: InputMaybe<Scalars["Int"]["input"]>;
  queries_lte?: InputMaybe<Scalars["Int"]["input"]>;
  queries_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  queries_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  scannedData_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scannedData_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  scannedData_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  servedData_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  servedData_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  servedData_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  storedData_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  storedData_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  storedData_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  uptime_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_gt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_gte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  uptime_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  uptime_lt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_lte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  worker?: InputMaybe<WorkerWhereInput>;
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export enum WorkerOrderByInput {
  AprAsc = "apr_ASC",
  AprAscNullsFirst = "apr_ASC_NULLS_FIRST",
  AprAscNullsLast = "apr_ASC_NULLS_LAST",
  AprDesc = "apr_DESC",
  AprDescNullsFirst = "apr_DESC_NULLS_FIRST",
  AprDescNullsLast = "apr_DESC_NULLS_LAST",
  BondAsc = "bond_ASC",
  BondAscNullsFirst = "bond_ASC_NULLS_FIRST",
  BondAscNullsLast = "bond_ASC_NULLS_LAST",
  BondDesc = "bond_DESC",
  BondDescNullsFirst = "bond_DESC_NULLS_FIRST",
  BondDescNullsLast = "bond_DESC_NULLS_LAST",
  CapedDelegationAsc = "capedDelegation_ASC",
  CapedDelegationAscNullsFirst = "capedDelegation_ASC_NULLS_FIRST",
  CapedDelegationAscNullsLast = "capedDelegation_ASC_NULLS_LAST",
  CapedDelegationDesc = "capedDelegation_DESC",
  CapedDelegationDescNullsFirst = "capedDelegation_DESC_NULLS_FIRST",
  CapedDelegationDescNullsLast = "capedDelegation_DESC_NULLS_LAST",
  ClaimableRewardAsc = "claimableReward_ASC",
  ClaimableRewardAscNullsFirst = "claimableReward_ASC_NULLS_FIRST",
  ClaimableRewardAscNullsLast = "claimableReward_ASC_NULLS_LAST",
  ClaimableRewardDesc = "claimableReward_DESC",
  ClaimableRewardDescNullsFirst = "claimableReward_DESC_NULLS_FIRST",
  ClaimableRewardDescNullsLast = "claimableReward_DESC_NULLS_LAST",
  ClaimedRewardAsc = "claimedReward_ASC",
  ClaimedRewardAscNullsFirst = "claimedReward_ASC_NULLS_FIRST",
  ClaimedRewardAscNullsLast = "claimedReward_ASC_NULLS_LAST",
  ClaimedRewardDesc = "claimedReward_DESC",
  ClaimedRewardDescNullsFirst = "claimedReward_DESC_NULLS_FIRST",
  ClaimedRewardDescNullsLast = "claimedReward_DESC_NULLS_LAST",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtAscNullsFirst = "createdAt_ASC_NULLS_FIRST",
  CreatedAtAscNullsLast = "createdAt_ASC_NULLS_LAST",
  CreatedAtDesc = "createdAt_DESC",
  CreatedAtDescNullsFirst = "createdAt_DESC_NULLS_FIRST",
  CreatedAtDescNullsLast = "createdAt_DESC_NULLS_LAST",
  DTenureAsc = "dTenure_ASC",
  DTenureAscNullsFirst = "dTenure_ASC_NULLS_FIRST",
  DTenureAscNullsLast = "dTenure_ASC_NULLS_LAST",
  DTenureDesc = "dTenure_DESC",
  DTenureDescNullsFirst = "dTenure_DESC_NULLS_FIRST",
  DTenureDescNullsLast = "dTenure_DESC_NULLS_LAST",
  DelegationCountAsc = "delegationCount_ASC",
  DelegationCountAscNullsFirst = "delegationCount_ASC_NULLS_FIRST",
  DelegationCountAscNullsLast = "delegationCount_ASC_NULLS_LAST",
  DelegationCountDesc = "delegationCount_DESC",
  DelegationCountDescNullsFirst = "delegationCount_DESC_NULLS_FIRST",
  DelegationCountDescNullsLast = "delegationCount_DESC_NULLS_LAST",
  DescriptionAsc = "description_ASC",
  DescriptionAscNullsFirst = "description_ASC_NULLS_FIRST",
  DescriptionAscNullsLast = "description_ASC_NULLS_LAST",
  DescriptionDesc = "description_DESC",
  DescriptionDescNullsFirst = "description_DESC_NULLS_FIRST",
  DescriptionDescNullsLast = "description_DESC_NULLS_LAST",
  DialOkAsc = "dialOk_ASC",
  DialOkAscNullsFirst = "dialOk_ASC_NULLS_FIRST",
  DialOkAscNullsLast = "dialOk_ASC_NULLS_LAST",
  DialOkDesc = "dialOk_DESC",
  DialOkDescNullsFirst = "dialOk_DESC_NULLS_FIRST",
  DialOkDescNullsLast = "dialOk_DESC_NULLS_LAST",
  EmailAsc = "email_ASC",
  EmailAscNullsFirst = "email_ASC_NULLS_FIRST",
  EmailAscNullsLast = "email_ASC_NULLS_LAST",
  EmailDesc = "email_DESC",
  EmailDescNullsFirst = "email_DESC_NULLS_FIRST",
  EmailDescNullsLast = "email_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  JailReasonAsc = "jailReason_ASC",
  JailReasonAscNullsFirst = "jailReason_ASC_NULLS_FIRST",
  JailReasonAscNullsLast = "jailReason_ASC_NULLS_LAST",
  JailReasonDesc = "jailReason_DESC",
  JailReasonDescNullsFirst = "jailReason_DESC_NULLS_FIRST",
  JailReasonDescNullsLast = "jailReason_DESC_NULLS_LAST",
  JailedAsc = "jailed_ASC",
  JailedAscNullsFirst = "jailed_ASC_NULLS_FIRST",
  JailedAscNullsLast = "jailed_ASC_NULLS_LAST",
  JailedDesc = "jailed_DESC",
  JailedDescNullsFirst = "jailed_DESC_NULLS_FIRST",
  JailedDescNullsLast = "jailed_DESC_NULLS_LAST",
  LivenessAsc = "liveness_ASC",
  LivenessAscNullsFirst = "liveness_ASC_NULLS_FIRST",
  LivenessAscNullsLast = "liveness_ASC_NULLS_LAST",
  LivenessDesc = "liveness_DESC",
  LivenessDescNullsFirst = "liveness_DESC_NULLS_FIRST",
  LivenessDescNullsLast = "liveness_DESC_NULLS_LAST",
  LockEndAsc = "lockEnd_ASC",
  LockEndAscNullsFirst = "lockEnd_ASC_NULLS_FIRST",
  LockEndAscNullsLast = "lockEnd_ASC_NULLS_LAST",
  LockEndDesc = "lockEnd_DESC",
  LockEndDescNullsFirst = "lockEnd_DESC_NULLS_FIRST",
  LockEndDescNullsLast = "lockEnd_DESC_NULLS_LAST",
  LockStartAsc = "lockStart_ASC",
  LockStartAscNullsFirst = "lockStart_ASC_NULLS_FIRST",
  LockStartAscNullsLast = "lockStart_ASC_NULLS_LAST",
  LockStartDesc = "lockStart_DESC",
  LockStartDescNullsFirst = "lockStart_DESC_NULLS_FIRST",
  LockStartDescNullsLast = "lockStart_DESC_NULLS_LAST",
  LockedAsc = "locked_ASC",
  LockedAscNullsFirst = "locked_ASC_NULLS_FIRST",
  LockedAscNullsLast = "locked_ASC_NULLS_LAST",
  LockedDesc = "locked_DESC",
  LockedDescNullsFirst = "locked_DESC_NULLS_FIRST",
  LockedDescNullsLast = "locked_DESC_NULLS_LAST",
  NameAsc = "name_ASC",
  NameAscNullsFirst = "name_ASC_NULLS_FIRST",
  NameAscNullsLast = "name_ASC_NULLS_LAST",
  NameDesc = "name_DESC",
  NameDescNullsFirst = "name_DESC_NULLS_FIRST",
  NameDescNullsLast = "name_DESC_NULLS_LAST",
  OnlineAsc = "online_ASC",
  OnlineAscNullsFirst = "online_ASC_NULLS_FIRST",
  OnlineAscNullsLast = "online_ASC_NULLS_LAST",
  OnlineDesc = "online_DESC",
  OnlineDescNullsFirst = "online_DESC_NULLS_FIRST",
  OnlineDescNullsLast = "online_DESC_NULLS_LAST",
  OwnerBalanceAsc = "owner_balance_ASC",
  OwnerBalanceAscNullsFirst = "owner_balance_ASC_NULLS_FIRST",
  OwnerBalanceAscNullsLast = "owner_balance_ASC_NULLS_LAST",
  OwnerBalanceDesc = "owner_balance_DESC",
  OwnerBalanceDescNullsFirst = "owner_balance_DESC_NULLS_FIRST",
  OwnerBalanceDescNullsLast = "owner_balance_DESC_NULLS_LAST",
  OwnerClaimableDelegationCountAsc = "owner_claimableDelegationCount_ASC",
  OwnerClaimableDelegationCountAscNullsFirst = "owner_claimableDelegationCount_ASC_NULLS_FIRST",
  OwnerClaimableDelegationCountAscNullsLast = "owner_claimableDelegationCount_ASC_NULLS_LAST",
  OwnerClaimableDelegationCountDesc = "owner_claimableDelegationCount_DESC",
  OwnerClaimableDelegationCountDescNullsFirst = "owner_claimableDelegationCount_DESC_NULLS_FIRST",
  OwnerClaimableDelegationCountDescNullsLast = "owner_claimableDelegationCount_DESC_NULLS_LAST",
  OwnerIdAsc = "owner_id_ASC",
  OwnerIdAscNullsFirst = "owner_id_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "owner_id_ASC_NULLS_LAST",
  OwnerIdDesc = "owner_id_DESC",
  OwnerIdDescNullsFirst = "owner_id_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "owner_id_DESC_NULLS_LAST",
  OwnerTypeAsc = "owner_type_ASC",
  OwnerTypeAscNullsFirst = "owner_type_ASC_NULLS_FIRST",
  OwnerTypeAscNullsLast = "owner_type_ASC_NULLS_LAST",
  OwnerTypeDesc = "owner_type_DESC",
  OwnerTypeDescNullsFirst = "owner_type_DESC_NULLS_FIRST",
  OwnerTypeDescNullsLast = "owner_type_DESC_NULLS_LAST",
  PeerIdAsc = "peerId_ASC",
  PeerIdAscNullsFirst = "peerId_ASC_NULLS_FIRST",
  PeerIdAscNullsLast = "peerId_ASC_NULLS_LAST",
  PeerIdDesc = "peerId_DESC",
  PeerIdDescNullsFirst = "peerId_DESC_NULLS_FIRST",
  PeerIdDescNullsLast = "peerId_DESC_NULLS_LAST",
  Queries24HoursAsc = "queries24Hours_ASC",
  Queries24HoursAscNullsFirst = "queries24Hours_ASC_NULLS_FIRST",
  Queries24HoursAscNullsLast = "queries24Hours_ASC_NULLS_LAST",
  Queries24HoursDesc = "queries24Hours_DESC",
  Queries24HoursDescNullsFirst = "queries24Hours_DESC_NULLS_FIRST",
  Queries24HoursDescNullsLast = "queries24Hours_DESC_NULLS_LAST",
  Queries90DaysAsc = "queries90Days_ASC",
  Queries90DaysAscNullsFirst = "queries90Days_ASC_NULLS_FIRST",
  Queries90DaysAscNullsLast = "queries90Days_ASC_NULLS_LAST",
  Queries90DaysDesc = "queries90Days_DESC",
  Queries90DaysDescNullsFirst = "queries90Days_DESC_NULLS_FIRST",
  Queries90DaysDescNullsLast = "queries90Days_DESC_NULLS_LAST",
  RealOwnerBalanceAsc = "realOwner_balance_ASC",
  RealOwnerBalanceAscNullsFirst = "realOwner_balance_ASC_NULLS_FIRST",
  RealOwnerBalanceAscNullsLast = "realOwner_balance_ASC_NULLS_LAST",
  RealOwnerBalanceDesc = "realOwner_balance_DESC",
  RealOwnerBalanceDescNullsFirst = "realOwner_balance_DESC_NULLS_FIRST",
  RealOwnerBalanceDescNullsLast = "realOwner_balance_DESC_NULLS_LAST",
  RealOwnerClaimableDelegationCountAsc = "realOwner_claimableDelegationCount_ASC",
  RealOwnerClaimableDelegationCountAscNullsFirst = "realOwner_claimableDelegationCount_ASC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountAscNullsLast = "realOwner_claimableDelegationCount_ASC_NULLS_LAST",
  RealOwnerClaimableDelegationCountDesc = "realOwner_claimableDelegationCount_DESC",
  RealOwnerClaimableDelegationCountDescNullsFirst = "realOwner_claimableDelegationCount_DESC_NULLS_FIRST",
  RealOwnerClaimableDelegationCountDescNullsLast = "realOwner_claimableDelegationCount_DESC_NULLS_LAST",
  RealOwnerIdAsc = "realOwner_id_ASC",
  RealOwnerIdAscNullsFirst = "realOwner_id_ASC_NULLS_FIRST",
  RealOwnerIdAscNullsLast = "realOwner_id_ASC_NULLS_LAST",
  RealOwnerIdDesc = "realOwner_id_DESC",
  RealOwnerIdDescNullsFirst = "realOwner_id_DESC_NULLS_FIRST",
  RealOwnerIdDescNullsLast = "realOwner_id_DESC_NULLS_LAST",
  RealOwnerTypeAsc = "realOwner_type_ASC",
  RealOwnerTypeAscNullsFirst = "realOwner_type_ASC_NULLS_FIRST",
  RealOwnerTypeAscNullsLast = "realOwner_type_ASC_NULLS_LAST",
  RealOwnerTypeDesc = "realOwner_type_DESC",
  RealOwnerTypeDescNullsFirst = "realOwner_type_DESC_NULLS_FIRST",
  RealOwnerTypeDescNullsLast = "realOwner_type_DESC_NULLS_LAST",
  ScannedData24HoursAsc = "scannedData24Hours_ASC",
  ScannedData24HoursAscNullsFirst = "scannedData24Hours_ASC_NULLS_FIRST",
  ScannedData24HoursAscNullsLast = "scannedData24Hours_ASC_NULLS_LAST",
  ScannedData24HoursDesc = "scannedData24Hours_DESC",
  ScannedData24HoursDescNullsFirst = "scannedData24Hours_DESC_NULLS_FIRST",
  ScannedData24HoursDescNullsLast = "scannedData24Hours_DESC_NULLS_LAST",
  ScannedData90DaysAsc = "scannedData90Days_ASC",
  ScannedData90DaysAscNullsFirst = "scannedData90Days_ASC_NULLS_FIRST",
  ScannedData90DaysAscNullsLast = "scannedData90Days_ASC_NULLS_LAST",
  ScannedData90DaysDesc = "scannedData90Days_DESC",
  ScannedData90DaysDescNullsFirst = "scannedData90Days_DESC_NULLS_FIRST",
  ScannedData90DaysDescNullsLast = "scannedData90Days_DESC_NULLS_LAST",
  ServedData24HoursAsc = "servedData24Hours_ASC",
  ServedData24HoursAscNullsFirst = "servedData24Hours_ASC_NULLS_FIRST",
  ServedData24HoursAscNullsLast = "servedData24Hours_ASC_NULLS_LAST",
  ServedData24HoursDesc = "servedData24Hours_DESC",
  ServedData24HoursDescNullsFirst = "servedData24Hours_DESC_NULLS_FIRST",
  ServedData24HoursDescNullsLast = "servedData24Hours_DESC_NULLS_LAST",
  ServedData90DaysAsc = "servedData90Days_ASC",
  ServedData90DaysAscNullsFirst = "servedData90Days_ASC_NULLS_FIRST",
  ServedData90DaysAscNullsLast = "servedData90Days_ASC_NULLS_LAST",
  ServedData90DaysDesc = "servedData90Days_DESC",
  ServedData90DaysDescNullsFirst = "servedData90Days_DESC_NULLS_FIRST",
  ServedData90DaysDescNullsLast = "servedData90Days_DESC_NULLS_LAST",
  StakerAprAsc = "stakerApr_ASC",
  StakerAprAscNullsFirst = "stakerApr_ASC_NULLS_FIRST",
  StakerAprAscNullsLast = "stakerApr_ASC_NULLS_LAST",
  StakerAprDesc = "stakerApr_DESC",
  StakerAprDescNullsFirst = "stakerApr_DESC_NULLS_FIRST",
  StakerAprDescNullsLast = "stakerApr_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
  StoredDataAsc = "storedData_ASC",
  StoredDataAscNullsFirst = "storedData_ASC_NULLS_FIRST",
  StoredDataAscNullsLast = "storedData_ASC_NULLS_LAST",
  StoredDataDesc = "storedData_DESC",
  StoredDataDescNullsFirst = "storedData_DESC_NULLS_FIRST",
  StoredDataDescNullsLast = "storedData_DESC_NULLS_LAST",
  TotalDelegationRewardsAsc = "totalDelegationRewards_ASC",
  TotalDelegationRewardsAscNullsFirst = "totalDelegationRewards_ASC_NULLS_FIRST",
  TotalDelegationRewardsAscNullsLast = "totalDelegationRewards_ASC_NULLS_LAST",
  TotalDelegationRewardsDesc = "totalDelegationRewards_DESC",
  TotalDelegationRewardsDescNullsFirst = "totalDelegationRewards_DESC_NULLS_FIRST",
  TotalDelegationRewardsDescNullsLast = "totalDelegationRewards_DESC_NULLS_LAST",
  TotalDelegationAsc = "totalDelegation_ASC",
  TotalDelegationAscNullsFirst = "totalDelegation_ASC_NULLS_FIRST",
  TotalDelegationAscNullsLast = "totalDelegation_ASC_NULLS_LAST",
  TotalDelegationDesc = "totalDelegation_DESC",
  TotalDelegationDescNullsFirst = "totalDelegation_DESC_NULLS_FIRST",
  TotalDelegationDescNullsLast = "totalDelegation_DESC_NULLS_LAST",
  TrafficWeightAsc = "trafficWeight_ASC",
  TrafficWeightAscNullsFirst = "trafficWeight_ASC_NULLS_FIRST",
  TrafficWeightAscNullsLast = "trafficWeight_ASC_NULLS_LAST",
  TrafficWeightDesc = "trafficWeight_DESC",
  TrafficWeightDescNullsFirst = "trafficWeight_DESC_NULLS_FIRST",
  TrafficWeightDescNullsLast = "trafficWeight_DESC_NULLS_LAST",
  Uptime24HoursAsc = "uptime24Hours_ASC",
  Uptime24HoursAscNullsFirst = "uptime24Hours_ASC_NULLS_FIRST",
  Uptime24HoursAscNullsLast = "uptime24Hours_ASC_NULLS_LAST",
  Uptime24HoursDesc = "uptime24Hours_DESC",
  Uptime24HoursDescNullsFirst = "uptime24Hours_DESC_NULLS_FIRST",
  Uptime24HoursDescNullsLast = "uptime24Hours_DESC_NULLS_LAST",
  Uptime90DaysAsc = "uptime90Days_ASC",
  Uptime90DaysAscNullsFirst = "uptime90Days_ASC_NULLS_FIRST",
  Uptime90DaysAscNullsLast = "uptime90Days_ASC_NULLS_LAST",
  Uptime90DaysDesc = "uptime90Days_DESC",
  Uptime90DaysDescNullsFirst = "uptime90Days_DESC_NULLS_FIRST",
  Uptime90DaysDescNullsLast = "uptime90Days_DESC_NULLS_LAST",
  VersionAsc = "version_ASC",
  VersionAscNullsFirst = "version_ASC_NULLS_FIRST",
  VersionAscNullsLast = "version_ASC_NULLS_LAST",
  VersionDesc = "version_DESC",
  VersionDescNullsFirst = "version_DESC_NULLS_FIRST",
  VersionDescNullsLast = "version_DESC_NULLS_LAST",
  WebsiteAsc = "website_ASC",
  WebsiteAscNullsFirst = "website_ASC_NULLS_FIRST",
  WebsiteAscNullsLast = "website_ASC_NULLS_LAST",
  WebsiteDesc = "website_DESC",
  WebsiteDescNullsFirst = "website_DESC_NULLS_FIRST",
  WebsiteDescNullsLast = "website_DESC_NULLS_LAST",
}

export type WorkerReward = {
  __typename?: "WorkerReward";
  amount: Scalars["BigInt"]["output"];
  apr: Scalars["Float"]["output"];
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  stakerApr: Scalars["Float"]["output"];
  stakersReward: Scalars["BigInt"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  worker: Worker;
};

export type WorkerRewardEdge = {
  __typename?: "WorkerRewardEdge";
  cursor: Scalars["String"]["output"];
  node: WorkerReward;
};

export enum WorkerRewardOrderByInput {
  AmountAsc = "amount_ASC",
  AmountAscNullsFirst = "amount_ASC_NULLS_FIRST",
  AmountAscNullsLast = "amount_ASC_NULLS_LAST",
  AmountDesc = "amount_DESC",
  AmountDescNullsFirst = "amount_DESC_NULLS_FIRST",
  AmountDescNullsLast = "amount_DESC_NULLS_LAST",
  AprAsc = "apr_ASC",
  AprAscNullsFirst = "apr_ASC_NULLS_FIRST",
  AprAscNullsLast = "apr_ASC_NULLS_LAST",
  AprDesc = "apr_DESC",
  AprDescNullsFirst = "apr_DESC_NULLS_FIRST",
  AprDescNullsLast = "apr_DESC_NULLS_LAST",
  BlockNumberAsc = "blockNumber_ASC",
  BlockNumberAscNullsFirst = "blockNumber_ASC_NULLS_FIRST",
  BlockNumberAscNullsLast = "blockNumber_ASC_NULLS_LAST",
  BlockNumberDesc = "blockNumber_DESC",
  BlockNumberDescNullsFirst = "blockNumber_DESC_NULLS_FIRST",
  BlockNumberDescNullsLast = "blockNumber_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  StakerAprAsc = "stakerApr_ASC",
  StakerAprAscNullsFirst = "stakerApr_ASC_NULLS_FIRST",
  StakerAprAscNullsLast = "stakerApr_ASC_NULLS_LAST",
  StakerAprDesc = "stakerApr_DESC",
  StakerAprDescNullsFirst = "stakerApr_DESC_NULLS_FIRST",
  StakerAprDescNullsLast = "stakerApr_DESC_NULLS_LAST",
  StakersRewardAsc = "stakersReward_ASC",
  StakersRewardAscNullsFirst = "stakersReward_ASC_NULLS_FIRST",
  StakersRewardAscNullsLast = "stakersReward_ASC_NULLS_LAST",
  StakersRewardDesc = "stakersReward_DESC",
  StakersRewardDescNullsFirst = "stakersReward_DESC_NULLS_FIRST",
  StakersRewardDescNullsLast = "stakersReward_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  WorkerAprAsc = "worker_apr_ASC",
  WorkerAprAscNullsFirst = "worker_apr_ASC_NULLS_FIRST",
  WorkerAprAscNullsLast = "worker_apr_ASC_NULLS_LAST",
  WorkerAprDesc = "worker_apr_DESC",
  WorkerAprDescNullsFirst = "worker_apr_DESC_NULLS_FIRST",
  WorkerAprDescNullsLast = "worker_apr_DESC_NULLS_LAST",
  WorkerBondAsc = "worker_bond_ASC",
  WorkerBondAscNullsFirst = "worker_bond_ASC_NULLS_FIRST",
  WorkerBondAscNullsLast = "worker_bond_ASC_NULLS_LAST",
  WorkerBondDesc = "worker_bond_DESC",
  WorkerBondDescNullsFirst = "worker_bond_DESC_NULLS_FIRST",
  WorkerBondDescNullsLast = "worker_bond_DESC_NULLS_LAST",
  WorkerCapedDelegationAsc = "worker_capedDelegation_ASC",
  WorkerCapedDelegationAscNullsFirst = "worker_capedDelegation_ASC_NULLS_FIRST",
  WorkerCapedDelegationAscNullsLast = "worker_capedDelegation_ASC_NULLS_LAST",
  WorkerCapedDelegationDesc = "worker_capedDelegation_DESC",
  WorkerCapedDelegationDescNullsFirst = "worker_capedDelegation_DESC_NULLS_FIRST",
  WorkerCapedDelegationDescNullsLast = "worker_capedDelegation_DESC_NULLS_LAST",
  WorkerClaimableRewardAsc = "worker_claimableReward_ASC",
  WorkerClaimableRewardAscNullsFirst = "worker_claimableReward_ASC_NULLS_FIRST",
  WorkerClaimableRewardAscNullsLast = "worker_claimableReward_ASC_NULLS_LAST",
  WorkerClaimableRewardDesc = "worker_claimableReward_DESC",
  WorkerClaimableRewardDescNullsFirst = "worker_claimableReward_DESC_NULLS_FIRST",
  WorkerClaimableRewardDescNullsLast = "worker_claimableReward_DESC_NULLS_LAST",
  WorkerClaimedRewardAsc = "worker_claimedReward_ASC",
  WorkerClaimedRewardAscNullsFirst = "worker_claimedReward_ASC_NULLS_FIRST",
  WorkerClaimedRewardAscNullsLast = "worker_claimedReward_ASC_NULLS_LAST",
  WorkerClaimedRewardDesc = "worker_claimedReward_DESC",
  WorkerClaimedRewardDescNullsFirst = "worker_claimedReward_DESC_NULLS_FIRST",
  WorkerClaimedRewardDescNullsLast = "worker_claimedReward_DESC_NULLS_LAST",
  WorkerCreatedAtAsc = "worker_createdAt_ASC",
  WorkerCreatedAtAscNullsFirst = "worker_createdAt_ASC_NULLS_FIRST",
  WorkerCreatedAtAscNullsLast = "worker_createdAt_ASC_NULLS_LAST",
  WorkerCreatedAtDesc = "worker_createdAt_DESC",
  WorkerCreatedAtDescNullsFirst = "worker_createdAt_DESC_NULLS_FIRST",
  WorkerCreatedAtDescNullsLast = "worker_createdAt_DESC_NULLS_LAST",
  WorkerDTenureAsc = "worker_dTenure_ASC",
  WorkerDTenureAscNullsFirst = "worker_dTenure_ASC_NULLS_FIRST",
  WorkerDTenureAscNullsLast = "worker_dTenure_ASC_NULLS_LAST",
  WorkerDTenureDesc = "worker_dTenure_DESC",
  WorkerDTenureDescNullsFirst = "worker_dTenure_DESC_NULLS_FIRST",
  WorkerDTenureDescNullsLast = "worker_dTenure_DESC_NULLS_LAST",
  WorkerDelegationCountAsc = "worker_delegationCount_ASC",
  WorkerDelegationCountAscNullsFirst = "worker_delegationCount_ASC_NULLS_FIRST",
  WorkerDelegationCountAscNullsLast = "worker_delegationCount_ASC_NULLS_LAST",
  WorkerDelegationCountDesc = "worker_delegationCount_DESC",
  WorkerDelegationCountDescNullsFirst = "worker_delegationCount_DESC_NULLS_FIRST",
  WorkerDelegationCountDescNullsLast = "worker_delegationCount_DESC_NULLS_LAST",
  WorkerDescriptionAsc = "worker_description_ASC",
  WorkerDescriptionAscNullsFirst = "worker_description_ASC_NULLS_FIRST",
  WorkerDescriptionAscNullsLast = "worker_description_ASC_NULLS_LAST",
  WorkerDescriptionDesc = "worker_description_DESC",
  WorkerDescriptionDescNullsFirst = "worker_description_DESC_NULLS_FIRST",
  WorkerDescriptionDescNullsLast = "worker_description_DESC_NULLS_LAST",
  WorkerDialOkAsc = "worker_dialOk_ASC",
  WorkerDialOkAscNullsFirst = "worker_dialOk_ASC_NULLS_FIRST",
  WorkerDialOkAscNullsLast = "worker_dialOk_ASC_NULLS_LAST",
  WorkerDialOkDesc = "worker_dialOk_DESC",
  WorkerDialOkDescNullsFirst = "worker_dialOk_DESC_NULLS_FIRST",
  WorkerDialOkDescNullsLast = "worker_dialOk_DESC_NULLS_LAST",
  WorkerEmailAsc = "worker_email_ASC",
  WorkerEmailAscNullsFirst = "worker_email_ASC_NULLS_FIRST",
  WorkerEmailAscNullsLast = "worker_email_ASC_NULLS_LAST",
  WorkerEmailDesc = "worker_email_DESC",
  WorkerEmailDescNullsFirst = "worker_email_DESC_NULLS_FIRST",
  WorkerEmailDescNullsLast = "worker_email_DESC_NULLS_LAST",
  WorkerIdAsc = "worker_id_ASC",
  WorkerIdAscNullsFirst = "worker_id_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "worker_id_ASC_NULLS_LAST",
  WorkerIdDesc = "worker_id_DESC",
  WorkerIdDescNullsFirst = "worker_id_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "worker_id_DESC_NULLS_LAST",
  WorkerJailReasonAsc = "worker_jailReason_ASC",
  WorkerJailReasonAscNullsFirst = "worker_jailReason_ASC_NULLS_FIRST",
  WorkerJailReasonAscNullsLast = "worker_jailReason_ASC_NULLS_LAST",
  WorkerJailReasonDesc = "worker_jailReason_DESC",
  WorkerJailReasonDescNullsFirst = "worker_jailReason_DESC_NULLS_FIRST",
  WorkerJailReasonDescNullsLast = "worker_jailReason_DESC_NULLS_LAST",
  WorkerJailedAsc = "worker_jailed_ASC",
  WorkerJailedAscNullsFirst = "worker_jailed_ASC_NULLS_FIRST",
  WorkerJailedAscNullsLast = "worker_jailed_ASC_NULLS_LAST",
  WorkerJailedDesc = "worker_jailed_DESC",
  WorkerJailedDescNullsFirst = "worker_jailed_DESC_NULLS_FIRST",
  WorkerJailedDescNullsLast = "worker_jailed_DESC_NULLS_LAST",
  WorkerLivenessAsc = "worker_liveness_ASC",
  WorkerLivenessAscNullsFirst = "worker_liveness_ASC_NULLS_FIRST",
  WorkerLivenessAscNullsLast = "worker_liveness_ASC_NULLS_LAST",
  WorkerLivenessDesc = "worker_liveness_DESC",
  WorkerLivenessDescNullsFirst = "worker_liveness_DESC_NULLS_FIRST",
  WorkerLivenessDescNullsLast = "worker_liveness_DESC_NULLS_LAST",
  WorkerLockEndAsc = "worker_lockEnd_ASC",
  WorkerLockEndAscNullsFirst = "worker_lockEnd_ASC_NULLS_FIRST",
  WorkerLockEndAscNullsLast = "worker_lockEnd_ASC_NULLS_LAST",
  WorkerLockEndDesc = "worker_lockEnd_DESC",
  WorkerLockEndDescNullsFirst = "worker_lockEnd_DESC_NULLS_FIRST",
  WorkerLockEndDescNullsLast = "worker_lockEnd_DESC_NULLS_LAST",
  WorkerLockStartAsc = "worker_lockStart_ASC",
  WorkerLockStartAscNullsFirst = "worker_lockStart_ASC_NULLS_FIRST",
  WorkerLockStartAscNullsLast = "worker_lockStart_ASC_NULLS_LAST",
  WorkerLockStartDesc = "worker_lockStart_DESC",
  WorkerLockStartDescNullsFirst = "worker_lockStart_DESC_NULLS_FIRST",
  WorkerLockStartDescNullsLast = "worker_lockStart_DESC_NULLS_LAST",
  WorkerLockedAsc = "worker_locked_ASC",
  WorkerLockedAscNullsFirst = "worker_locked_ASC_NULLS_FIRST",
  WorkerLockedAscNullsLast = "worker_locked_ASC_NULLS_LAST",
  WorkerLockedDesc = "worker_locked_DESC",
  WorkerLockedDescNullsFirst = "worker_locked_DESC_NULLS_FIRST",
  WorkerLockedDescNullsLast = "worker_locked_DESC_NULLS_LAST",
  WorkerNameAsc = "worker_name_ASC",
  WorkerNameAscNullsFirst = "worker_name_ASC_NULLS_FIRST",
  WorkerNameAscNullsLast = "worker_name_ASC_NULLS_LAST",
  WorkerNameDesc = "worker_name_DESC",
  WorkerNameDescNullsFirst = "worker_name_DESC_NULLS_FIRST",
  WorkerNameDescNullsLast = "worker_name_DESC_NULLS_LAST",
  WorkerOnlineAsc = "worker_online_ASC",
  WorkerOnlineAscNullsFirst = "worker_online_ASC_NULLS_FIRST",
  WorkerOnlineAscNullsLast = "worker_online_ASC_NULLS_LAST",
  WorkerOnlineDesc = "worker_online_DESC",
  WorkerOnlineDescNullsFirst = "worker_online_DESC_NULLS_FIRST",
  WorkerOnlineDescNullsLast = "worker_online_DESC_NULLS_LAST",
  WorkerPeerIdAsc = "worker_peerId_ASC",
  WorkerPeerIdAscNullsFirst = "worker_peerId_ASC_NULLS_FIRST",
  WorkerPeerIdAscNullsLast = "worker_peerId_ASC_NULLS_LAST",
  WorkerPeerIdDesc = "worker_peerId_DESC",
  WorkerPeerIdDescNullsFirst = "worker_peerId_DESC_NULLS_FIRST",
  WorkerPeerIdDescNullsLast = "worker_peerId_DESC_NULLS_LAST",
  WorkerQueries24HoursAsc = "worker_queries24Hours_ASC",
  WorkerQueries24HoursAscNullsFirst = "worker_queries24Hours_ASC_NULLS_FIRST",
  WorkerQueries24HoursAscNullsLast = "worker_queries24Hours_ASC_NULLS_LAST",
  WorkerQueries24HoursDesc = "worker_queries24Hours_DESC",
  WorkerQueries24HoursDescNullsFirst = "worker_queries24Hours_DESC_NULLS_FIRST",
  WorkerQueries24HoursDescNullsLast = "worker_queries24Hours_DESC_NULLS_LAST",
  WorkerQueries90DaysAsc = "worker_queries90Days_ASC",
  WorkerQueries90DaysAscNullsFirst = "worker_queries90Days_ASC_NULLS_FIRST",
  WorkerQueries90DaysAscNullsLast = "worker_queries90Days_ASC_NULLS_LAST",
  WorkerQueries90DaysDesc = "worker_queries90Days_DESC",
  WorkerQueries90DaysDescNullsFirst = "worker_queries90Days_DESC_NULLS_FIRST",
  WorkerQueries90DaysDescNullsLast = "worker_queries90Days_DESC_NULLS_LAST",
  WorkerScannedData24HoursAsc = "worker_scannedData24Hours_ASC",
  WorkerScannedData24HoursAscNullsFirst = "worker_scannedData24Hours_ASC_NULLS_FIRST",
  WorkerScannedData24HoursAscNullsLast = "worker_scannedData24Hours_ASC_NULLS_LAST",
  WorkerScannedData24HoursDesc = "worker_scannedData24Hours_DESC",
  WorkerScannedData24HoursDescNullsFirst = "worker_scannedData24Hours_DESC_NULLS_FIRST",
  WorkerScannedData24HoursDescNullsLast = "worker_scannedData24Hours_DESC_NULLS_LAST",
  WorkerScannedData90DaysAsc = "worker_scannedData90Days_ASC",
  WorkerScannedData90DaysAscNullsFirst = "worker_scannedData90Days_ASC_NULLS_FIRST",
  WorkerScannedData90DaysAscNullsLast = "worker_scannedData90Days_ASC_NULLS_LAST",
  WorkerScannedData90DaysDesc = "worker_scannedData90Days_DESC",
  WorkerScannedData90DaysDescNullsFirst = "worker_scannedData90Days_DESC_NULLS_FIRST",
  WorkerScannedData90DaysDescNullsLast = "worker_scannedData90Days_DESC_NULLS_LAST",
  WorkerServedData24HoursAsc = "worker_servedData24Hours_ASC",
  WorkerServedData24HoursAscNullsFirst = "worker_servedData24Hours_ASC_NULLS_FIRST",
  WorkerServedData24HoursAscNullsLast = "worker_servedData24Hours_ASC_NULLS_LAST",
  WorkerServedData24HoursDesc = "worker_servedData24Hours_DESC",
  WorkerServedData24HoursDescNullsFirst = "worker_servedData24Hours_DESC_NULLS_FIRST",
  WorkerServedData24HoursDescNullsLast = "worker_servedData24Hours_DESC_NULLS_LAST",
  WorkerServedData90DaysAsc = "worker_servedData90Days_ASC",
  WorkerServedData90DaysAscNullsFirst = "worker_servedData90Days_ASC_NULLS_FIRST",
  WorkerServedData90DaysAscNullsLast = "worker_servedData90Days_ASC_NULLS_LAST",
  WorkerServedData90DaysDesc = "worker_servedData90Days_DESC",
  WorkerServedData90DaysDescNullsFirst = "worker_servedData90Days_DESC_NULLS_FIRST",
  WorkerServedData90DaysDescNullsLast = "worker_servedData90Days_DESC_NULLS_LAST",
  WorkerStakerAprAsc = "worker_stakerApr_ASC",
  WorkerStakerAprAscNullsFirst = "worker_stakerApr_ASC_NULLS_FIRST",
  WorkerStakerAprAscNullsLast = "worker_stakerApr_ASC_NULLS_LAST",
  WorkerStakerAprDesc = "worker_stakerApr_DESC",
  WorkerStakerAprDescNullsFirst = "worker_stakerApr_DESC_NULLS_FIRST",
  WorkerStakerAprDescNullsLast = "worker_stakerApr_DESC_NULLS_LAST",
  WorkerStatusAsc = "worker_status_ASC",
  WorkerStatusAscNullsFirst = "worker_status_ASC_NULLS_FIRST",
  WorkerStatusAscNullsLast = "worker_status_ASC_NULLS_LAST",
  WorkerStatusDesc = "worker_status_DESC",
  WorkerStatusDescNullsFirst = "worker_status_DESC_NULLS_FIRST",
  WorkerStatusDescNullsLast = "worker_status_DESC_NULLS_LAST",
  WorkerStoredDataAsc = "worker_storedData_ASC",
  WorkerStoredDataAscNullsFirst = "worker_storedData_ASC_NULLS_FIRST",
  WorkerStoredDataAscNullsLast = "worker_storedData_ASC_NULLS_LAST",
  WorkerStoredDataDesc = "worker_storedData_DESC",
  WorkerStoredDataDescNullsFirst = "worker_storedData_DESC_NULLS_FIRST",
  WorkerStoredDataDescNullsLast = "worker_storedData_DESC_NULLS_LAST",
  WorkerTotalDelegationRewardsAsc = "worker_totalDelegationRewards_ASC",
  WorkerTotalDelegationRewardsAscNullsFirst = "worker_totalDelegationRewards_ASC_NULLS_FIRST",
  WorkerTotalDelegationRewardsAscNullsLast = "worker_totalDelegationRewards_ASC_NULLS_LAST",
  WorkerTotalDelegationRewardsDesc = "worker_totalDelegationRewards_DESC",
  WorkerTotalDelegationRewardsDescNullsFirst = "worker_totalDelegationRewards_DESC_NULLS_FIRST",
  WorkerTotalDelegationRewardsDescNullsLast = "worker_totalDelegationRewards_DESC_NULLS_LAST",
  WorkerTotalDelegationAsc = "worker_totalDelegation_ASC",
  WorkerTotalDelegationAscNullsFirst = "worker_totalDelegation_ASC_NULLS_FIRST",
  WorkerTotalDelegationAscNullsLast = "worker_totalDelegation_ASC_NULLS_LAST",
  WorkerTotalDelegationDesc = "worker_totalDelegation_DESC",
  WorkerTotalDelegationDescNullsFirst = "worker_totalDelegation_DESC_NULLS_FIRST",
  WorkerTotalDelegationDescNullsLast = "worker_totalDelegation_DESC_NULLS_LAST",
  WorkerTrafficWeightAsc = "worker_trafficWeight_ASC",
  WorkerTrafficWeightAscNullsFirst = "worker_trafficWeight_ASC_NULLS_FIRST",
  WorkerTrafficWeightAscNullsLast = "worker_trafficWeight_ASC_NULLS_LAST",
  WorkerTrafficWeightDesc = "worker_trafficWeight_DESC",
  WorkerTrafficWeightDescNullsFirst = "worker_trafficWeight_DESC_NULLS_FIRST",
  WorkerTrafficWeightDescNullsLast = "worker_trafficWeight_DESC_NULLS_LAST",
  WorkerUptime24HoursAsc = "worker_uptime24Hours_ASC",
  WorkerUptime24HoursAscNullsFirst = "worker_uptime24Hours_ASC_NULLS_FIRST",
  WorkerUptime24HoursAscNullsLast = "worker_uptime24Hours_ASC_NULLS_LAST",
  WorkerUptime24HoursDesc = "worker_uptime24Hours_DESC",
  WorkerUptime24HoursDescNullsFirst = "worker_uptime24Hours_DESC_NULLS_FIRST",
  WorkerUptime24HoursDescNullsLast = "worker_uptime24Hours_DESC_NULLS_LAST",
  WorkerUptime90DaysAsc = "worker_uptime90Days_ASC",
  WorkerUptime90DaysAscNullsFirst = "worker_uptime90Days_ASC_NULLS_FIRST",
  WorkerUptime90DaysAscNullsLast = "worker_uptime90Days_ASC_NULLS_LAST",
  WorkerUptime90DaysDesc = "worker_uptime90Days_DESC",
  WorkerUptime90DaysDescNullsFirst = "worker_uptime90Days_DESC_NULLS_FIRST",
  WorkerUptime90DaysDescNullsLast = "worker_uptime90Days_DESC_NULLS_LAST",
  WorkerVersionAsc = "worker_version_ASC",
  WorkerVersionAscNullsFirst = "worker_version_ASC_NULLS_FIRST",
  WorkerVersionAscNullsLast = "worker_version_ASC_NULLS_LAST",
  WorkerVersionDesc = "worker_version_DESC",
  WorkerVersionDescNullsFirst = "worker_version_DESC_NULLS_FIRST",
  WorkerVersionDescNullsLast = "worker_version_DESC_NULLS_LAST",
  WorkerWebsiteAsc = "worker_website_ASC",
  WorkerWebsiteAscNullsFirst = "worker_website_ASC_NULLS_FIRST",
  WorkerWebsiteAscNullsLast = "worker_website_ASC_NULLS_LAST",
  WorkerWebsiteDesc = "worker_website_DESC",
  WorkerWebsiteDescNullsFirst = "worker_website_DESC_NULLS_FIRST",
  WorkerWebsiteDescNullsLast = "worker_website_DESC_NULLS_LAST",
}

export type WorkerRewardWhereInput = {
  AND?: InputMaybe<Array<WorkerRewardWhereInput>>;
  OR?: InputMaybe<Array<WorkerRewardWhereInput>>;
  amount_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  apr_eq?: InputMaybe<Scalars["Float"]["input"]>;
  apr_gt?: InputMaybe<Scalars["Float"]["input"]>;
  apr_gte?: InputMaybe<Scalars["Float"]["input"]>;
  apr_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  apr_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  apr_lt?: InputMaybe<Scalars["Float"]["input"]>;
  apr_lte?: InputMaybe<Scalars["Float"]["input"]>;
  apr_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  apr_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  blockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  stakerApr_eq?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_gt?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_gte?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  stakerApr_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  stakerApr_lt?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_lte?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  stakersReward_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  stakersReward_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  stakersReward_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  stakersReward_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  stakersReward_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  stakersReward_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  stakersReward_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  stakersReward_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  stakersReward_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  worker?: InputMaybe<WorkerWhereInput>;
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type WorkerRewardsConnection = {
  __typename?: "WorkerRewardsConnection";
  edges: Array<WorkerRewardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type WorkerSnapshot = {
  __typename?: "WorkerSnapshot";
  epoch: Epoch;
  id: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
  worker: Worker;
};

export type WorkerSnapshotDay = {
  __typename?: "WorkerSnapshotDay";
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
};

export type WorkerSnapshotEdge = {
  __typename?: "WorkerSnapshotEdge";
  cursor: Scalars["String"]["output"];
  node: WorkerSnapshot;
};

export enum WorkerSnapshotOrderByInput {
  EpochEndAsc = "epoch_end_ASC",
  EpochEndAscNullsFirst = "epoch_end_ASC_NULLS_FIRST",
  EpochEndAscNullsLast = "epoch_end_ASC_NULLS_LAST",
  EpochEndDesc = "epoch_end_DESC",
  EpochEndDescNullsFirst = "epoch_end_DESC_NULLS_FIRST",
  EpochEndDescNullsLast = "epoch_end_DESC_NULLS_LAST",
  EpochEndedAtAsc = "epoch_endedAt_ASC",
  EpochEndedAtAscNullsFirst = "epoch_endedAt_ASC_NULLS_FIRST",
  EpochEndedAtAscNullsLast = "epoch_endedAt_ASC_NULLS_LAST",
  EpochEndedAtDesc = "epoch_endedAt_DESC",
  EpochEndedAtDescNullsFirst = "epoch_endedAt_DESC_NULLS_FIRST",
  EpochEndedAtDescNullsLast = "epoch_endedAt_DESC_NULLS_LAST",
  EpochIdAsc = "epoch_id_ASC",
  EpochIdAscNullsFirst = "epoch_id_ASC_NULLS_FIRST",
  EpochIdAscNullsLast = "epoch_id_ASC_NULLS_LAST",
  EpochIdDesc = "epoch_id_DESC",
  EpochIdDescNullsFirst = "epoch_id_DESC_NULLS_FIRST",
  EpochIdDescNullsLast = "epoch_id_DESC_NULLS_LAST",
  EpochNumberAsc = "epoch_number_ASC",
  EpochNumberAscNullsFirst = "epoch_number_ASC_NULLS_FIRST",
  EpochNumberAscNullsLast = "epoch_number_ASC_NULLS_LAST",
  EpochNumberDesc = "epoch_number_DESC",
  EpochNumberDescNullsFirst = "epoch_number_DESC_NULLS_FIRST",
  EpochNumberDescNullsLast = "epoch_number_DESC_NULLS_LAST",
  EpochStartAsc = "epoch_start_ASC",
  EpochStartAscNullsFirst = "epoch_start_ASC_NULLS_FIRST",
  EpochStartAscNullsLast = "epoch_start_ASC_NULLS_LAST",
  EpochStartDesc = "epoch_start_DESC",
  EpochStartDescNullsFirst = "epoch_start_DESC_NULLS_FIRST",
  EpochStartDescNullsLast = "epoch_start_DESC_NULLS_LAST",
  EpochStartedAtAsc = "epoch_startedAt_ASC",
  EpochStartedAtAscNullsFirst = "epoch_startedAt_ASC_NULLS_FIRST",
  EpochStartedAtAscNullsLast = "epoch_startedAt_ASC_NULLS_LAST",
  EpochStartedAtDesc = "epoch_startedAt_DESC",
  EpochStartedAtDescNullsFirst = "epoch_startedAt_DESC_NULLS_FIRST",
  EpochStartedAtDescNullsLast = "epoch_startedAt_DESC_NULLS_LAST",
  EpochStatusAsc = "epoch_status_ASC",
  EpochStatusAscNullsFirst = "epoch_status_ASC_NULLS_FIRST",
  EpochStatusAscNullsLast = "epoch_status_ASC_NULLS_LAST",
  EpochStatusDesc = "epoch_status_DESC",
  EpochStatusDescNullsFirst = "epoch_status_DESC_NULLS_FIRST",
  EpochStatusDescNullsLast = "epoch_status_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  UptimeAsc = "uptime_ASC",
  UptimeAscNullsFirst = "uptime_ASC_NULLS_FIRST",
  UptimeAscNullsLast = "uptime_ASC_NULLS_LAST",
  UptimeDesc = "uptime_DESC",
  UptimeDescNullsFirst = "uptime_DESC_NULLS_FIRST",
  UptimeDescNullsLast = "uptime_DESC_NULLS_LAST",
  WorkerAprAsc = "worker_apr_ASC",
  WorkerAprAscNullsFirst = "worker_apr_ASC_NULLS_FIRST",
  WorkerAprAscNullsLast = "worker_apr_ASC_NULLS_LAST",
  WorkerAprDesc = "worker_apr_DESC",
  WorkerAprDescNullsFirst = "worker_apr_DESC_NULLS_FIRST",
  WorkerAprDescNullsLast = "worker_apr_DESC_NULLS_LAST",
  WorkerBondAsc = "worker_bond_ASC",
  WorkerBondAscNullsFirst = "worker_bond_ASC_NULLS_FIRST",
  WorkerBondAscNullsLast = "worker_bond_ASC_NULLS_LAST",
  WorkerBondDesc = "worker_bond_DESC",
  WorkerBondDescNullsFirst = "worker_bond_DESC_NULLS_FIRST",
  WorkerBondDescNullsLast = "worker_bond_DESC_NULLS_LAST",
  WorkerCapedDelegationAsc = "worker_capedDelegation_ASC",
  WorkerCapedDelegationAscNullsFirst = "worker_capedDelegation_ASC_NULLS_FIRST",
  WorkerCapedDelegationAscNullsLast = "worker_capedDelegation_ASC_NULLS_LAST",
  WorkerCapedDelegationDesc = "worker_capedDelegation_DESC",
  WorkerCapedDelegationDescNullsFirst = "worker_capedDelegation_DESC_NULLS_FIRST",
  WorkerCapedDelegationDescNullsLast = "worker_capedDelegation_DESC_NULLS_LAST",
  WorkerClaimableRewardAsc = "worker_claimableReward_ASC",
  WorkerClaimableRewardAscNullsFirst = "worker_claimableReward_ASC_NULLS_FIRST",
  WorkerClaimableRewardAscNullsLast = "worker_claimableReward_ASC_NULLS_LAST",
  WorkerClaimableRewardDesc = "worker_claimableReward_DESC",
  WorkerClaimableRewardDescNullsFirst = "worker_claimableReward_DESC_NULLS_FIRST",
  WorkerClaimableRewardDescNullsLast = "worker_claimableReward_DESC_NULLS_LAST",
  WorkerClaimedRewardAsc = "worker_claimedReward_ASC",
  WorkerClaimedRewardAscNullsFirst = "worker_claimedReward_ASC_NULLS_FIRST",
  WorkerClaimedRewardAscNullsLast = "worker_claimedReward_ASC_NULLS_LAST",
  WorkerClaimedRewardDesc = "worker_claimedReward_DESC",
  WorkerClaimedRewardDescNullsFirst = "worker_claimedReward_DESC_NULLS_FIRST",
  WorkerClaimedRewardDescNullsLast = "worker_claimedReward_DESC_NULLS_LAST",
  WorkerCreatedAtAsc = "worker_createdAt_ASC",
  WorkerCreatedAtAscNullsFirst = "worker_createdAt_ASC_NULLS_FIRST",
  WorkerCreatedAtAscNullsLast = "worker_createdAt_ASC_NULLS_LAST",
  WorkerCreatedAtDesc = "worker_createdAt_DESC",
  WorkerCreatedAtDescNullsFirst = "worker_createdAt_DESC_NULLS_FIRST",
  WorkerCreatedAtDescNullsLast = "worker_createdAt_DESC_NULLS_LAST",
  WorkerDTenureAsc = "worker_dTenure_ASC",
  WorkerDTenureAscNullsFirst = "worker_dTenure_ASC_NULLS_FIRST",
  WorkerDTenureAscNullsLast = "worker_dTenure_ASC_NULLS_LAST",
  WorkerDTenureDesc = "worker_dTenure_DESC",
  WorkerDTenureDescNullsFirst = "worker_dTenure_DESC_NULLS_FIRST",
  WorkerDTenureDescNullsLast = "worker_dTenure_DESC_NULLS_LAST",
  WorkerDelegationCountAsc = "worker_delegationCount_ASC",
  WorkerDelegationCountAscNullsFirst = "worker_delegationCount_ASC_NULLS_FIRST",
  WorkerDelegationCountAscNullsLast = "worker_delegationCount_ASC_NULLS_LAST",
  WorkerDelegationCountDesc = "worker_delegationCount_DESC",
  WorkerDelegationCountDescNullsFirst = "worker_delegationCount_DESC_NULLS_FIRST",
  WorkerDelegationCountDescNullsLast = "worker_delegationCount_DESC_NULLS_LAST",
  WorkerDescriptionAsc = "worker_description_ASC",
  WorkerDescriptionAscNullsFirst = "worker_description_ASC_NULLS_FIRST",
  WorkerDescriptionAscNullsLast = "worker_description_ASC_NULLS_LAST",
  WorkerDescriptionDesc = "worker_description_DESC",
  WorkerDescriptionDescNullsFirst = "worker_description_DESC_NULLS_FIRST",
  WorkerDescriptionDescNullsLast = "worker_description_DESC_NULLS_LAST",
  WorkerDialOkAsc = "worker_dialOk_ASC",
  WorkerDialOkAscNullsFirst = "worker_dialOk_ASC_NULLS_FIRST",
  WorkerDialOkAscNullsLast = "worker_dialOk_ASC_NULLS_LAST",
  WorkerDialOkDesc = "worker_dialOk_DESC",
  WorkerDialOkDescNullsFirst = "worker_dialOk_DESC_NULLS_FIRST",
  WorkerDialOkDescNullsLast = "worker_dialOk_DESC_NULLS_LAST",
  WorkerEmailAsc = "worker_email_ASC",
  WorkerEmailAscNullsFirst = "worker_email_ASC_NULLS_FIRST",
  WorkerEmailAscNullsLast = "worker_email_ASC_NULLS_LAST",
  WorkerEmailDesc = "worker_email_DESC",
  WorkerEmailDescNullsFirst = "worker_email_DESC_NULLS_FIRST",
  WorkerEmailDescNullsLast = "worker_email_DESC_NULLS_LAST",
  WorkerIdAsc = "worker_id_ASC",
  WorkerIdAscNullsFirst = "worker_id_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "worker_id_ASC_NULLS_LAST",
  WorkerIdDesc = "worker_id_DESC",
  WorkerIdDescNullsFirst = "worker_id_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "worker_id_DESC_NULLS_LAST",
  WorkerJailReasonAsc = "worker_jailReason_ASC",
  WorkerJailReasonAscNullsFirst = "worker_jailReason_ASC_NULLS_FIRST",
  WorkerJailReasonAscNullsLast = "worker_jailReason_ASC_NULLS_LAST",
  WorkerJailReasonDesc = "worker_jailReason_DESC",
  WorkerJailReasonDescNullsFirst = "worker_jailReason_DESC_NULLS_FIRST",
  WorkerJailReasonDescNullsLast = "worker_jailReason_DESC_NULLS_LAST",
  WorkerJailedAsc = "worker_jailed_ASC",
  WorkerJailedAscNullsFirst = "worker_jailed_ASC_NULLS_FIRST",
  WorkerJailedAscNullsLast = "worker_jailed_ASC_NULLS_LAST",
  WorkerJailedDesc = "worker_jailed_DESC",
  WorkerJailedDescNullsFirst = "worker_jailed_DESC_NULLS_FIRST",
  WorkerJailedDescNullsLast = "worker_jailed_DESC_NULLS_LAST",
  WorkerLivenessAsc = "worker_liveness_ASC",
  WorkerLivenessAscNullsFirst = "worker_liveness_ASC_NULLS_FIRST",
  WorkerLivenessAscNullsLast = "worker_liveness_ASC_NULLS_LAST",
  WorkerLivenessDesc = "worker_liveness_DESC",
  WorkerLivenessDescNullsFirst = "worker_liveness_DESC_NULLS_FIRST",
  WorkerLivenessDescNullsLast = "worker_liveness_DESC_NULLS_LAST",
  WorkerLockEndAsc = "worker_lockEnd_ASC",
  WorkerLockEndAscNullsFirst = "worker_lockEnd_ASC_NULLS_FIRST",
  WorkerLockEndAscNullsLast = "worker_lockEnd_ASC_NULLS_LAST",
  WorkerLockEndDesc = "worker_lockEnd_DESC",
  WorkerLockEndDescNullsFirst = "worker_lockEnd_DESC_NULLS_FIRST",
  WorkerLockEndDescNullsLast = "worker_lockEnd_DESC_NULLS_LAST",
  WorkerLockStartAsc = "worker_lockStart_ASC",
  WorkerLockStartAscNullsFirst = "worker_lockStart_ASC_NULLS_FIRST",
  WorkerLockStartAscNullsLast = "worker_lockStart_ASC_NULLS_LAST",
  WorkerLockStartDesc = "worker_lockStart_DESC",
  WorkerLockStartDescNullsFirst = "worker_lockStart_DESC_NULLS_FIRST",
  WorkerLockStartDescNullsLast = "worker_lockStart_DESC_NULLS_LAST",
  WorkerLockedAsc = "worker_locked_ASC",
  WorkerLockedAscNullsFirst = "worker_locked_ASC_NULLS_FIRST",
  WorkerLockedAscNullsLast = "worker_locked_ASC_NULLS_LAST",
  WorkerLockedDesc = "worker_locked_DESC",
  WorkerLockedDescNullsFirst = "worker_locked_DESC_NULLS_FIRST",
  WorkerLockedDescNullsLast = "worker_locked_DESC_NULLS_LAST",
  WorkerNameAsc = "worker_name_ASC",
  WorkerNameAscNullsFirst = "worker_name_ASC_NULLS_FIRST",
  WorkerNameAscNullsLast = "worker_name_ASC_NULLS_LAST",
  WorkerNameDesc = "worker_name_DESC",
  WorkerNameDescNullsFirst = "worker_name_DESC_NULLS_FIRST",
  WorkerNameDescNullsLast = "worker_name_DESC_NULLS_LAST",
  WorkerOnlineAsc = "worker_online_ASC",
  WorkerOnlineAscNullsFirst = "worker_online_ASC_NULLS_FIRST",
  WorkerOnlineAscNullsLast = "worker_online_ASC_NULLS_LAST",
  WorkerOnlineDesc = "worker_online_DESC",
  WorkerOnlineDescNullsFirst = "worker_online_DESC_NULLS_FIRST",
  WorkerOnlineDescNullsLast = "worker_online_DESC_NULLS_LAST",
  WorkerPeerIdAsc = "worker_peerId_ASC",
  WorkerPeerIdAscNullsFirst = "worker_peerId_ASC_NULLS_FIRST",
  WorkerPeerIdAscNullsLast = "worker_peerId_ASC_NULLS_LAST",
  WorkerPeerIdDesc = "worker_peerId_DESC",
  WorkerPeerIdDescNullsFirst = "worker_peerId_DESC_NULLS_FIRST",
  WorkerPeerIdDescNullsLast = "worker_peerId_DESC_NULLS_LAST",
  WorkerQueries24HoursAsc = "worker_queries24Hours_ASC",
  WorkerQueries24HoursAscNullsFirst = "worker_queries24Hours_ASC_NULLS_FIRST",
  WorkerQueries24HoursAscNullsLast = "worker_queries24Hours_ASC_NULLS_LAST",
  WorkerQueries24HoursDesc = "worker_queries24Hours_DESC",
  WorkerQueries24HoursDescNullsFirst = "worker_queries24Hours_DESC_NULLS_FIRST",
  WorkerQueries24HoursDescNullsLast = "worker_queries24Hours_DESC_NULLS_LAST",
  WorkerQueries90DaysAsc = "worker_queries90Days_ASC",
  WorkerQueries90DaysAscNullsFirst = "worker_queries90Days_ASC_NULLS_FIRST",
  WorkerQueries90DaysAscNullsLast = "worker_queries90Days_ASC_NULLS_LAST",
  WorkerQueries90DaysDesc = "worker_queries90Days_DESC",
  WorkerQueries90DaysDescNullsFirst = "worker_queries90Days_DESC_NULLS_FIRST",
  WorkerQueries90DaysDescNullsLast = "worker_queries90Days_DESC_NULLS_LAST",
  WorkerScannedData24HoursAsc = "worker_scannedData24Hours_ASC",
  WorkerScannedData24HoursAscNullsFirst = "worker_scannedData24Hours_ASC_NULLS_FIRST",
  WorkerScannedData24HoursAscNullsLast = "worker_scannedData24Hours_ASC_NULLS_LAST",
  WorkerScannedData24HoursDesc = "worker_scannedData24Hours_DESC",
  WorkerScannedData24HoursDescNullsFirst = "worker_scannedData24Hours_DESC_NULLS_FIRST",
  WorkerScannedData24HoursDescNullsLast = "worker_scannedData24Hours_DESC_NULLS_LAST",
  WorkerScannedData90DaysAsc = "worker_scannedData90Days_ASC",
  WorkerScannedData90DaysAscNullsFirst = "worker_scannedData90Days_ASC_NULLS_FIRST",
  WorkerScannedData90DaysAscNullsLast = "worker_scannedData90Days_ASC_NULLS_LAST",
  WorkerScannedData90DaysDesc = "worker_scannedData90Days_DESC",
  WorkerScannedData90DaysDescNullsFirst = "worker_scannedData90Days_DESC_NULLS_FIRST",
  WorkerScannedData90DaysDescNullsLast = "worker_scannedData90Days_DESC_NULLS_LAST",
  WorkerServedData24HoursAsc = "worker_servedData24Hours_ASC",
  WorkerServedData24HoursAscNullsFirst = "worker_servedData24Hours_ASC_NULLS_FIRST",
  WorkerServedData24HoursAscNullsLast = "worker_servedData24Hours_ASC_NULLS_LAST",
  WorkerServedData24HoursDesc = "worker_servedData24Hours_DESC",
  WorkerServedData24HoursDescNullsFirst = "worker_servedData24Hours_DESC_NULLS_FIRST",
  WorkerServedData24HoursDescNullsLast = "worker_servedData24Hours_DESC_NULLS_LAST",
  WorkerServedData90DaysAsc = "worker_servedData90Days_ASC",
  WorkerServedData90DaysAscNullsFirst = "worker_servedData90Days_ASC_NULLS_FIRST",
  WorkerServedData90DaysAscNullsLast = "worker_servedData90Days_ASC_NULLS_LAST",
  WorkerServedData90DaysDesc = "worker_servedData90Days_DESC",
  WorkerServedData90DaysDescNullsFirst = "worker_servedData90Days_DESC_NULLS_FIRST",
  WorkerServedData90DaysDescNullsLast = "worker_servedData90Days_DESC_NULLS_LAST",
  WorkerStakerAprAsc = "worker_stakerApr_ASC",
  WorkerStakerAprAscNullsFirst = "worker_stakerApr_ASC_NULLS_FIRST",
  WorkerStakerAprAscNullsLast = "worker_stakerApr_ASC_NULLS_LAST",
  WorkerStakerAprDesc = "worker_stakerApr_DESC",
  WorkerStakerAprDescNullsFirst = "worker_stakerApr_DESC_NULLS_FIRST",
  WorkerStakerAprDescNullsLast = "worker_stakerApr_DESC_NULLS_LAST",
  WorkerStatusAsc = "worker_status_ASC",
  WorkerStatusAscNullsFirst = "worker_status_ASC_NULLS_FIRST",
  WorkerStatusAscNullsLast = "worker_status_ASC_NULLS_LAST",
  WorkerStatusDesc = "worker_status_DESC",
  WorkerStatusDescNullsFirst = "worker_status_DESC_NULLS_FIRST",
  WorkerStatusDescNullsLast = "worker_status_DESC_NULLS_LAST",
  WorkerStoredDataAsc = "worker_storedData_ASC",
  WorkerStoredDataAscNullsFirst = "worker_storedData_ASC_NULLS_FIRST",
  WorkerStoredDataAscNullsLast = "worker_storedData_ASC_NULLS_LAST",
  WorkerStoredDataDesc = "worker_storedData_DESC",
  WorkerStoredDataDescNullsFirst = "worker_storedData_DESC_NULLS_FIRST",
  WorkerStoredDataDescNullsLast = "worker_storedData_DESC_NULLS_LAST",
  WorkerTotalDelegationRewardsAsc = "worker_totalDelegationRewards_ASC",
  WorkerTotalDelegationRewardsAscNullsFirst = "worker_totalDelegationRewards_ASC_NULLS_FIRST",
  WorkerTotalDelegationRewardsAscNullsLast = "worker_totalDelegationRewards_ASC_NULLS_LAST",
  WorkerTotalDelegationRewardsDesc = "worker_totalDelegationRewards_DESC",
  WorkerTotalDelegationRewardsDescNullsFirst = "worker_totalDelegationRewards_DESC_NULLS_FIRST",
  WorkerTotalDelegationRewardsDescNullsLast = "worker_totalDelegationRewards_DESC_NULLS_LAST",
  WorkerTotalDelegationAsc = "worker_totalDelegation_ASC",
  WorkerTotalDelegationAscNullsFirst = "worker_totalDelegation_ASC_NULLS_FIRST",
  WorkerTotalDelegationAscNullsLast = "worker_totalDelegation_ASC_NULLS_LAST",
  WorkerTotalDelegationDesc = "worker_totalDelegation_DESC",
  WorkerTotalDelegationDescNullsFirst = "worker_totalDelegation_DESC_NULLS_FIRST",
  WorkerTotalDelegationDescNullsLast = "worker_totalDelegation_DESC_NULLS_LAST",
  WorkerTrafficWeightAsc = "worker_trafficWeight_ASC",
  WorkerTrafficWeightAscNullsFirst = "worker_trafficWeight_ASC_NULLS_FIRST",
  WorkerTrafficWeightAscNullsLast = "worker_trafficWeight_ASC_NULLS_LAST",
  WorkerTrafficWeightDesc = "worker_trafficWeight_DESC",
  WorkerTrafficWeightDescNullsFirst = "worker_trafficWeight_DESC_NULLS_FIRST",
  WorkerTrafficWeightDescNullsLast = "worker_trafficWeight_DESC_NULLS_LAST",
  WorkerUptime24HoursAsc = "worker_uptime24Hours_ASC",
  WorkerUptime24HoursAscNullsFirst = "worker_uptime24Hours_ASC_NULLS_FIRST",
  WorkerUptime24HoursAscNullsLast = "worker_uptime24Hours_ASC_NULLS_LAST",
  WorkerUptime24HoursDesc = "worker_uptime24Hours_DESC",
  WorkerUptime24HoursDescNullsFirst = "worker_uptime24Hours_DESC_NULLS_FIRST",
  WorkerUptime24HoursDescNullsLast = "worker_uptime24Hours_DESC_NULLS_LAST",
  WorkerUptime90DaysAsc = "worker_uptime90Days_ASC",
  WorkerUptime90DaysAscNullsFirst = "worker_uptime90Days_ASC_NULLS_FIRST",
  WorkerUptime90DaysAscNullsLast = "worker_uptime90Days_ASC_NULLS_LAST",
  WorkerUptime90DaysDesc = "worker_uptime90Days_DESC",
  WorkerUptime90DaysDescNullsFirst = "worker_uptime90Days_DESC_NULLS_FIRST",
  WorkerUptime90DaysDescNullsLast = "worker_uptime90Days_DESC_NULLS_LAST",
  WorkerVersionAsc = "worker_version_ASC",
  WorkerVersionAscNullsFirst = "worker_version_ASC_NULLS_FIRST",
  WorkerVersionAscNullsLast = "worker_version_ASC_NULLS_LAST",
  WorkerVersionDesc = "worker_version_DESC",
  WorkerVersionDescNullsFirst = "worker_version_DESC_NULLS_FIRST",
  WorkerVersionDescNullsLast = "worker_version_DESC_NULLS_LAST",
  WorkerWebsiteAsc = "worker_website_ASC",
  WorkerWebsiteAscNullsFirst = "worker_website_ASC_NULLS_FIRST",
  WorkerWebsiteAscNullsLast = "worker_website_ASC_NULLS_LAST",
  WorkerWebsiteDesc = "worker_website_DESC",
  WorkerWebsiteDescNullsFirst = "worker_website_DESC_NULLS_FIRST",
  WorkerWebsiteDescNullsLast = "worker_website_DESC_NULLS_LAST",
}

export type WorkerSnapshotWhereInput = {
  AND?: InputMaybe<Array<WorkerSnapshotWhereInput>>;
  OR?: InputMaybe<Array<WorkerSnapshotWhereInput>>;
  epoch?: InputMaybe<EpochWhereInput>;
  epoch_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  uptime_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_gt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_gte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  uptime_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  uptime_lt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_lte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  worker?: InputMaybe<WorkerWhereInput>;
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type WorkerSnapshotsConnection = {
  __typename?: "WorkerSnapshotsConnection";
  edges: Array<WorkerSnapshotEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum WorkerStatus {
  Active = "ACTIVE",
  Deregistered = "DEREGISTERED",
  Deregistering = "DEREGISTERING",
  Registering = "REGISTERING",
  Unknown = "UNKNOWN",
  Withdrawn = "WITHDRAWN",
}

export type WorkerStatusChange = {
  __typename?: "WorkerStatusChange";
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  pending: Scalars["Boolean"]["output"];
  status: WorkerStatus;
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
  worker: Worker;
};

export type WorkerStatusChangeEdge = {
  __typename?: "WorkerStatusChangeEdge";
  cursor: Scalars["String"]["output"];
  node: WorkerStatusChange;
};

export enum WorkerStatusChangeOrderByInput {
  BlockNumberAsc = "blockNumber_ASC",
  BlockNumberAscNullsFirst = "blockNumber_ASC_NULLS_FIRST",
  BlockNumberAscNullsLast = "blockNumber_ASC_NULLS_LAST",
  BlockNumberDesc = "blockNumber_DESC",
  BlockNumberDescNullsFirst = "blockNumber_DESC_NULLS_FIRST",
  BlockNumberDescNullsLast = "blockNumber_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  PendingAsc = "pending_ASC",
  PendingAscNullsFirst = "pending_ASC_NULLS_FIRST",
  PendingAscNullsLast = "pending_ASC_NULLS_LAST",
  PendingDesc = "pending_DESC",
  PendingDescNullsFirst = "pending_DESC_NULLS_FIRST",
  PendingDescNullsLast = "pending_DESC_NULLS_LAST",
  StatusAsc = "status_ASC",
  StatusAscNullsFirst = "status_ASC_NULLS_FIRST",
  StatusAscNullsLast = "status_ASC_NULLS_LAST",
  StatusDesc = "status_DESC",
  StatusDescNullsFirst = "status_DESC_NULLS_FIRST",
  StatusDescNullsLast = "status_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  WorkerAprAsc = "worker_apr_ASC",
  WorkerAprAscNullsFirst = "worker_apr_ASC_NULLS_FIRST",
  WorkerAprAscNullsLast = "worker_apr_ASC_NULLS_LAST",
  WorkerAprDesc = "worker_apr_DESC",
  WorkerAprDescNullsFirst = "worker_apr_DESC_NULLS_FIRST",
  WorkerAprDescNullsLast = "worker_apr_DESC_NULLS_LAST",
  WorkerBondAsc = "worker_bond_ASC",
  WorkerBondAscNullsFirst = "worker_bond_ASC_NULLS_FIRST",
  WorkerBondAscNullsLast = "worker_bond_ASC_NULLS_LAST",
  WorkerBondDesc = "worker_bond_DESC",
  WorkerBondDescNullsFirst = "worker_bond_DESC_NULLS_FIRST",
  WorkerBondDescNullsLast = "worker_bond_DESC_NULLS_LAST",
  WorkerCapedDelegationAsc = "worker_capedDelegation_ASC",
  WorkerCapedDelegationAscNullsFirst = "worker_capedDelegation_ASC_NULLS_FIRST",
  WorkerCapedDelegationAscNullsLast = "worker_capedDelegation_ASC_NULLS_LAST",
  WorkerCapedDelegationDesc = "worker_capedDelegation_DESC",
  WorkerCapedDelegationDescNullsFirst = "worker_capedDelegation_DESC_NULLS_FIRST",
  WorkerCapedDelegationDescNullsLast = "worker_capedDelegation_DESC_NULLS_LAST",
  WorkerClaimableRewardAsc = "worker_claimableReward_ASC",
  WorkerClaimableRewardAscNullsFirst = "worker_claimableReward_ASC_NULLS_FIRST",
  WorkerClaimableRewardAscNullsLast = "worker_claimableReward_ASC_NULLS_LAST",
  WorkerClaimableRewardDesc = "worker_claimableReward_DESC",
  WorkerClaimableRewardDescNullsFirst = "worker_claimableReward_DESC_NULLS_FIRST",
  WorkerClaimableRewardDescNullsLast = "worker_claimableReward_DESC_NULLS_LAST",
  WorkerClaimedRewardAsc = "worker_claimedReward_ASC",
  WorkerClaimedRewardAscNullsFirst = "worker_claimedReward_ASC_NULLS_FIRST",
  WorkerClaimedRewardAscNullsLast = "worker_claimedReward_ASC_NULLS_LAST",
  WorkerClaimedRewardDesc = "worker_claimedReward_DESC",
  WorkerClaimedRewardDescNullsFirst = "worker_claimedReward_DESC_NULLS_FIRST",
  WorkerClaimedRewardDescNullsLast = "worker_claimedReward_DESC_NULLS_LAST",
  WorkerCreatedAtAsc = "worker_createdAt_ASC",
  WorkerCreatedAtAscNullsFirst = "worker_createdAt_ASC_NULLS_FIRST",
  WorkerCreatedAtAscNullsLast = "worker_createdAt_ASC_NULLS_LAST",
  WorkerCreatedAtDesc = "worker_createdAt_DESC",
  WorkerCreatedAtDescNullsFirst = "worker_createdAt_DESC_NULLS_FIRST",
  WorkerCreatedAtDescNullsLast = "worker_createdAt_DESC_NULLS_LAST",
  WorkerDTenureAsc = "worker_dTenure_ASC",
  WorkerDTenureAscNullsFirst = "worker_dTenure_ASC_NULLS_FIRST",
  WorkerDTenureAscNullsLast = "worker_dTenure_ASC_NULLS_LAST",
  WorkerDTenureDesc = "worker_dTenure_DESC",
  WorkerDTenureDescNullsFirst = "worker_dTenure_DESC_NULLS_FIRST",
  WorkerDTenureDescNullsLast = "worker_dTenure_DESC_NULLS_LAST",
  WorkerDelegationCountAsc = "worker_delegationCount_ASC",
  WorkerDelegationCountAscNullsFirst = "worker_delegationCount_ASC_NULLS_FIRST",
  WorkerDelegationCountAscNullsLast = "worker_delegationCount_ASC_NULLS_LAST",
  WorkerDelegationCountDesc = "worker_delegationCount_DESC",
  WorkerDelegationCountDescNullsFirst = "worker_delegationCount_DESC_NULLS_FIRST",
  WorkerDelegationCountDescNullsLast = "worker_delegationCount_DESC_NULLS_LAST",
  WorkerDescriptionAsc = "worker_description_ASC",
  WorkerDescriptionAscNullsFirst = "worker_description_ASC_NULLS_FIRST",
  WorkerDescriptionAscNullsLast = "worker_description_ASC_NULLS_LAST",
  WorkerDescriptionDesc = "worker_description_DESC",
  WorkerDescriptionDescNullsFirst = "worker_description_DESC_NULLS_FIRST",
  WorkerDescriptionDescNullsLast = "worker_description_DESC_NULLS_LAST",
  WorkerDialOkAsc = "worker_dialOk_ASC",
  WorkerDialOkAscNullsFirst = "worker_dialOk_ASC_NULLS_FIRST",
  WorkerDialOkAscNullsLast = "worker_dialOk_ASC_NULLS_LAST",
  WorkerDialOkDesc = "worker_dialOk_DESC",
  WorkerDialOkDescNullsFirst = "worker_dialOk_DESC_NULLS_FIRST",
  WorkerDialOkDescNullsLast = "worker_dialOk_DESC_NULLS_LAST",
  WorkerEmailAsc = "worker_email_ASC",
  WorkerEmailAscNullsFirst = "worker_email_ASC_NULLS_FIRST",
  WorkerEmailAscNullsLast = "worker_email_ASC_NULLS_LAST",
  WorkerEmailDesc = "worker_email_DESC",
  WorkerEmailDescNullsFirst = "worker_email_DESC_NULLS_FIRST",
  WorkerEmailDescNullsLast = "worker_email_DESC_NULLS_LAST",
  WorkerIdAsc = "worker_id_ASC",
  WorkerIdAscNullsFirst = "worker_id_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "worker_id_ASC_NULLS_LAST",
  WorkerIdDesc = "worker_id_DESC",
  WorkerIdDescNullsFirst = "worker_id_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "worker_id_DESC_NULLS_LAST",
  WorkerJailReasonAsc = "worker_jailReason_ASC",
  WorkerJailReasonAscNullsFirst = "worker_jailReason_ASC_NULLS_FIRST",
  WorkerJailReasonAscNullsLast = "worker_jailReason_ASC_NULLS_LAST",
  WorkerJailReasonDesc = "worker_jailReason_DESC",
  WorkerJailReasonDescNullsFirst = "worker_jailReason_DESC_NULLS_FIRST",
  WorkerJailReasonDescNullsLast = "worker_jailReason_DESC_NULLS_LAST",
  WorkerJailedAsc = "worker_jailed_ASC",
  WorkerJailedAscNullsFirst = "worker_jailed_ASC_NULLS_FIRST",
  WorkerJailedAscNullsLast = "worker_jailed_ASC_NULLS_LAST",
  WorkerJailedDesc = "worker_jailed_DESC",
  WorkerJailedDescNullsFirst = "worker_jailed_DESC_NULLS_FIRST",
  WorkerJailedDescNullsLast = "worker_jailed_DESC_NULLS_LAST",
  WorkerLivenessAsc = "worker_liveness_ASC",
  WorkerLivenessAscNullsFirst = "worker_liveness_ASC_NULLS_FIRST",
  WorkerLivenessAscNullsLast = "worker_liveness_ASC_NULLS_LAST",
  WorkerLivenessDesc = "worker_liveness_DESC",
  WorkerLivenessDescNullsFirst = "worker_liveness_DESC_NULLS_FIRST",
  WorkerLivenessDescNullsLast = "worker_liveness_DESC_NULLS_LAST",
  WorkerLockEndAsc = "worker_lockEnd_ASC",
  WorkerLockEndAscNullsFirst = "worker_lockEnd_ASC_NULLS_FIRST",
  WorkerLockEndAscNullsLast = "worker_lockEnd_ASC_NULLS_LAST",
  WorkerLockEndDesc = "worker_lockEnd_DESC",
  WorkerLockEndDescNullsFirst = "worker_lockEnd_DESC_NULLS_FIRST",
  WorkerLockEndDescNullsLast = "worker_lockEnd_DESC_NULLS_LAST",
  WorkerLockStartAsc = "worker_lockStart_ASC",
  WorkerLockStartAscNullsFirst = "worker_lockStart_ASC_NULLS_FIRST",
  WorkerLockStartAscNullsLast = "worker_lockStart_ASC_NULLS_LAST",
  WorkerLockStartDesc = "worker_lockStart_DESC",
  WorkerLockStartDescNullsFirst = "worker_lockStart_DESC_NULLS_FIRST",
  WorkerLockStartDescNullsLast = "worker_lockStart_DESC_NULLS_LAST",
  WorkerLockedAsc = "worker_locked_ASC",
  WorkerLockedAscNullsFirst = "worker_locked_ASC_NULLS_FIRST",
  WorkerLockedAscNullsLast = "worker_locked_ASC_NULLS_LAST",
  WorkerLockedDesc = "worker_locked_DESC",
  WorkerLockedDescNullsFirst = "worker_locked_DESC_NULLS_FIRST",
  WorkerLockedDescNullsLast = "worker_locked_DESC_NULLS_LAST",
  WorkerNameAsc = "worker_name_ASC",
  WorkerNameAscNullsFirst = "worker_name_ASC_NULLS_FIRST",
  WorkerNameAscNullsLast = "worker_name_ASC_NULLS_LAST",
  WorkerNameDesc = "worker_name_DESC",
  WorkerNameDescNullsFirst = "worker_name_DESC_NULLS_FIRST",
  WorkerNameDescNullsLast = "worker_name_DESC_NULLS_LAST",
  WorkerOnlineAsc = "worker_online_ASC",
  WorkerOnlineAscNullsFirst = "worker_online_ASC_NULLS_FIRST",
  WorkerOnlineAscNullsLast = "worker_online_ASC_NULLS_LAST",
  WorkerOnlineDesc = "worker_online_DESC",
  WorkerOnlineDescNullsFirst = "worker_online_DESC_NULLS_FIRST",
  WorkerOnlineDescNullsLast = "worker_online_DESC_NULLS_LAST",
  WorkerPeerIdAsc = "worker_peerId_ASC",
  WorkerPeerIdAscNullsFirst = "worker_peerId_ASC_NULLS_FIRST",
  WorkerPeerIdAscNullsLast = "worker_peerId_ASC_NULLS_LAST",
  WorkerPeerIdDesc = "worker_peerId_DESC",
  WorkerPeerIdDescNullsFirst = "worker_peerId_DESC_NULLS_FIRST",
  WorkerPeerIdDescNullsLast = "worker_peerId_DESC_NULLS_LAST",
  WorkerQueries24HoursAsc = "worker_queries24Hours_ASC",
  WorkerQueries24HoursAscNullsFirst = "worker_queries24Hours_ASC_NULLS_FIRST",
  WorkerQueries24HoursAscNullsLast = "worker_queries24Hours_ASC_NULLS_LAST",
  WorkerQueries24HoursDesc = "worker_queries24Hours_DESC",
  WorkerQueries24HoursDescNullsFirst = "worker_queries24Hours_DESC_NULLS_FIRST",
  WorkerQueries24HoursDescNullsLast = "worker_queries24Hours_DESC_NULLS_LAST",
  WorkerQueries90DaysAsc = "worker_queries90Days_ASC",
  WorkerQueries90DaysAscNullsFirst = "worker_queries90Days_ASC_NULLS_FIRST",
  WorkerQueries90DaysAscNullsLast = "worker_queries90Days_ASC_NULLS_LAST",
  WorkerQueries90DaysDesc = "worker_queries90Days_DESC",
  WorkerQueries90DaysDescNullsFirst = "worker_queries90Days_DESC_NULLS_FIRST",
  WorkerQueries90DaysDescNullsLast = "worker_queries90Days_DESC_NULLS_LAST",
  WorkerScannedData24HoursAsc = "worker_scannedData24Hours_ASC",
  WorkerScannedData24HoursAscNullsFirst = "worker_scannedData24Hours_ASC_NULLS_FIRST",
  WorkerScannedData24HoursAscNullsLast = "worker_scannedData24Hours_ASC_NULLS_LAST",
  WorkerScannedData24HoursDesc = "worker_scannedData24Hours_DESC",
  WorkerScannedData24HoursDescNullsFirst = "worker_scannedData24Hours_DESC_NULLS_FIRST",
  WorkerScannedData24HoursDescNullsLast = "worker_scannedData24Hours_DESC_NULLS_LAST",
  WorkerScannedData90DaysAsc = "worker_scannedData90Days_ASC",
  WorkerScannedData90DaysAscNullsFirst = "worker_scannedData90Days_ASC_NULLS_FIRST",
  WorkerScannedData90DaysAscNullsLast = "worker_scannedData90Days_ASC_NULLS_LAST",
  WorkerScannedData90DaysDesc = "worker_scannedData90Days_DESC",
  WorkerScannedData90DaysDescNullsFirst = "worker_scannedData90Days_DESC_NULLS_FIRST",
  WorkerScannedData90DaysDescNullsLast = "worker_scannedData90Days_DESC_NULLS_LAST",
  WorkerServedData24HoursAsc = "worker_servedData24Hours_ASC",
  WorkerServedData24HoursAscNullsFirst = "worker_servedData24Hours_ASC_NULLS_FIRST",
  WorkerServedData24HoursAscNullsLast = "worker_servedData24Hours_ASC_NULLS_LAST",
  WorkerServedData24HoursDesc = "worker_servedData24Hours_DESC",
  WorkerServedData24HoursDescNullsFirst = "worker_servedData24Hours_DESC_NULLS_FIRST",
  WorkerServedData24HoursDescNullsLast = "worker_servedData24Hours_DESC_NULLS_LAST",
  WorkerServedData90DaysAsc = "worker_servedData90Days_ASC",
  WorkerServedData90DaysAscNullsFirst = "worker_servedData90Days_ASC_NULLS_FIRST",
  WorkerServedData90DaysAscNullsLast = "worker_servedData90Days_ASC_NULLS_LAST",
  WorkerServedData90DaysDesc = "worker_servedData90Days_DESC",
  WorkerServedData90DaysDescNullsFirst = "worker_servedData90Days_DESC_NULLS_FIRST",
  WorkerServedData90DaysDescNullsLast = "worker_servedData90Days_DESC_NULLS_LAST",
  WorkerStakerAprAsc = "worker_stakerApr_ASC",
  WorkerStakerAprAscNullsFirst = "worker_stakerApr_ASC_NULLS_FIRST",
  WorkerStakerAprAscNullsLast = "worker_stakerApr_ASC_NULLS_LAST",
  WorkerStakerAprDesc = "worker_stakerApr_DESC",
  WorkerStakerAprDescNullsFirst = "worker_stakerApr_DESC_NULLS_FIRST",
  WorkerStakerAprDescNullsLast = "worker_stakerApr_DESC_NULLS_LAST",
  WorkerStatusAsc = "worker_status_ASC",
  WorkerStatusAscNullsFirst = "worker_status_ASC_NULLS_FIRST",
  WorkerStatusAscNullsLast = "worker_status_ASC_NULLS_LAST",
  WorkerStatusDesc = "worker_status_DESC",
  WorkerStatusDescNullsFirst = "worker_status_DESC_NULLS_FIRST",
  WorkerStatusDescNullsLast = "worker_status_DESC_NULLS_LAST",
  WorkerStoredDataAsc = "worker_storedData_ASC",
  WorkerStoredDataAscNullsFirst = "worker_storedData_ASC_NULLS_FIRST",
  WorkerStoredDataAscNullsLast = "worker_storedData_ASC_NULLS_LAST",
  WorkerStoredDataDesc = "worker_storedData_DESC",
  WorkerStoredDataDescNullsFirst = "worker_storedData_DESC_NULLS_FIRST",
  WorkerStoredDataDescNullsLast = "worker_storedData_DESC_NULLS_LAST",
  WorkerTotalDelegationRewardsAsc = "worker_totalDelegationRewards_ASC",
  WorkerTotalDelegationRewardsAscNullsFirst = "worker_totalDelegationRewards_ASC_NULLS_FIRST",
  WorkerTotalDelegationRewardsAscNullsLast = "worker_totalDelegationRewards_ASC_NULLS_LAST",
  WorkerTotalDelegationRewardsDesc = "worker_totalDelegationRewards_DESC",
  WorkerTotalDelegationRewardsDescNullsFirst = "worker_totalDelegationRewards_DESC_NULLS_FIRST",
  WorkerTotalDelegationRewardsDescNullsLast = "worker_totalDelegationRewards_DESC_NULLS_LAST",
  WorkerTotalDelegationAsc = "worker_totalDelegation_ASC",
  WorkerTotalDelegationAscNullsFirst = "worker_totalDelegation_ASC_NULLS_FIRST",
  WorkerTotalDelegationAscNullsLast = "worker_totalDelegation_ASC_NULLS_LAST",
  WorkerTotalDelegationDesc = "worker_totalDelegation_DESC",
  WorkerTotalDelegationDescNullsFirst = "worker_totalDelegation_DESC_NULLS_FIRST",
  WorkerTotalDelegationDescNullsLast = "worker_totalDelegation_DESC_NULLS_LAST",
  WorkerTrafficWeightAsc = "worker_trafficWeight_ASC",
  WorkerTrafficWeightAscNullsFirst = "worker_trafficWeight_ASC_NULLS_FIRST",
  WorkerTrafficWeightAscNullsLast = "worker_trafficWeight_ASC_NULLS_LAST",
  WorkerTrafficWeightDesc = "worker_trafficWeight_DESC",
  WorkerTrafficWeightDescNullsFirst = "worker_trafficWeight_DESC_NULLS_FIRST",
  WorkerTrafficWeightDescNullsLast = "worker_trafficWeight_DESC_NULLS_LAST",
  WorkerUptime24HoursAsc = "worker_uptime24Hours_ASC",
  WorkerUptime24HoursAscNullsFirst = "worker_uptime24Hours_ASC_NULLS_FIRST",
  WorkerUptime24HoursAscNullsLast = "worker_uptime24Hours_ASC_NULLS_LAST",
  WorkerUptime24HoursDesc = "worker_uptime24Hours_DESC",
  WorkerUptime24HoursDescNullsFirst = "worker_uptime24Hours_DESC_NULLS_FIRST",
  WorkerUptime24HoursDescNullsLast = "worker_uptime24Hours_DESC_NULLS_LAST",
  WorkerUptime90DaysAsc = "worker_uptime90Days_ASC",
  WorkerUptime90DaysAscNullsFirst = "worker_uptime90Days_ASC_NULLS_FIRST",
  WorkerUptime90DaysAscNullsLast = "worker_uptime90Days_ASC_NULLS_LAST",
  WorkerUptime90DaysDesc = "worker_uptime90Days_DESC",
  WorkerUptime90DaysDescNullsFirst = "worker_uptime90Days_DESC_NULLS_FIRST",
  WorkerUptime90DaysDescNullsLast = "worker_uptime90Days_DESC_NULLS_LAST",
  WorkerVersionAsc = "worker_version_ASC",
  WorkerVersionAscNullsFirst = "worker_version_ASC_NULLS_FIRST",
  WorkerVersionAscNullsLast = "worker_version_ASC_NULLS_LAST",
  WorkerVersionDesc = "worker_version_DESC",
  WorkerVersionDescNullsFirst = "worker_version_DESC_NULLS_FIRST",
  WorkerVersionDescNullsLast = "worker_version_DESC_NULLS_LAST",
  WorkerWebsiteAsc = "worker_website_ASC",
  WorkerWebsiteAscNullsFirst = "worker_website_ASC_NULLS_FIRST",
  WorkerWebsiteAscNullsLast = "worker_website_ASC_NULLS_LAST",
  WorkerWebsiteDesc = "worker_website_DESC",
  WorkerWebsiteDescNullsFirst = "worker_website_DESC_NULLS_FIRST",
  WorkerWebsiteDescNullsLast = "worker_website_DESC_NULLS_LAST",
}

export type WorkerStatusChangeWhereInput = {
  AND?: InputMaybe<Array<WorkerStatusChangeWhereInput>>;
  OR?: InputMaybe<Array<WorkerStatusChangeWhereInput>>;
  blockNumber_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  blockNumber_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  blockNumber_lt?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  pending_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  pending_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  pending_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_eq?: InputMaybe<WorkerStatus>;
  status_in?: InputMaybe<Array<WorkerStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<WorkerStatus>;
  status_not_in?: InputMaybe<Array<WorkerStatus>>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  worker?: InputMaybe<WorkerWhereInput>;
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type WorkerStatusChangesConnection = {
  __typename?: "WorkerStatusChangesConnection";
  edges: Array<WorkerStatusChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type WorkerWhereInput = {
  AND?: InputMaybe<Array<WorkerWhereInput>>;
  OR?: InputMaybe<Array<WorkerWhereInput>>;
  apr_eq?: InputMaybe<Scalars["Float"]["input"]>;
  apr_gt?: InputMaybe<Scalars["Float"]["input"]>;
  apr_gte?: InputMaybe<Scalars["Float"]["input"]>;
  apr_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  apr_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  apr_lt?: InputMaybe<Scalars["Float"]["input"]>;
  apr_lte?: InputMaybe<Scalars["Float"]["input"]>;
  apr_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  apr_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  bond_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  bond_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  bond_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  bond_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bond_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  bond_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  bond_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  bond_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  bond_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  capedDelegation_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  capedDelegation_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  capedDelegation_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  capedDelegation_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  capedDelegation_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  capedDelegation_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  capedDelegation_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  capedDelegation_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  capedDelegation_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimableReward_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimableReward_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  claimableReward_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimableReward_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedReward_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedReward_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  claimedReward_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedReward_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  createdAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  createdAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  dTenure_eq?: InputMaybe<Scalars["Float"]["input"]>;
  dTenure_gt?: InputMaybe<Scalars["Float"]["input"]>;
  dTenure_gte?: InputMaybe<Scalars["Float"]["input"]>;
  dTenure_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  dTenure_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  dTenure_lt?: InputMaybe<Scalars["Float"]["input"]>;
  dTenure_lte?: InputMaybe<Scalars["Float"]["input"]>;
  dTenure_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  dTenure_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  dayUptimes_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  delegationCount_eq?: InputMaybe<Scalars["Int"]["input"]>;
  delegationCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  delegationCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  delegationCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegationCount_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  delegationCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  delegationCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  delegationCount_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  delegationCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  delegations_every?: InputMaybe<DelegationWhereInput>;
  delegations_none?: InputMaybe<DelegationWhereInput>;
  delegations_some?: InputMaybe<DelegationWhereInput>;
  description_contains?: InputMaybe<Scalars["String"]["input"]>;
  description_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  description_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  description_eq?: InputMaybe<Scalars["String"]["input"]>;
  description_gt?: InputMaybe<Scalars["String"]["input"]>;
  description_gte?: InputMaybe<Scalars["String"]["input"]>;
  description_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  description_lt?: InputMaybe<Scalars["String"]["input"]>;
  description_lte?: InputMaybe<Scalars["String"]["input"]>;
  description_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  description_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  description_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  description_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  description_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  description_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  dialOk_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  dialOk_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  dialOk_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  email_contains?: InputMaybe<Scalars["String"]["input"]>;
  email_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  email_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_eq?: InputMaybe<Scalars["String"]["input"]>;
  email_gt?: InputMaybe<Scalars["String"]["input"]>;
  email_gte?: InputMaybe<Scalars["String"]["input"]>;
  email_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  email_lt?: InputMaybe<Scalars["String"]["input"]>;
  email_lte?: InputMaybe<Scalars["String"]["input"]>;
  email_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  email_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  email_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  email_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  email_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  id_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  id_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_contains?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_eq?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_gt?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_gte?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  jailReason_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  jailReason_lt?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_lte?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  jailReason_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  jailReason_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  jailed_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  jailed_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  jailed_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  liveness_eq?: InputMaybe<Scalars["Float"]["input"]>;
  liveness_gt?: InputMaybe<Scalars["Float"]["input"]>;
  liveness_gte?: InputMaybe<Scalars["Float"]["input"]>;
  liveness_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  liveness_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  liveness_lt?: InputMaybe<Scalars["Float"]["input"]>;
  liveness_lte?: InputMaybe<Scalars["Float"]["input"]>;
  liveness_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  liveness_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  lockEnd_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockEnd_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockEnd_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockEnd_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockStart_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_gt?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_gte?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lockStart_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  lockStart_lt?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_lte?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  lockStart_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  locked_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  locked_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  name_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_eq?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  name_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  name_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  online_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  online_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  online_not_eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<AccountWhereInput>;
  owner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  peerId_contains?: InputMaybe<Scalars["String"]["input"]>;
  peerId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  peerId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  peerId_eq?: InputMaybe<Scalars["String"]["input"]>;
  peerId_gt?: InputMaybe<Scalars["String"]["input"]>;
  peerId_gte?: InputMaybe<Scalars["String"]["input"]>;
  peerId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  peerId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  peerId_lt?: InputMaybe<Scalars["String"]["input"]>;
  peerId_lte?: InputMaybe<Scalars["String"]["input"]>;
  peerId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  peerId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  peerId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  peerId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  peerId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  peerId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  peerId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  queries24Hours_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries24Hours_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries24Hours_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries24Hours_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queries24Hours_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  queries24Hours_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries24Hours_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries24Hours_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries24Hours_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queries90Days_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries90Days_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries90Days_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries90Days_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queries90Days_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  queries90Days_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries90Days_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries90Days_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  queries90Days_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  realOwner?: InputMaybe<AccountWhereInput>;
  realOwner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewards_every?: InputMaybe<WorkerRewardWhereInput>;
  rewards_none?: InputMaybe<WorkerRewardWhereInput>;
  rewards_some?: InputMaybe<WorkerRewardWhereInput>;
  scannedData24Hours_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData24Hours_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData24Hours_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData24Hours_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scannedData24Hours_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  scannedData24Hours_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData24Hours_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData24Hours_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData24Hours_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scannedData90Days_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData90Days_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData90Days_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData90Days_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  scannedData90Days_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  scannedData90Days_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData90Days_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData90Days_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  scannedData90Days_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  servedData24Hours_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData24Hours_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData24Hours_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData24Hours_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  servedData24Hours_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  servedData24Hours_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData24Hours_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData24Hours_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData24Hours_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  servedData90Days_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData90Days_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData90Days_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData90Days_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  servedData90Days_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  servedData90Days_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData90Days_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData90Days_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  servedData90Days_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  snapshots_every?: InputMaybe<WorkerSnapshotWhereInput>;
  snapshots_none?: InputMaybe<WorkerSnapshotWhereInput>;
  snapshots_some?: InputMaybe<WorkerSnapshotWhereInput>;
  stakerApr_eq?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_gt?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_gte?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  stakerApr_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  stakerApr_lt?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_lte?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  stakerApr_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  statusHistory_every?: InputMaybe<WorkerStatusChangeWhereInput>;
  statusHistory_none?: InputMaybe<WorkerStatusChangeWhereInput>;
  statusHistory_some?: InputMaybe<WorkerStatusChangeWhereInput>;
  status_eq?: InputMaybe<WorkerStatus>;
  status_in?: InputMaybe<Array<WorkerStatus>>;
  status_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  status_not_eq?: InputMaybe<WorkerStatus>;
  status_not_in?: InputMaybe<Array<WorkerStatus>>;
  storedData_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  storedData_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  storedData_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  storedData_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegationRewards_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegationRewards_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegationRewards_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegationRewards_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegationRewards_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  totalDelegationRewards_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegationRewards_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegationRewards_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegationRewards_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegation_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegation_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegation_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegation_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegation_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  totalDelegation_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegation_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegation_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegation_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  trafficWeight_eq?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight_gt?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight_gte?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  trafficWeight_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  trafficWeight_lt?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight_lte?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  uptime24Hours_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime24Hours_gt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime24Hours_gte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime24Hours_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  uptime24Hours_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  uptime24Hours_lt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime24Hours_lte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime24Hours_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime24Hours_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  uptime90Days_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime90Days_gt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime90Days_gte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime90Days_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  uptime90Days_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  uptime90Days_lt?: InputMaybe<Scalars["Float"]["input"]>;
  uptime90Days_lte?: InputMaybe<Scalars["Float"]["input"]>;
  uptime90Days_not_eq?: InputMaybe<Scalars["Float"]["input"]>;
  uptime90Days_not_in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  version_contains?: InputMaybe<Scalars["String"]["input"]>;
  version_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  version_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  version_eq?: InputMaybe<Scalars["String"]["input"]>;
  version_gt?: InputMaybe<Scalars["String"]["input"]>;
  version_gte?: InputMaybe<Scalars["String"]["input"]>;
  version_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  version_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  version_lt?: InputMaybe<Scalars["String"]["input"]>;
  version_lte?: InputMaybe<Scalars["String"]["input"]>;
  version_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  version_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  version_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  version_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  version_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  version_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  version_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_contains?: InputMaybe<Scalars["String"]["input"]>;
  website_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  website_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_eq?: InputMaybe<Scalars["String"]["input"]>;
  website_gt?: InputMaybe<Scalars["String"]["input"]>;
  website_gte?: InputMaybe<Scalars["String"]["input"]>;
  website_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  website_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  website_lt?: InputMaybe<Scalars["String"]["input"]>;
  website_lte?: InputMaybe<Scalars["String"]["input"]>;
  website_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  website_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  website_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  website_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  website_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  website_startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type WorkersConnection = {
  __typename?: "WorkersConnection";
  edges: Array<WorkerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type SquidNetworkHeightQueryVariables = Exact<{ [key: string]: never }>;

export type SquidNetworkHeightQuery = {
  __typename?: "Query";
  squidStatus: { __typename?: "SquidStatus"; height: number };
};

export type SettingsQueryVariables = Exact<{ [key: string]: never }>;

export type SettingsQuery = {
  __typename?: "Query";
  settingsConnection: {
    __typename?: "SettingsConnection";
    edges: Array<{
      __typename?: "SettingsEdge";
      node: {
        __typename?: "Settings";
        id: string;
        bondAmount?: string;
        delegationLimitCoefficient: number;
        minimalWorkerVersion?: string;
        recommendedWorkerVersion?: string;
      };
    }>;
  };
};

export type AccountFragmentFragment = {
  __typename?: "Account";
  id: string;
  type: AccountType;
  balance: string;
};

export type OwnerFragmentFragment = {
  __typename?: "Account";
  id: string;
  type: AccountType;
};

export type VestingFragmentFragment = {
  __typename?: "Account";
  id: string;
  type: AccountType;
  balance: string;
  owner?: { __typename?: "Account"; id: string };
};

export type DelegationFragmentFragment = {
  __typename?: "Delegation";
  deposit: string;
  claimableReward: string;
  claimedReward: string;
  locked?: boolean;
  lockEnd?: number;
  owner: {
    __typename?: "Account";
    id: string;
    type: AccountType;
    owner?: { __typename?: "Account"; id: string };
  };
};

export type GatewayStakeBaseFragmentFragment = {
  __typename?: "GatewayStake";
  id: string;
  amount: string;
};

export type SourcesQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type SourcesQuery = {
  __typename?: "Query";
  accounts: Array<{
    __typename?: "Account";
    id: string;
    type: AccountType;
    balance: string;
  }>;
};

export type VestingsByAccountQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type VestingsByAccountQuery = {
  __typename?: "Query";
  accounts: Array<{
    __typename?: "Account";
    id: string;
    type: AccountType;
    balance: string;
  }>;
};

export type TemporaryHoldingsByAccountQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type TemporaryHoldingsByAccountQuery = {
  __typename?: "Query";
  accounts: Array<{
    __typename?: "Account";
    id: string;
    type: AccountType;
    balance: string;
    temporaryHolding?: { __typename?: "TemporaryHoldingData"; locked: boolean };
  }>;
};

export type SourcesWithAssetsQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type SourcesWithAssetsQuery = {
  __typename?: "Query";
  accounts: Array<{
    __typename?: "Account";
    id: string;
    type: AccountType;
    balance: string;
    workers2: Array<{
      __typename?: "Worker";
      bond: string;
      claimableReward: string;
      id: string;
      name?: string;
      peerId: string;
    }>;
    delegations2: Array<{
      __typename?: "Delegation";
      deposit: string;
      claimableReward: string;
      claimedReward: string;
      locked?: boolean;
      lockEnd?: number;
      worker: {
        __typename?: "Worker";
        id: string;
        name?: string;
        peerId: string;
      };
      owner: {
        __typename?: "Account";
        id: string;
        type: AccountType;
        owner?: { __typename?: "Account"; id: string };
      };
    }>;
    gatewayStakes: Array<{
      __typename?: "GatewayStake";
      id: string;
      amount: string;
    }>;
  }>;
};

export type SourcesWithDelegationsQueryVariables = Exact<{
  address: Scalars["String"]["input"];
  peerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type SourcesWithDelegationsQuery = {
  __typename?: "Query";
  accounts: Array<{
    __typename?: "Account";
    id: string;
    type: AccountType;
    balance: string;
    delegations2: Array<{
      __typename?: "Delegation";
      deposit: string;
      claimableReward: string;
      claimedReward: string;
      locked?: boolean;
      lockEnd?: number;
      worker: {
        __typename?: "Worker";
        id: string;
        name?: string;
        peerId: string;
      };
      owner: {
        __typename?: "Account";
        id: string;
        type: AccountType;
        owner?: { __typename?: "Account"; id: string };
      };
    }>;
  }>;
};

export type VestingByAddressQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type VestingByAddressQuery = {
  __typename?: "Query";
  accountById?: {
    __typename?: "Account";
    id: string;
    type: AccountType;
    balance: string;
    owner?: { __typename?: "Account"; id: string };
  };
};

export type WorkerBaseFragmentFragment = {
  __typename?: "Worker";
  id: string;
  name?: string;
  peerId: string;
};

export type WorkerStatusFragmentFragment = {
  __typename?: "Worker";
  status: WorkerStatus;
  online?: boolean;
  jailed?: boolean;
  dialOk?: boolean;
  jailReason?: string;
  statusHistory: Array<{
    __typename?: "WorkerStatusChange";
    blockNumber: number;
    pending: boolean;
    timestamp?: string;
  }>;
};

export type WorkerStatsFragmentFragment = {
  __typename?: "Worker";
  version?: string;
  createdAt: string;
  uptime90Days?: number;
  uptime24Hours?: number;
  apr?: number;
  stakerApr?: number;
  totalDelegation: string;
  capedDelegation: string;
  delegationCount: number;
  locked?: boolean;
  lockEnd?: number;
};

export type WorkerMetricsFragmentFragment = {
  __typename?: "Worker";
  queries24Hours?: string;
  queries90Days?: string;
  scannedData24Hours?: string;
  scannedData90Days?: string;
  servedData24Hours?: string;
  servedData90Days?: string;
  storedData?: string;
};

export type WorkerRewardsFragmentFragment = {
  __typename?: "Worker";
  bond: string;
  claimableReward: string;
  claimedReward: string;
  totalDelegationRewards: string;
};

export type WorkerProfileFragmentFragment = {
  __typename?: "Worker";
  website?: string;
  email?: string;
  description?: string;
};

export type WorkerOwnershipFragmentFragment = {
  __typename?: "Worker";
  owner: {
    __typename?: "Account";
    id: string;
    type: AccountType;
    owner?: { __typename?: "Account"; id: string };
  };
};

export type WorkerFragmentFragment = {
  __typename?: "Worker";
  id: string;
  name?: string;
  peerId: string;
  status: WorkerStatus;
  online?: boolean;
  jailed?: boolean;
  dialOk?: boolean;
  jailReason?: string;
  version?: string;
  createdAt: string;
  uptime90Days?: number;
  uptime24Hours?: number;
  apr?: number;
  stakerApr?: number;
  totalDelegation: string;
  capedDelegation: string;
  delegationCount: number;
  locked?: boolean;
  lockEnd?: number;
  statusHistory: Array<{
    __typename?: "WorkerStatusChange";
    blockNumber: number;
    pending: boolean;
    timestamp?: string;
  }>;
  owner: {
    __typename?: "Account";
    id: string;
    type: AccountType;
    owner?: { __typename?: "Account"; id: string };
  };
};

export type WorkerDetailedFragmentFragment = {
  __typename?: "Worker";
  bond: string;
  claimableReward: string;
  claimedReward: string;
  totalDelegationRewards: string;
  queries24Hours?: string;
  queries90Days?: string;
  scannedData24Hours?: string;
  scannedData90Days?: string;
  servedData24Hours?: string;
  servedData90Days?: string;
  storedData?: string;
  website?: string;
  email?: string;
  description?: string;
  id: string;
  name?: string;
  peerId: string;
  status: WorkerStatus;
  online?: boolean;
  jailed?: boolean;
  dialOk?: boolean;
  jailReason?: string;
  version?: string;
  createdAt: string;
  uptime90Days?: number;
  uptime24Hours?: number;
  apr?: number;
  stakerApr?: number;
  totalDelegation: string;
  capedDelegation: string;
  delegationCount: number;
  locked?: boolean;
  lockEnd?: number;
  dayUptimes?: Array<{
    __typename?: "WorkerDayUptime";
    timestamp: string;
    uptime: number;
  }>;
  statusHistory: Array<{
    __typename?: "WorkerStatusChange";
    blockNumber: number;
    pending: boolean;
    timestamp?: string;
  }>;
  owner: {
    __typename?: "Account";
    id: string;
    type: AccountType;
    owner?: { __typename?: "Account"; id: string };
  };
};

export type AllWorkersQueryVariables = Exact<{ [key: string]: never }>;

export type AllWorkersQuery = {
  __typename?: "Query";
  workers: Array<{
    __typename?: "Worker";
    id: string;
    name?: string;
    peerId: string;
    status: WorkerStatus;
    online?: boolean;
    jailed?: boolean;
    dialOk?: boolean;
    jailReason?: string;
    version?: string;
    createdAt: string;
    uptime90Days?: number;
    uptime24Hours?: number;
    apr?: number;
    stakerApr?: number;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean;
    lockEnd?: number;
    statusHistory: Array<{
      __typename?: "WorkerStatusChange";
      blockNumber: number;
      pending: boolean;
      timestamp?: string;
    }>;
    owner: {
      __typename?: "Account";
      id: string;
      type: AccountType;
      owner?: { __typename?: "Account"; id: string };
    };
  }>;
};

export type WorkerByPeerIdQueryVariables = Exact<{
  peerId: Scalars["String"]["input"];
  address?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type WorkerByPeerIdQuery = {
  __typename?: "Query";
  workers: Array<{
    __typename?: "Worker";
    bond: string;
    claimableReward: string;
    claimedReward: string;
    totalDelegationRewards: string;
    queries24Hours?: string;
    queries90Days?: string;
    scannedData24Hours?: string;
    scannedData90Days?: string;
    servedData24Hours?: string;
    servedData90Days?: string;
    storedData?: string;
    website?: string;
    email?: string;
    description?: string;
    id: string;
    name?: string;
    peerId: string;
    status: WorkerStatus;
    online?: boolean;
    jailed?: boolean;
    dialOk?: boolean;
    jailReason?: string;
    version?: string;
    createdAt: string;
    uptime90Days?: number;
    uptime24Hours?: number;
    apr?: number;
    stakerApr?: number;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean;
    lockEnd?: number;
    delegations: Array<{
      __typename?: "Delegation";
      deposit: string;
      claimableReward: string;
      claimedReward: string;
      locked?: boolean;
      lockEnd?: number;
      owner: {
        __typename?: "Account";
        id: string;
        type: AccountType;
        owner?: { __typename?: "Account"; id: string };
      };
    }>;
    dayUptimes?: Array<{
      __typename?: "WorkerDayUptime";
      timestamp: string;
      uptime: number;
    }>;
    statusHistory: Array<{
      __typename?: "WorkerStatusChange";
      blockNumber: number;
      pending: boolean;
      timestamp?: string;
    }>;
    owner: {
      __typename?: "Account";
      id: string;
      type: AccountType;
      owner?: { __typename?: "Account"; id: string };
    };
  }>;
};

export type WorkerDaysUptimeByIdQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  from: Scalars["DateTime"]["input"];
}>;

export type WorkerDaysUptimeByIdQuery = {
  __typename?: "Query";
  workerSnapshotsByDay: Array<{
    __typename?: "WorkerSnapshotDay";
    timestamp: string;
    uptime: number;
  }>;
};

export type MyWorkersQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type MyWorkersQuery = {
  __typename?: "Query";
  workers: Array<{
    __typename?: "Worker";
    bond: string;
    claimableReward: string;
    claimedReward: string;
    totalDelegationRewards: string;
    id: string;
    name?: string;
    peerId: string;
    status: WorkerStatus;
    online?: boolean;
    jailed?: boolean;
    dialOk?: boolean;
    jailReason?: string;
    version?: string;
    createdAt: string;
    uptime90Days?: number;
    uptime24Hours?: number;
    apr?: number;
    stakerApr?: number;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean;
    lockEnd?: number;
    statusHistory: Array<{
      __typename?: "WorkerStatusChange";
      blockNumber: number;
      pending: boolean;
      timestamp?: string;
    }>;
    owner: {
      __typename?: "Account";
      id: string;
      type: AccountType;
      owner?: { __typename?: "Account"; id: string };
    };
  }>;
};

export type MyWorkersCountQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type MyWorkersCountQuery = {
  __typename?: "Query";
  workersConnection: { __typename?: "WorkersConnection"; totalCount: number };
};

export type WorkerDelegationInfoQueryVariables = Exact<{
  workerId: Scalars["String"]["input"];
}>;

export type WorkerDelegationInfoQuery = {
  __typename?: "Query";
  workerById?: {
    __typename?: "Worker";
    bond: string;
    totalDelegation: string;
    capedDelegation: string;
    liveness?: number;
    dTenure?: number;
    trafficWeight?: number;
  };
  settings: Array<{
    __typename?: "Settings";
    utilizedStake: string;
    baseApr: number;
  }>;
};

export type WorkerOwnerQueryVariables = Exact<{
  workerId: Scalars["String"]["input"];
}>;

export type WorkerOwnerQuery = {
  __typename?: "Query";
  workerById?: {
    __typename?: "Worker";
    owner: {
      __typename?: "Account";
      id: string;
      type: AccountType;
      owner?: { __typename?: "Account"; id: string };
    };
  };
};

export type MyDelegationsQueryVariables = Exact<{
  address: Scalars["String"]["input"];
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type MyDelegationsQuery = {
  __typename?: "Query";
  workers: Array<{
    __typename?: "Worker";
    id: string;
    name?: string;
    peerId: string;
    status: WorkerStatus;
    online?: boolean;
    jailed?: boolean;
    dialOk?: boolean;
    jailReason?: string;
    version?: string;
    createdAt: string;
    uptime90Days?: number;
    uptime24Hours?: number;
    apr?: number;
    stakerApr?: number;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean;
    lockEnd?: number;
    delegations: Array<{
      __typename?: "Delegation";
      deposit: string;
      claimableReward: string;
      claimedReward: string;
      locked?: boolean;
      lockEnd?: number;
      owner: {
        __typename?: "Account";
        id: string;
        type: AccountType;
        owner?: { __typename?: "Account"; id: string };
      };
    }>;
    statusHistory: Array<{
      __typename?: "WorkerStatusChange";
      blockNumber: number;
      pending: boolean;
      timestamp?: string;
    }>;
    owner: {
      __typename?: "Account";
      id: string;
      type: AccountType;
      owner?: { __typename?: "Account"; id: string };
    };
  }>;
};

export type MyClaimsQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type MyClaimsQuery = {
  __typename?: "Query";
  delegations: Array<{
    __typename?: "Delegation";
    claimableReward: string;
    deposit: string;
    worker: {
      __typename?: "Worker";
      id: string;
      name?: string;
      peerId: string;
    };
    owner: { __typename?: "Account"; id: string; type: AccountType };
  }>;
  workers: Array<{
    __typename?: "Worker";
    claimableReward: string;
    id: string;
    name?: string;
    peerId: string;
    owner: { __typename?: "Account"; id: string; type: AccountType };
  }>;
};

export type GatewayFragmentFragment = {
  __typename?: "Gateway";
  id: string;
  name?: string;
  status: GatewayStatus;
  description?: string;
  email?: string;
  endpointUrl?: string;
  website?: string;
  createdAt: string;
  owner: { __typename?: "Account"; id: string; type: AccountType };
};

export type GatewayStakeFragmentFragment = {
  __typename?: "GatewayStake";
  autoExtension: boolean;
  computationUnits: string;
  computationUnitsPending?: string;
  locked: boolean;
  lockStart?: number;
  lockEnd?: number;
  id: string;
  amount: string;
  owner: { __typename?: "Account"; id: string; type: AccountType };
};

export type GatewayByPeerIdQueryVariables = Exact<{
  peerId: Scalars["String"]["input"];
}>;

export type GatewayByPeerIdQuery = {
  __typename?: "Query";
  gatewayById?: {
    __typename?: "Gateway";
    id: string;
    name?: string;
    status: GatewayStatus;
    description?: string;
    email?: string;
    endpointUrl?: string;
    website?: string;
    createdAt: string;
    owner: { __typename?: "Account"; id: string; type: AccountType };
  };
};

export type MyGatewaysQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type MyGatewaysQuery = {
  __typename?: "Query";
  gateways: Array<{
    __typename?: "Gateway";
    id: string;
    name?: string;
    status: GatewayStatus;
    description?: string;
    email?: string;
    endpointUrl?: string;
    website?: string;
    createdAt: string;
    owner: { __typename?: "Account"; id: string; type: AccountType };
  }>;
};

export type MyGatewayStakesQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type MyGatewayStakesQuery = {
  __typename?: "Query";
  gatewayStakes: Array<{
    __typename?: "GatewayStake";
    autoExtension: boolean;
    computationUnits: string;
    computationUnitsPending?: string;
    locked: boolean;
    lockStart?: number;
    lockEnd?: number;
    id: string;
    amount: string;
    owner: { __typename?: "Account"; id: string; type: AccountType };
  }>;
  networkStats: {
    __typename?: "NetworkStats";
    blockTimeL1: number;
    lastBlockL1: number;
    lastBlockTimestampL1: string;
  };
};

export type NetworkSummaryQueryVariables = Exact<{ [key: string]: never }>;

export type NetworkSummaryQuery = {
  __typename?: "Query";
  networkStats: {
    __typename?: "NetworkStats";
    onlineWorkersCount: number;
    queries90Days: string;
    queries24Hours: string;
    servedData90Days: string;
    servedData24Hours: string;
    stakerApr: number;
    totalBond: string;
    totalDelegation: string;
    totalPortalLock: string;
    storedData: string;
    workerApr: number;
    workersCount: number;
    aprs: Array<{
      __typename?: "AprSnapshot";
      stakerApr: number;
      timestamp: string;
      workerApr: number;
    }>;
  };
};

export type CurrentEpochQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentEpochQuery = {
  __typename?: "Query";
  networkStats: {
    __typename?: "NetworkStats";
    blockTimeL1: number;
    lastBlockL1: number;
    lastBlockTimestampL1: string;
  };
  epoches: Array<{
    __typename?: "Epoch";
    number: number;
    start: number;
    end: number;
  }>;
};

export type HoldersCountTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type HoldersCountTimeseriesQuery = {
  __typename?: "Query";
  holdersCountTimeseries: {
    __typename?: "HoldersCountTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "HoldersCountEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type LockedValueTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type LockedValueTimeseriesQuery = {
  __typename?: "Query";
  lockedValueTimeseries: {
    __typename?: "LockedValueTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{ __typename?: "TvlEntry"; timestamp: string; value?: string }>;
  };
};

export type ActiveWorkersTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ActiveWorkersTimeseriesQuery = {
  __typename?: "Query";
  activeWorkersTimeseries: {
    __typename?: "ActiveWorkersTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "ActiveWorkersEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type UniqueOperatorsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UniqueOperatorsTimeseriesQuery = {
  __typename?: "Query";
  uniqueOperatorsTimeseries: {
    __typename?: "UniqueOperatorsTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "OperatorsEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type DelegationsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type DelegationsTimeseriesQuery = {
  __typename?: "Query";
  delegationsTimeseries: {
    __typename?: "DelegationsTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "DelegationsEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type DelegatorsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type DelegatorsTimeseriesQuery = {
  __typename?: "Query";
  delegatorsTimeseries: {
    __typename?: "DelegatorsTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "DelegatorsEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type TransfersByTypeTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type TransfersByTypeTimeseriesQuery = {
  __typename?: "Query";
  transfersByTypeTimeseries: {
    __typename?: "TransfersByTypeTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "TransferCountByType";
      timestamp: string;
      value?: {
        __typename?: "TransferCountByTypeValue";
        deposit: number;
        withdraw: number;
        transfer: number;
        reward: number;
        release: number;
      };
    }>;
  };
};

export type UniqueAccountsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UniqueAccountsTimeseriesQuery = {
  __typename?: "Query";
  uniqueAccountsTimeseries: {
    __typename?: "UniqueAccountsTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "UniqueAccountsEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type QueriesCountTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type QueriesCountTimeseriesQuery = {
  __typename?: "Query";
  queriesCountTimeseries: {
    __typename?: "QueriesCountTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "QueriesCountEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type ServedDataTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ServedDataTimeseriesQuery = {
  __typename?: "Query";
  servedDataTimeseries: {
    __typename?: "ServedDataTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "ServedDataEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type StoredDataTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type StoredDataTimeseriesQuery = {
  __typename?: "Query";
  storedDataTimeseries: {
    __typename?: "StoredDataTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "StoredDataEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export type RewardTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type RewardTimeseriesQuery = {
  __typename?: "Query";
  rewardTimeseries: {
    __typename?: "RewardTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "RewardEntry";
      timestamp: string;
      value?: {
        __typename?: "RewardValue";
        workerReward: string;
        stakerReward: string;
      };
    }>;
  };
};

export type AprTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type AprTimeseriesQuery = {
  __typename?: "Query";
  aprTimeseries: {
    __typename?: "AprTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "AprEntry";
      timestamp: string;
      value?: { __typename?: "AprValue"; workerApr: number; stakerApr: number };
    }>;
  };
};

export type UptimeTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UptimeTimeseriesQuery = {
  __typename?: "Query";
  uptimeTimeseries: {
    __typename?: "UptimeTimeseries";
    step: number;
    from: string;
    to: string;
    data: Array<{
      __typename?: "UptimeEntry";
      timestamp: string;
      value?: number;
    }>;
  };
};

export const AccountFragmentFragmentDoc = `
    fragment AccountFragment on Account {
  id
  type
  balance
}
    `;
export const VestingFragmentFragmentDoc = `
    fragment VestingFragment on Account {
  id
  type
  balance
  owner {
    id
  }
}
    `;
export const DelegationFragmentFragmentDoc = `
    fragment DelegationFragment on Delegation {
  deposit
  claimableReward
  claimedReward
  locked
  lockEnd
  owner {
    id
    type
    owner {
      id
    }
  }
}
    `;
export const WorkerBaseFragmentFragmentDoc = `
    fragment WorkerBaseFragment on Worker {
  id
  name
  peerId
}
    `;
export const WorkerStatusFragmentFragmentDoc = `
    fragment WorkerStatusFragment on Worker {
  status
  online
  jailed
  dialOk
  jailReason
  statusHistory(orderBy: id_DESC, limit: 1) {
    blockNumber
    pending
    timestamp
  }
}
    `;
export const WorkerStatsFragmentFragmentDoc = `
    fragment WorkerStatsFragment on Worker {
  version
  createdAt
  uptime90Days
  uptime24Hours
  apr
  stakerApr
  totalDelegation
  capedDelegation
  delegationCount
  locked
  lockEnd
}
    `;
export const OwnerFragmentFragmentDoc = `
    fragment OwnerFragment on Account {
  id
  type
}
    `;
export const WorkerOwnershipFragmentFragmentDoc = `
    fragment WorkerOwnershipFragment on Worker {
  owner {
    ...OwnerFragment
    owner {
      id
    }
  }
}
    ${OwnerFragmentFragmentDoc}`;
export const WorkerFragmentFragmentDoc = `
    fragment WorkerFragment on Worker {
  ...WorkerBaseFragment
  ...WorkerStatusFragment
  ...WorkerStatsFragment
  ...WorkerOwnershipFragment
}
    ${WorkerBaseFragmentFragmentDoc}
${WorkerStatusFragmentFragmentDoc}
${WorkerStatsFragmentFragmentDoc}
${WorkerOwnershipFragmentFragmentDoc}`;
export const WorkerRewardsFragmentFragmentDoc = `
    fragment WorkerRewardsFragment on Worker {
  bond
  claimableReward
  claimedReward
  totalDelegationRewards
}
    `;
export const WorkerMetricsFragmentFragmentDoc = `
    fragment WorkerMetricsFragment on Worker {
  queries24Hours
  queries90Days
  scannedData24Hours
  scannedData90Days
  servedData24Hours
  servedData90Days
  storedData
}
    `;
export const WorkerProfileFragmentFragmentDoc = `
    fragment WorkerProfileFragment on Worker {
  website
  email
  description
}
    `;
export const WorkerDetailedFragmentFragmentDoc = `
    fragment WorkerDetailedFragment on Worker {
  ...WorkerFragment
  ...WorkerRewardsFragment
  ...WorkerMetricsFragment
  ...WorkerProfileFragment
  dayUptimes {
    timestamp
    uptime
  }
}
    ${WorkerFragmentFragmentDoc}
${WorkerRewardsFragmentFragmentDoc}
${WorkerMetricsFragmentFragmentDoc}
${WorkerProfileFragmentFragmentDoc}`;
export const GatewayFragmentFragmentDoc = `
    fragment GatewayFragment on Gateway {
  id
  name
  status
  description
  email
  endpointUrl
  website
  createdAt
  owner {
    ...OwnerFragment
  }
}
    ${OwnerFragmentFragmentDoc}`;
export const GatewayStakeBaseFragmentFragmentDoc = `
    fragment GatewayStakeBaseFragment on GatewayStake {
  id
  amount
}
    `;
export const GatewayStakeFragmentFragmentDoc = `
    fragment GatewayStakeFragment on GatewayStake {
  ...GatewayStakeBaseFragment
  owner {
    ...OwnerFragment
  }
  autoExtension
  computationUnits
  computationUnitsPending
  locked
  lockStart
  lockEnd
}
    ${GatewayStakeBaseFragmentFragmentDoc}
${OwnerFragmentFragmentDoc}`;
export const SquidNetworkHeightDocument = `
    query squidNetworkHeight {
  squidStatus {
    height
  }
}
    `;

export const useSquidNetworkHeightQuery = <
  TData = SquidNetworkHeightQuery,
  TError = unknown,
>(
  variables?: SquidNetworkHeightQueryVariables,
  options?: Omit<
    UseQueryOptions<SquidNetworkHeightQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      SquidNetworkHeightQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<SquidNetworkHeightQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ["squidNetworkHeight"]
        : ["squidNetworkHeight", variables],
    queryFn: fetcher<SquidNetworkHeightQuery, SquidNetworkHeightQueryVariables>(
      SquidNetworkHeightDocument,
      variables,
    ),
    ...options,
  });
};

export const SettingsDocument = `
    query settings {
  settingsConnection(orderBy: id_ASC) {
    edges {
      node {
        id
        bondAmount
        delegationLimitCoefficient
        minimalWorkerVersion
        recommendedWorkerVersion
      }
    }
  }
}
    `;

export const useSettingsQuery = <TData = SettingsQuery, TError = unknown>(
  variables?: SettingsQueryVariables,
  options?: Omit<UseQueryOptions<SettingsQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<SettingsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<SettingsQuery, TError, TData>({
    queryKey: variables === undefined ? ["settings"] : ["settings", variables],
    queryFn: fetcher<SettingsQuery, SettingsQueryVariables>(
      SettingsDocument,
      variables,
    ),
    ...options,
  });
};

export const SourcesDocument = `
    query sources($address: String!) {
  accounts(
    where: {OR: [{id_eq: $address}, {owner: {id_eq: $address}}]}
    orderBy: [type_ASC, id_ASC]
  ) {
    ...AccountFragment
  }
}
    ${AccountFragmentFragmentDoc}`;

export const useSourcesQuery = <TData = SourcesQuery, TError = unknown>(
  variables: SourcesQueryVariables,
  options?: Omit<UseQueryOptions<SourcesQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<SourcesQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<SourcesQuery, TError, TData>({
    queryKey: ["sources", variables],
    queryFn: fetcher<SourcesQuery, SourcesQueryVariables>(
      SourcesDocument,
      variables,
    ),
    ...options,
  });
};

export const VestingsByAccountDocument = `
    query vestingsByAccount($address: String!) {
  accounts(where: {owner: {id_eq: $address}, type_eq: VESTING}) {
    ...AccountFragment
  }
}
    ${AccountFragmentFragmentDoc}`;

export const useVestingsByAccountQuery = <
  TData = VestingsByAccountQuery,
  TError = unknown,
>(
  variables: VestingsByAccountQueryVariables,
  options?: Omit<
    UseQueryOptions<VestingsByAccountQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      VestingsByAccountQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<VestingsByAccountQuery, TError, TData>({
    queryKey: ["vestingsByAccount", variables],
    queryFn: fetcher<VestingsByAccountQuery, VestingsByAccountQueryVariables>(
      VestingsByAccountDocument,
      variables,
    ),
    ...options,
  });
};

export const TemporaryHoldingsByAccountDocument = `
    query temporaryHoldingsByAccount($address: String!) {
  accounts(
    where: {OR: [{temporaryHolding: {beneficiary: {id_eq: $address}}}, {owner: {id_eq: $address}, type_eq: TEMPORARY_HOLDING}]}
  ) {
    ...AccountFragment
    temporaryHolding {
      locked
    }
  }
}
    ${AccountFragmentFragmentDoc}`;

export const useTemporaryHoldingsByAccountQuery = <
  TData = TemporaryHoldingsByAccountQuery,
  TError = unknown,
>(
  variables: TemporaryHoldingsByAccountQueryVariables,
  options?: Omit<
    UseQueryOptions<TemporaryHoldingsByAccountQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      TemporaryHoldingsByAccountQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<TemporaryHoldingsByAccountQuery, TError, TData>({
    queryKey: ["temporaryHoldingsByAccount", variables],
    queryFn: fetcher<
      TemporaryHoldingsByAccountQuery,
      TemporaryHoldingsByAccountQueryVariables
    >(TemporaryHoldingsByAccountDocument, variables),
    ...options,
  });
};

export const SourcesWithAssetsDocument = `
    query sourcesWithAssets($address: String!) {
  accounts(
    where: {OR: [{id_eq: $address}, {owner: {id_eq: $address}}]}
    orderBy: [type_ASC, id_ASC]
  ) {
    ...AccountFragment
    workers2(where: {OR: [{bond_gt: 0}, {claimableReward_gt: 0}]}) {
      ...WorkerBaseFragment
      bond
      claimableReward
    }
    delegations2(where: {OR: [{deposit_gt: 0}, {claimableReward_gt: 0}]}) {
      ...DelegationFragment
      worker {
        ...WorkerBaseFragment
      }
    }
    gatewayStakes(where: {amount_gt: 0}) {
      ...GatewayStakeBaseFragment
    }
  }
}
    ${AccountFragmentFragmentDoc}
${WorkerBaseFragmentFragmentDoc}
${DelegationFragmentFragmentDoc}
${GatewayStakeBaseFragmentFragmentDoc}`;

export const useSourcesWithAssetsQuery = <
  TData = SourcesWithAssetsQuery,
  TError = unknown,
>(
  variables: SourcesWithAssetsQueryVariables,
  options?: Omit<
    UseQueryOptions<SourcesWithAssetsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      SourcesWithAssetsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<SourcesWithAssetsQuery, TError, TData>({
    queryKey: ["sourcesWithAssets", variables],
    queryFn: fetcher<SourcesWithAssetsQuery, SourcesWithAssetsQueryVariables>(
      SourcesWithAssetsDocument,
      variables,
    ),
    ...options,
  });
};

export const SourcesWithDelegationsDocument = `
    query sourcesWithDelegations($address: String!, $peerId: String) {
  accounts(
    where: {OR: [{id_eq: $address}, {owner: {id_eq: $address}}]}
    orderBy: [type_ASC, id_ASC]
  ) {
    ...AccountFragment
    delegations2(
      where: {OR: [{deposit_gt: 0}], AND: [{worker: {peerId_eq: $peerId}}]}
    ) {
      ...DelegationFragment
      worker {
        ...WorkerBaseFragment
      }
    }
  }
}
    ${AccountFragmentFragmentDoc}
${DelegationFragmentFragmentDoc}
${WorkerBaseFragmentFragmentDoc}`;

export const useSourcesWithDelegationsQuery = <
  TData = SourcesWithDelegationsQuery,
  TError = unknown,
>(
  variables: SourcesWithDelegationsQueryVariables,
  options?: Omit<
    UseQueryOptions<SourcesWithDelegationsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      SourcesWithDelegationsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<SourcesWithDelegationsQuery, TError, TData>({
    queryKey: ["sourcesWithDelegations", variables],
    queryFn: fetcher<
      SourcesWithDelegationsQuery,
      SourcesWithDelegationsQueryVariables
    >(SourcesWithDelegationsDocument, variables),
    ...options,
  });
};

export const VestingByAddressDocument = `
    query vestingByAddress($address: String!) {
  accountById(id: $address) {
    ...VestingFragment
  }
}
    ${VestingFragmentFragmentDoc}`;

export const useVestingByAddressQuery = <
  TData = VestingByAddressQuery,
  TError = unknown,
>(
  variables: VestingByAddressQueryVariables,
  options?: Omit<
    UseQueryOptions<VestingByAddressQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      VestingByAddressQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<VestingByAddressQuery, TError, TData>({
    queryKey: ["vestingByAddress", variables],
    queryFn: fetcher<VestingByAddressQuery, VestingByAddressQueryVariables>(
      VestingByAddressDocument,
      variables,
    ),
    ...options,
  });
};

export const AllWorkersDocument = `
    query allWorkers {
  workers(where: {status_eq: ACTIVE}, orderBy: totalDelegation_ASC) {
    ...WorkerFragment
  }
}
    ${WorkerFragmentFragmentDoc}`;

export const useAllWorkersQuery = <TData = AllWorkersQuery, TError = unknown>(
  variables?: AllWorkersQueryVariables,
  options?: Omit<
    UseQueryOptions<AllWorkersQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<AllWorkersQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<AllWorkersQuery, TError, TData>({
    queryKey:
      variables === undefined ? ["allWorkers"] : ["allWorkers", variables],
    queryFn: fetcher<AllWorkersQuery, AllWorkersQueryVariables>(
      AllWorkersDocument,
      variables,
    ),
    ...options,
  });
};

export const WorkerByPeerIdDocument = `
    query workerByPeerId($peerId: String!, $address: String) {
  workers(where: {peerId_eq: $peerId}, limit: 1) {
    ...WorkerDetailedFragment
    delegations(
      where: {OR: [{owner: {id_eq: $address}, deposit_gt: 0}, {owner: {owner: {id_eq: $address}}, deposit_gt: 0}]}
    ) {
      ...DelegationFragment
    }
  }
}
    ${WorkerDetailedFragmentFragmentDoc}
${DelegationFragmentFragmentDoc}`;

export const useWorkerByPeerIdQuery = <
  TData = WorkerByPeerIdQuery,
  TError = unknown,
>(
  variables: WorkerByPeerIdQueryVariables,
  options?: Omit<
    UseQueryOptions<WorkerByPeerIdQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<WorkerByPeerIdQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<WorkerByPeerIdQuery, TError, TData>({
    queryKey: ["workerByPeerId", variables],
    queryFn: fetcher<WorkerByPeerIdQuery, WorkerByPeerIdQueryVariables>(
      WorkerByPeerIdDocument,
      variables,
    ),
    ...options,
  });
};

export const WorkerDaysUptimeByIdDocument = `
    query workerDaysUptimeById($id: String!, $from: DateTime!) {
  workerSnapshotsByDay(workerId: $id, from: $from) {
    timestamp
    uptime
  }
}
    `;

export const useWorkerDaysUptimeByIdQuery = <
  TData = WorkerDaysUptimeByIdQuery,
  TError = unknown,
>(
  variables: WorkerDaysUptimeByIdQueryVariables,
  options?: Omit<
    UseQueryOptions<WorkerDaysUptimeByIdQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      WorkerDaysUptimeByIdQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<WorkerDaysUptimeByIdQuery, TError, TData>({
    queryKey: ["workerDaysUptimeById", variables],
    queryFn: fetcher<
      WorkerDaysUptimeByIdQuery,
      WorkerDaysUptimeByIdQueryVariables
    >(WorkerDaysUptimeByIdDocument, variables),
    ...options,
  });
};

export const MyWorkersDocument = `
    query myWorkers($address: String!) {
  workers(
    orderBy: id_ASC
    where: {OR: [{owner: {id_eq: $address}, status_not_eq: WITHDRAWN}, {owner: {owner: {id_eq: $address}}, status_not_eq: WITHDRAWN}, {owner: {temporaryHolding: {beneficiary: {id_eq: $address}}}, status_not_eq: WITHDRAWN}]}
  ) {
    ...WorkerFragment
    ...WorkerRewardsFragment
  }
}
    ${WorkerFragmentFragmentDoc}
${WorkerRewardsFragmentFragmentDoc}`;

export const useMyWorkersQuery = <TData = MyWorkersQuery, TError = unknown>(
  variables: MyWorkersQueryVariables,
  options?: Omit<UseQueryOptions<MyWorkersQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<MyWorkersQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<MyWorkersQuery, TError, TData>({
    queryKey: ["myWorkers", variables],
    queryFn: fetcher<MyWorkersQuery, MyWorkersQueryVariables>(
      MyWorkersDocument,
      variables,
    ),
    ...options,
  });
};

export const MyWorkersCountDocument = `
    query myWorkersCount($address: String!) {
  workersConnection(
    orderBy: id_ASC
    where: {OR: [{owner: {id_eq: $address}}, {owner: {owner: {id_eq: $address}}}]}
  ) {
    totalCount
  }
}
    `;

export const useMyWorkersCountQuery = <
  TData = MyWorkersCountQuery,
  TError = unknown,
>(
  variables: MyWorkersCountQueryVariables,
  options?: Omit<
    UseQueryOptions<MyWorkersCountQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<MyWorkersCountQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<MyWorkersCountQuery, TError, TData>({
    queryKey: ["myWorkersCount", variables],
    queryFn: fetcher<MyWorkersCountQuery, MyWorkersCountQueryVariables>(
      MyWorkersCountDocument,
      variables,
    ),
    ...options,
  });
};

export const WorkerDelegationInfoDocument = `
    query workerDelegationInfo($workerId: String!) {
  workerById(id: $workerId) {
    bond
    totalDelegation
    capedDelegation
    liveness
    dTenure
    trafficWeight
  }
  settings(limit: 1) {
    utilizedStake
    baseApr
  }
}
    `;

export const useWorkerDelegationInfoQuery = <
  TData = WorkerDelegationInfoQuery,
  TError = unknown,
>(
  variables: WorkerDelegationInfoQueryVariables,
  options?: Omit<
    UseQueryOptions<WorkerDelegationInfoQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      WorkerDelegationInfoQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<WorkerDelegationInfoQuery, TError, TData>({
    queryKey: ["workerDelegationInfo", variables],
    queryFn: fetcher<
      WorkerDelegationInfoQuery,
      WorkerDelegationInfoQueryVariables
    >(WorkerDelegationInfoDocument, variables),
    ...options,
  });
};

export const WorkerOwnerDocument = `
    query workerOwner($workerId: String!) {
  workerById(id: $workerId) {
    ...WorkerOwnershipFragment
  }
}
    ${WorkerOwnershipFragmentFragmentDoc}`;

export const useWorkerOwnerQuery = <TData = WorkerOwnerQuery, TError = unknown>(
  variables: WorkerOwnerQueryVariables,
  options?: Omit<
    UseQueryOptions<WorkerOwnerQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<WorkerOwnerQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<WorkerOwnerQuery, TError, TData>({
    queryKey: ["workerOwner", variables],
    queryFn: fetcher<WorkerOwnerQuery, WorkerOwnerQueryVariables>(
      WorkerOwnerDocument,
      variables,
    ),
    ...options,
  });
};

export const MyDelegationsDocument = `
    query myDelegations($address: String!, $workerId: String) {
  workers(
    orderBy: id_ASC
    where: {peerId_eq: $workerId, delegations_some: {OR: [{owner: {id_eq: $address}, deposit_gt: 0}, {owner: {owner: {id_eq: $address}}, deposit_gt: 0}, {owner: {temporaryHolding: {beneficiary: {id_eq: $address}}}, deposit_gt: 0}]}}
  ) {
    ...WorkerFragment
    delegations(
      where: {OR: [{owner: {id_eq: $address}, deposit_gt: 0}, {owner: {owner: {id_eq: $address}}, deposit_gt: 0}, {owner: {temporaryHolding: {beneficiary: {id_eq: $address}}}, deposit_gt: 0}]}
    ) {
      ...DelegationFragment
    }
  }
}
    ${WorkerFragmentFragmentDoc}
${DelegationFragmentFragmentDoc}`;

export const useMyDelegationsQuery = <
  TData = MyDelegationsQuery,
  TError = unknown,
>(
  variables: MyDelegationsQueryVariables,
  options?: Omit<
    UseQueryOptions<MyDelegationsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<MyDelegationsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<MyDelegationsQuery, TError, TData>({
    queryKey: ["myDelegations", variables],
    queryFn: fetcher<MyDelegationsQuery, MyDelegationsQueryVariables>(
      MyDelegationsDocument,
      variables,
    ),
    ...options,
  });
};

export const MyClaimsDocument = `
    query myClaims($address: String!) {
  delegations(
    where: {OR: [{owner: {id_eq: $address}, claimableReward_gt: 0}, {owner: {owner: {id_eq: $address}}, claimableReward_gt: 0}]}
  ) {
    claimableReward
    deposit
    worker {
      ...WorkerBaseFragment
    }
    owner {
      ...OwnerFragment
    }
  }
  workers(
    where: {OR: [{owner: {id_eq: $address}, claimableReward_gt: 0}, {owner: {owner: {id_eq: $address}}, claimableReward_gt: 0}]}
  ) {
    ...WorkerBaseFragment
    claimableReward
    owner {
      ...OwnerFragment
    }
  }
}
    ${WorkerBaseFragmentFragmentDoc}
${OwnerFragmentFragmentDoc}`;

export const useMyClaimsQuery = <TData = MyClaimsQuery, TError = unknown>(
  variables: MyClaimsQueryVariables,
  options?: Omit<UseQueryOptions<MyClaimsQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<MyClaimsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<MyClaimsQuery, TError, TData>({
    queryKey: ["myClaims", variables],
    queryFn: fetcher<MyClaimsQuery, MyClaimsQueryVariables>(
      MyClaimsDocument,
      variables,
    ),
    ...options,
  });
};

export const GatewayByPeerIdDocument = `
    query gatewayByPeerId($peerId: String!) {
  gatewayById(id: $peerId) {
    ...GatewayFragment
  }
}
    ${GatewayFragmentFragmentDoc}`;

export const useGatewayByPeerIdQuery = <
  TData = GatewayByPeerIdQuery,
  TError = unknown,
>(
  variables: GatewayByPeerIdQueryVariables,
  options?: Omit<
    UseQueryOptions<GatewayByPeerIdQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GatewayByPeerIdQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GatewayByPeerIdQuery, TError, TData>({
    queryKey: ["gatewayByPeerId", variables],
    queryFn: fetcher<GatewayByPeerIdQuery, GatewayByPeerIdQueryVariables>(
      GatewayByPeerIdDocument,
      variables,
    ),
    ...options,
  });
};

export const MyGatewaysDocument = `
    query myGateways($address: String!) {
  gateways(where: {owner: {id_eq: $address}, status_not_eq: DEREGISTERED}) {
    ...GatewayFragment
  }
}
    ${GatewayFragmentFragmentDoc}`;

export const useMyGatewaysQuery = <TData = MyGatewaysQuery, TError = unknown>(
  variables: MyGatewaysQueryVariables,
  options?: Omit<
    UseQueryOptions<MyGatewaysQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<MyGatewaysQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<MyGatewaysQuery, TError, TData>({
    queryKey: ["myGateways", variables],
    queryFn: fetcher<MyGatewaysQuery, MyGatewaysQueryVariables>(
      MyGatewaysDocument,
      variables,
    ),
    ...options,
  });
};

export const MyGatewayStakesDocument = `
    query myGatewayStakes($address: String!) {
  gatewayStakes(
    where: {OR: [{owner: {id_eq: $address}, amount_gt: "0"}, {owner: {owner: {id_eq: $address}}, amount_gt: "0"}]}
  ) {
    ...GatewayStakeFragment
  }
  networkStats {
    blockTimeL1
    lastBlockL1
    lastBlockTimestampL1
  }
}
    ${GatewayStakeFragmentFragmentDoc}`;

export const useMyGatewayStakesQuery = <
  TData = MyGatewayStakesQuery,
  TError = unknown,
>(
  variables: MyGatewayStakesQueryVariables,
  options?: Omit<
    UseQueryOptions<MyGatewayStakesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<MyGatewayStakesQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<MyGatewayStakesQuery, TError, TData>({
    queryKey: ["myGatewayStakes", variables],
    queryFn: fetcher<MyGatewayStakesQuery, MyGatewayStakesQueryVariables>(
      MyGatewayStakesDocument,
      variables,
    ),
    ...options,
  });
};

export const NetworkSummaryDocument = `
    query networkSummary {
  networkStats {
    onlineWorkersCount
    queries90Days
    queries24Hours
    servedData90Days
    servedData24Hours
    stakerApr
    totalBond
    totalDelegation
    totalPortalLock
    storedData
    workerApr
    workersCount
    aprs {
      stakerApr
      timestamp
      workerApr
    }
  }
}
    `;

export const useNetworkSummaryQuery = <
  TData = NetworkSummaryQuery,
  TError = unknown,
>(
  variables?: NetworkSummaryQueryVariables,
  options?: Omit<
    UseQueryOptions<NetworkSummaryQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<NetworkSummaryQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<NetworkSummaryQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ["networkSummary"]
        : ["networkSummary", variables],
    queryFn: fetcher<NetworkSummaryQuery, NetworkSummaryQueryVariables>(
      NetworkSummaryDocument,
      variables,
    ),
    ...options,
  });
};

export const CurrentEpochDocument = `
    query currentEpoch {
  networkStats {
    blockTimeL1
    lastBlockL1
    lastBlockTimestampL1
  }
  epoches(limit: 1, orderBy: id_DESC) {
    number
    start
    end
  }
}
    `;

export const useCurrentEpochQuery = <
  TData = CurrentEpochQuery,
  TError = unknown,
>(
  variables?: CurrentEpochQueryVariables,
  options?: Omit<
    UseQueryOptions<CurrentEpochQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<CurrentEpochQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<CurrentEpochQuery, TError, TData>({
    queryKey:
      variables === undefined ? ["currentEpoch"] : ["currentEpoch", variables],
    queryFn: fetcher<CurrentEpochQuery, CurrentEpochQueryVariables>(
      CurrentEpochDocument,
      variables,
    ),
    ...options,
  });
};

export const HoldersCountTimeseriesDocument = `
    query HoldersCountTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  holdersCountTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useHoldersCountTimeseriesQuery = <
  TData = HoldersCountTimeseriesQuery,
  TError = unknown,
>(
  variables: HoldersCountTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<HoldersCountTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      HoldersCountTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<HoldersCountTimeseriesQuery, TError, TData>({
    queryKey: ["HoldersCountTimeseries", variables],
    queryFn: fetcher<
      HoldersCountTimeseriesQuery,
      HoldersCountTimeseriesQueryVariables
    >(HoldersCountTimeseriesDocument, variables),
    ...options,
  });
};

export const LockedValueTimeseriesDocument = `
    query LockedValueTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  lockedValueTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useLockedValueTimeseriesQuery = <
  TData = LockedValueTimeseriesQuery,
  TError = unknown,
>(
  variables: LockedValueTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<LockedValueTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      LockedValueTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<LockedValueTimeseriesQuery, TError, TData>({
    queryKey: ["LockedValueTimeseries", variables],
    queryFn: fetcher<
      LockedValueTimeseriesQuery,
      LockedValueTimeseriesQueryVariables
    >(LockedValueTimeseriesDocument, variables),
    ...options,
  });
};

export const ActiveWorkersTimeseriesDocument = `
    query ActiveWorkersTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  activeWorkersTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useActiveWorkersTimeseriesQuery = <
  TData = ActiveWorkersTimeseriesQuery,
  TError = unknown,
>(
  variables: ActiveWorkersTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<ActiveWorkersTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      ActiveWorkersTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<ActiveWorkersTimeseriesQuery, TError, TData>({
    queryKey: ["ActiveWorkersTimeseries", variables],
    queryFn: fetcher<
      ActiveWorkersTimeseriesQuery,
      ActiveWorkersTimeseriesQueryVariables
    >(ActiveWorkersTimeseriesDocument, variables),
    ...options,
  });
};

export const UniqueOperatorsTimeseriesDocument = `
    query UniqueOperatorsTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  uniqueOperatorsTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useUniqueOperatorsTimeseriesQuery = <
  TData = UniqueOperatorsTimeseriesQuery,
  TError = unknown,
>(
  variables: UniqueOperatorsTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<UniqueOperatorsTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      UniqueOperatorsTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<UniqueOperatorsTimeseriesQuery, TError, TData>({
    queryKey: ["UniqueOperatorsTimeseries", variables],
    queryFn: fetcher<
      UniqueOperatorsTimeseriesQuery,
      UniqueOperatorsTimeseriesQueryVariables
    >(UniqueOperatorsTimeseriesDocument, variables),
    ...options,
  });
};

export const DelegationsTimeseriesDocument = `
    query DelegationsTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  delegationsTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useDelegationsTimeseriesQuery = <
  TData = DelegationsTimeseriesQuery,
  TError = unknown,
>(
  variables: DelegationsTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<DelegationsTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      DelegationsTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<DelegationsTimeseriesQuery, TError, TData>({
    queryKey: ["DelegationsTimeseries", variables],
    queryFn: fetcher<
      DelegationsTimeseriesQuery,
      DelegationsTimeseriesQueryVariables
    >(DelegationsTimeseriesDocument, variables),
    ...options,
  });
};

export const DelegatorsTimeseriesDocument = `
    query DelegatorsTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  delegatorsTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useDelegatorsTimeseriesQuery = <
  TData = DelegatorsTimeseriesQuery,
  TError = unknown,
>(
  variables: DelegatorsTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<DelegatorsTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      DelegatorsTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<DelegatorsTimeseriesQuery, TError, TData>({
    queryKey: ["DelegatorsTimeseries", variables],
    queryFn: fetcher<
      DelegatorsTimeseriesQuery,
      DelegatorsTimeseriesQueryVariables
    >(DelegatorsTimeseriesDocument, variables),
    ...options,
  });
};

export const TransfersByTypeTimeseriesDocument = `
    query TransfersByTypeTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  transfersByTypeTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value {
        deposit
        withdraw
        transfer
        reward
        release
      }
    }
    step
    from
    to
  }
}
    `;

export const useTransfersByTypeTimeseriesQuery = <
  TData = TransfersByTypeTimeseriesQuery,
  TError = unknown,
>(
  variables: TransfersByTypeTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<TransfersByTypeTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      TransfersByTypeTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<TransfersByTypeTimeseriesQuery, TError, TData>({
    queryKey: ["TransfersByTypeTimeseries", variables],
    queryFn: fetcher<
      TransfersByTypeTimeseriesQuery,
      TransfersByTypeTimeseriesQueryVariables
    >(TransfersByTypeTimeseriesDocument, variables),
    ...options,
  });
};

export const UniqueAccountsTimeseriesDocument = `
    query UniqueAccountsTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  uniqueAccountsTimeseries(from: $from, to: $to, step: $step) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useUniqueAccountsTimeseriesQuery = <
  TData = UniqueAccountsTimeseriesQuery,
  TError = unknown,
>(
  variables: UniqueAccountsTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<UniqueAccountsTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      UniqueAccountsTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<UniqueAccountsTimeseriesQuery, TError, TData>({
    queryKey: ["UniqueAccountsTimeseries", variables],
    queryFn: fetcher<
      UniqueAccountsTimeseriesQuery,
      UniqueAccountsTimeseriesQueryVariables
    >(UniqueAccountsTimeseriesDocument, variables),
    ...options,
  });
};

export const QueriesCountTimeseriesDocument = `
    query QueriesCountTimeseries($from: DateTime!, $to: DateTime!, $step: String, $workerId: String) {
  queriesCountTimeseries(from: $from, to: $to, step: $step, workerId: $workerId) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useQueriesCountTimeseriesQuery = <
  TData = QueriesCountTimeseriesQuery,
  TError = unknown,
>(
  variables: QueriesCountTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<QueriesCountTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      QueriesCountTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<QueriesCountTimeseriesQuery, TError, TData>({
    queryKey: ["QueriesCountTimeseries", variables],
    queryFn: fetcher<
      QueriesCountTimeseriesQuery,
      QueriesCountTimeseriesQueryVariables
    >(QueriesCountTimeseriesDocument, variables),
    ...options,
  });
};

export const ServedDataTimeseriesDocument = `
    query ServedDataTimeseries($from: DateTime!, $to: DateTime!, $step: String, $workerId: String) {
  servedDataTimeseries(from: $from, to: $to, step: $step, workerId: $workerId) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useServedDataTimeseriesQuery = <
  TData = ServedDataTimeseriesQuery,
  TError = unknown,
>(
  variables: ServedDataTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<ServedDataTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      ServedDataTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<ServedDataTimeseriesQuery, TError, TData>({
    queryKey: ["ServedDataTimeseries", variables],
    queryFn: fetcher<
      ServedDataTimeseriesQuery,
      ServedDataTimeseriesQueryVariables
    >(ServedDataTimeseriesDocument, variables),
    ...options,
  });
};

export const StoredDataTimeseriesDocument = `
    query StoredDataTimeseries($from: DateTime!, $to: DateTime!, $step: String, $workerId: String) {
  storedDataTimeseries(from: $from, to: $to, step: $step, workerId: $workerId) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useStoredDataTimeseriesQuery = <
  TData = StoredDataTimeseriesQuery,
  TError = unknown,
>(
  variables: StoredDataTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<StoredDataTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      StoredDataTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<StoredDataTimeseriesQuery, TError, TData>({
    queryKey: ["StoredDataTimeseries", variables],
    queryFn: fetcher<
      StoredDataTimeseriesQuery,
      StoredDataTimeseriesQueryVariables
    >(StoredDataTimeseriesDocument, variables),
    ...options,
  });
};

export const RewardTimeseriesDocument = `
    query RewardTimeseries($from: DateTime!, $to: DateTime!, $step: String, $workerId: String) {
  rewardTimeseries(from: $from, to: $to, step: $step, workerId: $workerId) {
    data {
      timestamp
      value {
        workerReward
        stakerReward
      }
    }
    step
    from
    to
  }
}
    `;

export const useRewardTimeseriesQuery = <
  TData = RewardTimeseriesQuery,
  TError = unknown,
>(
  variables: RewardTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<RewardTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      RewardTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<RewardTimeseriesQuery, TError, TData>({
    queryKey: ["RewardTimeseries", variables],
    queryFn: fetcher<RewardTimeseriesQuery, RewardTimeseriesQueryVariables>(
      RewardTimeseriesDocument,
      variables,
    ),
    ...options,
  });
};

export const AprTimeseriesDocument = `
    query AprTimeseries($from: DateTime!, $to: DateTime!, $step: String, $workerId: String) {
  aprTimeseries(from: $from, to: $to, step: $step, workerId: $workerId) {
    data {
      timestamp
      value {
        workerApr
        stakerApr
      }
    }
    step
    from
    to
  }
}
    `;

export const useAprTimeseriesQuery = <
  TData = AprTimeseriesQuery,
  TError = unknown,
>(
  variables: AprTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<AprTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<AprTimeseriesQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<AprTimeseriesQuery, TError, TData>({
    queryKey: ["AprTimeseries", variables],
    queryFn: fetcher<AprTimeseriesQuery, AprTimeseriesQueryVariables>(
      AprTimeseriesDocument,
      variables,
    ),
    ...options,
  });
};

export const UptimeTimeseriesDocument = `
    query UptimeTimeseries($from: DateTime!, $to: DateTime!, $step: String, $workerId: String) {
  uptimeTimeseries(from: $from, to: $to, step: $step, workerId: $workerId) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `;

export const useUptimeTimeseriesQuery = <
  TData = UptimeTimeseriesQuery,
  TError = unknown,
>(
  variables: UptimeTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<UptimeTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      UptimeTimeseriesQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<UptimeTimeseriesQuery, TError, TData>({
    queryKey: ["UptimeTimeseries", variables],
    queryFn: fetcher<UptimeTimeseriesQuery, UptimeTimeseriesQueryVariables>(
      UptimeTimeseriesDocument,
      variables,
    ),
    ...options,
  });
};
