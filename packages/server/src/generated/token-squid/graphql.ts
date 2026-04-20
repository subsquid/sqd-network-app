/* eslint-disable */
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
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
  /** Big number integer */
  BigInt: { input: string; output: string };
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: { input: string; output: string };
};

export type Account = {
  balance: Scalars["BigInt"]["output"];
  claimableDelegationCount: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  owned: Array<Account>;
  owner?: Maybe<Account>;
  ownerId?: Maybe<Scalars["String"]["output"]>;
  transfers: Array<AccountTransfer>;
  transfersFrom: Array<Transfer>;
  transfersTo: Array<Transfer>;
  type: AccountType;
};

export type AccountOwnedArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  where?: InputMaybe<AccountWhereInput>;
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

export type AccountBalanceEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["BigInt"]["output"]>;
};

export type AccountBalanceTimeseries = {
  data: Array<AccountBalanceEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type AccountEdge = {
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
  TypeAsc = "type_ASC",
  TypeAscNullsFirst = "type_ASC_NULLS_FIRST",
  TypeAscNullsLast = "type_ASC_NULLS_LAST",
  TypeDesc = "type_DESC",
  TypeDescNullsFirst = "type_DESC_NULLS_FIRST",
  TypeDescNullsLast = "type_DESC_NULLS_LAST",
}

export type AccountTransfer = {
  account: Account;
  accountId: Scalars["String"]["output"];
  balance: Scalars["BigInt"]["output"];
  direction: TransferDirection;
  id: Scalars["String"]["output"];
  transfer: Transfer;
  transferId: Scalars["String"]["output"];
};

export type AccountTransferEdge = {
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
  TransferDelegationIdAsc = "transfer_delegationId_ASC",
  TransferDelegationIdAscNullsFirst = "transfer_delegationId_ASC_NULLS_FIRST",
  TransferDelegationIdAscNullsLast = "transfer_delegationId_ASC_NULLS_LAST",
  TransferDelegationIdDesc = "transfer_delegationId_DESC",
  TransferDelegationIdDescNullsFirst = "transfer_delegationId_DESC_NULLS_FIRST",
  TransferDelegationIdDescNullsLast = "transfer_delegationId_DESC_NULLS_LAST",
  TransferGatewayStakeIdAsc = "transfer_gatewayStakeId_ASC",
  TransferGatewayStakeIdAscNullsFirst = "transfer_gatewayStakeId_ASC_NULLS_FIRST",
  TransferGatewayStakeIdAscNullsLast = "transfer_gatewayStakeId_ASC_NULLS_LAST",
  TransferGatewayStakeIdDesc = "transfer_gatewayStakeId_DESC",
  TransferGatewayStakeIdDescNullsFirst = "transfer_gatewayStakeId_DESC_NULLS_FIRST",
  TransferGatewayStakeIdDescNullsLast = "transfer_gatewayStakeId_DESC_NULLS_LAST",
  TransferIdAsc = "transfer_id_ASC",
  TransferIdAscNullsFirst = "transfer_id_ASC_NULLS_FIRST",
  TransferIdAscNullsLast = "transfer_id_ASC_NULLS_LAST",
  TransferIdDesc = "transfer_id_DESC",
  TransferIdDescNullsFirst = "transfer_id_DESC_NULLS_FIRST",
  TransferIdDescNullsLast = "transfer_id_DESC_NULLS_LAST",
  TransferPortalPoolIdAsc = "transfer_portalPoolId_ASC",
  TransferPortalPoolIdAscNullsFirst = "transfer_portalPoolId_ASC_NULLS_FIRST",
  TransferPortalPoolIdAscNullsLast = "transfer_portalPoolId_ASC_NULLS_LAST",
  TransferPortalPoolIdDesc = "transfer_portalPoolId_DESC",
  TransferPortalPoolIdDescNullsFirst = "transfer_portalPoolId_DESC_NULLS_FIRST",
  TransferPortalPoolIdDescNullsLast = "transfer_portalPoolId_DESC_NULLS_LAST",
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
  TransferVestingIdAsc = "transfer_vestingId_ASC",
  TransferVestingIdAscNullsFirst = "transfer_vestingId_ASC_NULLS_FIRST",
  TransferVestingIdAscNullsLast = "transfer_vestingId_ASC_NULLS_LAST",
  TransferVestingIdDesc = "transfer_vestingId_DESC",
  TransferVestingIdDescNullsFirst = "transfer_vestingId_DESC_NULLS_FIRST",
  TransferVestingIdDescNullsLast = "transfer_vestingId_DESC_NULLS_LAST",
  TransferWorkerIdAsc = "transfer_workerId_ASC",
  TransferWorkerIdAscNullsFirst = "transfer_workerId_ASC_NULLS_FIRST",
  TransferWorkerIdAscNullsLast = "transfer_workerId_ASC_NULLS_LAST",
  TransferWorkerIdDesc = "transfer_workerId_DESC",
  TransferWorkerIdDescNullsFirst = "transfer_workerId_DESC_NULLS_FIRST",
  TransferWorkerIdDescNullsLast = "transfer_workerId_DESC_NULLS_LAST",
}

export type AccountTransferWhereInput = {
  AND?: InputMaybe<Array<AccountTransferWhereInput>>;
  OR?: InputMaybe<Array<AccountTransferWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  accountId_contains?: InputMaybe<Scalars["String"]["input"]>;
  accountId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  accountId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  accountId_eq?: InputMaybe<Scalars["String"]["input"]>;
  accountId_gt?: InputMaybe<Scalars["String"]["input"]>;
  accountId_gte?: InputMaybe<Scalars["String"]["input"]>;
  accountId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  accountId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  accountId_lt?: InputMaybe<Scalars["String"]["input"]>;
  accountId_lte?: InputMaybe<Scalars["String"]["input"]>;
  accountId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  accountId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  accountId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  accountId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  accountId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  accountId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  accountId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  transferId_contains?: InputMaybe<Scalars["String"]["input"]>;
  transferId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  transferId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  transferId_eq?: InputMaybe<Scalars["String"]["input"]>;
  transferId_gt?: InputMaybe<Scalars["String"]["input"]>;
  transferId_gte?: InputMaybe<Scalars["String"]["input"]>;
  transferId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transferId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  transferId_lt?: InputMaybe<Scalars["String"]["input"]>;
  transferId_lte?: InputMaybe<Scalars["String"]["input"]>;
  transferId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transferId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  transferId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  transferId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  transferId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transferId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  transferId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  transfer_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type AccountTransfersConnection = {
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
  ownerId_contains?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_eq?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_gt?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_gte?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  ownerId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  ownerId_lt?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_lte?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  ownerId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  ownerId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  owner_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
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
};

export type AccountsConnection = {
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type HoldersCountEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type HoldersCountTimeseries = {
  data: Array<HoldersCountEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type LockedValueTimeseries = {
  data: Array<TvlEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type PageInfo = {
  endCursor: Scalars["String"]["output"];
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor: Scalars["String"]["output"];
};

export type Query = {
  accountBalanceTimeseries: AccountBalanceTimeseries;
  accountById?: Maybe<Account>;
  accountTransferById?: Maybe<AccountTransfer>;
  accountTransfers: Array<AccountTransfer>;
  accountTransfersConnection: AccountTransfersConnection;
  accounts: Array<Account>;
  accountsConnection: AccountsConnection;
  holdersCountTimeseries: HoldersCountTimeseries;
  lockedValueTimeseries: LockedValueTimeseries;
  transferById?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  transfersByTypeTimeseries: TransfersByTypeTimeseries;
  transfersConnection: TransfersConnection;
  uniqueAccountsTimeseries: UniqueAccountsTimeseries;
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

export type QueryHoldersCountTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryLockedValueTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
  type?: InputMaybe<TvlType>;
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

export type Transfer = {
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  /** String reference to delegation in workers indexer */
  delegationId?: Maybe<Scalars["String"]["output"]>;
  from: Account;
  fromId: Scalars["String"]["output"];
  /** String reference to gateway stake in gateways indexer */
  gatewayStakeId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  /** String reference to portal pool in gateways indexer */
  portalPoolId?: Maybe<Scalars["String"]["output"]>;
  timestamp: Scalars["DateTime"]["output"];
  to: Account;
  toId: Scalars["String"]["output"];
  txHash: Scalars["String"]["output"];
  type: TransferType;
  /** String reference to vesting account in accounts indexer */
  vestingId?: Maybe<Scalars["String"]["output"]>;
  /** String reference to worker in workers indexer */
  workerId?: Maybe<Scalars["String"]["output"]>;
};

export type TransferCountByType = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<TransferCountByTypeValue>;
};

export type TransferCountByTypeValue = {
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
  DelegationIdAsc = "delegationId_ASC",
  DelegationIdAscNullsFirst = "delegationId_ASC_NULLS_FIRST",
  DelegationIdAscNullsLast = "delegationId_ASC_NULLS_LAST",
  DelegationIdDesc = "delegationId_DESC",
  DelegationIdDescNullsFirst = "delegationId_DESC_NULLS_FIRST",
  DelegationIdDescNullsLast = "delegationId_DESC_NULLS_LAST",
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
  GatewayStakeIdAsc = "gatewayStakeId_ASC",
  GatewayStakeIdAscNullsFirst = "gatewayStakeId_ASC_NULLS_FIRST",
  GatewayStakeIdAscNullsLast = "gatewayStakeId_ASC_NULLS_LAST",
  GatewayStakeIdDesc = "gatewayStakeId_DESC",
  GatewayStakeIdDescNullsFirst = "gatewayStakeId_DESC_NULLS_FIRST",
  GatewayStakeIdDescNullsLast = "gatewayStakeId_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  PortalPoolIdAsc = "portalPoolId_ASC",
  PortalPoolIdAscNullsFirst = "portalPoolId_ASC_NULLS_FIRST",
  PortalPoolIdAscNullsLast = "portalPoolId_ASC_NULLS_LAST",
  PortalPoolIdDesc = "portalPoolId_DESC",
  PortalPoolIdDescNullsFirst = "portalPoolId_DESC_NULLS_FIRST",
  PortalPoolIdDescNullsLast = "portalPoolId_DESC_NULLS_LAST",
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
  VestingIdAsc = "vestingId_ASC",
  VestingIdAscNullsFirst = "vestingId_ASC_NULLS_FIRST",
  VestingIdAscNullsLast = "vestingId_ASC_NULLS_LAST",
  VestingIdDesc = "vestingId_DESC",
  VestingIdDescNullsFirst = "vestingId_DESC_NULLS_FIRST",
  VestingIdDescNullsLast = "vestingId_DESC_NULLS_LAST",
  WorkerIdAsc = "workerId_ASC",
  WorkerIdAscNullsFirst = "workerId_ASC_NULLS_FIRST",
  WorkerIdAscNullsLast = "workerId_ASC_NULLS_LAST",
  WorkerIdDesc = "workerId_DESC",
  WorkerIdDescNullsFirst = "workerId_DESC_NULLS_FIRST",
  WorkerIdDescNullsLast = "workerId_DESC_NULLS_LAST",
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
  delegationId_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_eq?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_gt?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_gte?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegationId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  delegationId_lt?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_lte?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegationId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  delegationId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  from?: InputMaybe<AccountWhereInput>;
  fromId_contains?: InputMaybe<Scalars["String"]["input"]>;
  fromId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  fromId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  fromId_eq?: InputMaybe<Scalars["String"]["input"]>;
  fromId_gt?: InputMaybe<Scalars["String"]["input"]>;
  fromId_gte?: InputMaybe<Scalars["String"]["input"]>;
  fromId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  fromId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  fromId_lt?: InputMaybe<Scalars["String"]["input"]>;
  fromId_lte?: InputMaybe<Scalars["String"]["input"]>;
  fromId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  fromId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  fromId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  fromId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  fromId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  fromId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  fromId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  from_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  gatewayStakeId_contains?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_eq?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_gt?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_gte?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gatewayStakeId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  gatewayStakeId_lt?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_lte?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  gatewayStakeId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gatewayStakeId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayStakeId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  portalPoolId_contains?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_eq?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_gt?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_gte?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  portalPoolId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  portalPoolId_lt?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_lte?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  portalPoolId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  toId_contains?: InputMaybe<Scalars["String"]["input"]>;
  toId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  toId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  toId_eq?: InputMaybe<Scalars["String"]["input"]>;
  toId_gt?: InputMaybe<Scalars["String"]["input"]>;
  toId_gte?: InputMaybe<Scalars["String"]["input"]>;
  toId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  toId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  toId_lt?: InputMaybe<Scalars["String"]["input"]>;
  toId_lte?: InputMaybe<Scalars["String"]["input"]>;
  toId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  toId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  toId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  toId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  toId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  toId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  toId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  vestingId_contains?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_eq?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_gt?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_gte?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  vestingId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  vestingId_lt?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_lte?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  vestingId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  vestingId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerId_contains?: InputMaybe<Scalars["String"]["input"]>;
  workerId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  workerId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerId_eq?: InputMaybe<Scalars["String"]["input"]>;
  workerId_gt?: InputMaybe<Scalars["String"]["input"]>;
  workerId_gte?: InputMaybe<Scalars["String"]["input"]>;
  workerId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  workerId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  workerId_lt?: InputMaybe<Scalars["String"]["input"]>;
  workerId_lte?: InputMaybe<Scalars["String"]["input"]>;
  workerId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  workerId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  workerId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  workerId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  workerId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  workerId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type TransfersByTypeTimeseries = {
  data: Array<TransferCountByType>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type TransfersConnection = {
  edges: Array<TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type TvlEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["BigInt"]["output"]>;
};

export enum TvlType {
  Delegation = "DELEGATION",
  Portal = "PORTAL",
  PortalPool = "PORTAL_POOL",
  Worker = "WORKER",
}

export type UniqueAccountsEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type UniqueAccountsTimeseries = {
  data: Array<UniqueAccountsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type SourcesQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type SourcesQuery = {
  accounts: Array<{ id: string; type: AccountType; balance: string }>;
};

export type VestingsByAccountQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type VestingsByAccountQuery = {
  accounts: Array<{ id: string; type: AccountType; balance: string }>;
};

export type VestingByAddressQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type VestingByAddressQuery = {
  accountById?: {
    id: string;
    type: AccountType;
    balance: string;
    owner?: { id: string } | null;
  } | null;
};

export type AccountsByOwnerQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type AccountsByOwnerQuery = {
  accounts: Array<{
    id: string;
    type: AccountType;
    balance: string;
    ownerId?: string | null;
  }>;
};

export type HoldersCountTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type HoldersCountTimeseriesQuery = {
  holdersCountTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type LockedValueTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type LockedValueTimeseriesQuery = {
  worker: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: string | null }>;
  };
  delegation: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: string | null }>;
  };
  portal: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: string | null }>;
  };
  portalPool: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: string | null }>;
  };
};

export type TransfersByTypeTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type TransfersByTypeTimeseriesQuery = {
  transfersByTypeTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{
      timestamp: string;
      value?: {
        deposit: number;
        withdraw: number;
        transfer: number;
        reward: number;
        release: number;
      } | null;
    }>;
  };
};

export type UniqueAccountsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UniqueAccountsTimeseriesQuery = {
  uniqueAccountsTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<
    DocumentTypeDecoration<TResult, TVariables>["__apiType"]
  >;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const SourcesDocument = new TypedDocumentString(`
    query sources($address: String!) {
  accounts(
    where: {OR: [{id_eq: $address}, {owner: {id_eq: $address}}]}
    orderBy: [type_ASC, id_ASC]
  ) {
    id
    type
    balance
  }
}
    `) as unknown as TypedDocumentString<SourcesQuery, SourcesQueryVariables>;
export const VestingsByAccountDocument = new TypedDocumentString(`
    query vestingsByAccount($address: String!) {
  accounts(where: {owner: {id_eq: $address}, type_eq: VESTING}) {
    id
    type
    balance
  }
}
    `) as unknown as TypedDocumentString<
  VestingsByAccountQuery,
  VestingsByAccountQueryVariables
>;
export const VestingByAddressDocument = new TypedDocumentString(`
    query vestingByAddress($address: String!) {
  accountById(id: $address) {
    id
    type
    balance
    owner {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<
  VestingByAddressQuery,
  VestingByAddressQueryVariables
>;
export const AccountsByOwnerDocument = new TypedDocumentString(`
    query accountsByOwner($address: String!) {
  accounts(
    where: {OR: [{id_eq: $address}, {owner: {id_eq: $address}}]}
    orderBy: [type_ASC, id_ASC]
  ) {
    id
    type
    balance
    ownerId
  }
}
    `) as unknown as TypedDocumentString<
  AccountsByOwnerQuery,
  AccountsByOwnerQueryVariables
>;
export const HoldersCountTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  HoldersCountTimeseriesQuery,
  HoldersCountTimeseriesQueryVariables
>;
export const LockedValueTimeseriesDocument = new TypedDocumentString(`
    query LockedValueTimeseries($from: DateTime!, $to: DateTime!, $step: String) {
  worker: lockedValueTimeseries(from: $from, to: $to, step: $step, type: WORKER) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
  delegation: lockedValueTimeseries(
    from: $from
    to: $to
    step: $step
    type: DELEGATION
  ) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
  portal: lockedValueTimeseries(from: $from, to: $to, step: $step, type: PORTAL) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
  portalPool: lockedValueTimeseries(
    from: $from
    to: $to
    step: $step
    type: PORTAL_POOL
  ) {
    data {
      timestamp
      value
    }
    step
    from
    to
  }
}
    `) as unknown as TypedDocumentString<
  LockedValueTimeseriesQuery,
  LockedValueTimeseriesQueryVariables
>;
export const TransfersByTypeTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  TransfersByTypeTimeseriesQuery,
  TransfersByTypeTimeseriesQueryVariables
>;
export const UniqueAccountsTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  UniqueAccountsTimeseriesQuery,
  UniqueAccountsTimeseriesQueryVariables
>;
