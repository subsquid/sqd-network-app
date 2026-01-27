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

export type ApyEntry = {
  __typename?: "ApyEntry";
  timestamp: Scalars["DateTime"]["output"];
  value: Scalars["Float"]["output"];
};

export type ApyTimeseries = {
  __typename?: "ApyTimeseries";
  data: Array<ApyEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type CapacityChange = {
  __typename?: "CapacityChange";
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  newCapacity: Scalars["BigInt"]["output"];
  oldCapacity: Scalars["BigInt"]["output"];
  pool: Pool;
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type CapacityChangeEdge = {
  __typename?: "CapacityChangeEdge";
  cursor: Scalars["String"]["output"];
  node: CapacityChange;
};

export enum CapacityChangeOrderByInput {
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
  NewCapacityAsc = "newCapacity_ASC",
  NewCapacityAscNullsFirst = "newCapacity_ASC_NULLS_FIRST",
  NewCapacityAscNullsLast = "newCapacity_ASC_NULLS_LAST",
  NewCapacityDesc = "newCapacity_DESC",
  NewCapacityDescNullsFirst = "newCapacity_DESC_NULLS_FIRST",
  NewCapacityDescNullsLast = "newCapacity_DESC_NULLS_LAST",
  OldCapacityAsc = "oldCapacity_ASC",
  OldCapacityAscNullsFirst = "oldCapacity_ASC_NULLS_FIRST",
  OldCapacityAscNullsLast = "oldCapacity_ASC_NULLS_LAST",
  OldCapacityDesc = "oldCapacity_DESC",
  OldCapacityDescNullsFirst = "oldCapacity_DESC_NULLS_FIRST",
  OldCapacityDescNullsLast = "oldCapacity_DESC_NULLS_LAST",
  PoolCapacityAsc = "pool_capacity_ASC",
  PoolCapacityAscNullsFirst = "pool_capacity_ASC_NULLS_FIRST",
  PoolCapacityAscNullsLast = "pool_capacity_ASC_NULLS_LAST",
  PoolCapacityDesc = "pool_capacity_DESC",
  PoolCapacityDescNullsFirst = "pool_capacity_DESC_NULLS_FIRST",
  PoolCapacityDescNullsLast = "pool_capacity_DESC_NULLS_LAST",
  PoolClosedAtBlockAsc = "pool_closedAtBlock_ASC",
  PoolClosedAtBlockAscNullsFirst = "pool_closedAtBlock_ASC_NULLS_FIRST",
  PoolClosedAtBlockAscNullsLast = "pool_closedAtBlock_ASC_NULLS_LAST",
  PoolClosedAtBlockDesc = "pool_closedAtBlock_DESC",
  PoolClosedAtBlockDescNullsFirst = "pool_closedAtBlock_DESC_NULLS_FIRST",
  PoolClosedAtBlockDescNullsLast = "pool_closedAtBlock_DESC_NULLS_LAST",
  PoolClosedAtAsc = "pool_closedAt_ASC",
  PoolClosedAtAscNullsFirst = "pool_closedAt_ASC_NULLS_FIRST",
  PoolClosedAtAscNullsLast = "pool_closedAt_ASC_NULLS_LAST",
  PoolClosedAtDesc = "pool_closedAt_DESC",
  PoolClosedAtDescNullsFirst = "pool_closedAt_DESC_NULLS_FIRST",
  PoolClosedAtDescNullsLast = "pool_closedAt_DESC_NULLS_LAST",
  PoolCreatedAtBlockAsc = "pool_createdAtBlock_ASC",
  PoolCreatedAtBlockAscNullsFirst = "pool_createdAtBlock_ASC_NULLS_FIRST",
  PoolCreatedAtBlockAscNullsLast = "pool_createdAtBlock_ASC_NULLS_LAST",
  PoolCreatedAtBlockDesc = "pool_createdAtBlock_DESC",
  PoolCreatedAtBlockDescNullsFirst = "pool_createdAtBlock_DESC_NULLS_FIRST",
  PoolCreatedAtBlockDescNullsLast = "pool_createdAtBlock_DESC_NULLS_LAST",
  PoolCreatedAtAsc = "pool_createdAt_ASC",
  PoolCreatedAtAscNullsFirst = "pool_createdAt_ASC_NULLS_FIRST",
  PoolCreatedAtAscNullsLast = "pool_createdAt_ASC_NULLS_LAST",
  PoolCreatedAtDesc = "pool_createdAt_DESC",
  PoolCreatedAtDescNullsFirst = "pool_createdAt_DESC_NULLS_FIRST",
  PoolCreatedAtDescNullsLast = "pool_createdAt_DESC_NULLS_LAST",
  PoolIdAsc = "pool_id_ASC",
  PoolIdAscNullsFirst = "pool_id_ASC_NULLS_FIRST",
  PoolIdAscNullsLast = "pool_id_ASC_NULLS_LAST",
  PoolIdDesc = "pool_id_DESC",
  PoolIdDescNullsFirst = "pool_id_DESC_NULLS_FIRST",
  PoolIdDescNullsLast = "pool_id_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolTotalRewardsToppedUpAsc = "pool_totalRewardsToppedUp_ASC",
  PoolTotalRewardsToppedUpAscNullsFirst = "pool_totalRewardsToppedUp_ASC_NULLS_FIRST",
  PoolTotalRewardsToppedUpAscNullsLast = "pool_totalRewardsToppedUp_ASC_NULLS_LAST",
  PoolTotalRewardsToppedUpDesc = "pool_totalRewardsToppedUp_DESC",
  PoolTotalRewardsToppedUpDescNullsFirst = "pool_totalRewardsToppedUp_DESC_NULLS_FIRST",
  PoolTotalRewardsToppedUpDescNullsLast = "pool_totalRewardsToppedUp_DESC_NULLS_LAST",
  PoolTvlStableAsc = "pool_tvlStable_ASC",
  PoolTvlStableAscNullsFirst = "pool_tvlStable_ASC_NULLS_FIRST",
  PoolTvlStableAscNullsLast = "pool_tvlStable_ASC_NULLS_LAST",
  PoolTvlStableDesc = "pool_tvlStable_DESC",
  PoolTvlStableDescNullsFirst = "pool_tvlStable_DESC_NULLS_FIRST",
  PoolTvlStableDescNullsLast = "pool_tvlStable_DESC_NULLS_LAST",
  PoolTvlTotalAsc = "pool_tvlTotal_ASC",
  PoolTvlTotalAscNullsFirst = "pool_tvlTotal_ASC_NULLS_FIRST",
  PoolTvlTotalAscNullsLast = "pool_tvlTotal_ASC_NULLS_LAST",
  PoolTvlTotalDesc = "pool_tvlTotal_DESC",
  PoolTvlTotalDescNullsFirst = "pool_tvlTotal_DESC_NULLS_FIRST",
  PoolTvlTotalDescNullsLast = "pool_tvlTotal_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  TxHashAsc = "txHash_ASC",
  TxHashAscNullsFirst = "txHash_ASC_NULLS_FIRST",
  TxHashAscNullsLast = "txHash_ASC_NULLS_LAST",
  TxHashDesc = "txHash_DESC",
  TxHashDescNullsFirst = "txHash_DESC_NULLS_FIRST",
  TxHashDescNullsLast = "txHash_DESC_NULLS_LAST",
}

export type CapacityChangeWhereInput = {
  AND?: InputMaybe<Array<CapacityChangeWhereInput>>;
  OR?: InputMaybe<Array<CapacityChangeWhereInput>>;
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
  newCapacity_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  newCapacity_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newCapacity_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newCapacity_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  newCapacity_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  newCapacity_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newCapacity_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newCapacity_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  newCapacity_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldCapacity_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldCapacity_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldCapacity_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldCapacity_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldCapacity_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  oldCapacity_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldCapacity_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldCapacity_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldCapacity_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  pool?: InputMaybe<PoolWhereInput>;
  pool_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
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
};

export type CapacityChangesConnection = {
  __typename?: "CapacityChangesConnection";
  edges: Array<CapacityChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type DistributionRateChange = {
  __typename?: "DistributionRateChange";
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  newRate: Scalars["BigInt"]["output"];
  oldRate: Scalars["BigInt"]["output"];
  pool: Pool;
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type DistributionRateChangeEdge = {
  __typename?: "DistributionRateChangeEdge";
  cursor: Scalars["String"]["output"];
  node: DistributionRateChange;
};

export enum DistributionRateChangeOrderByInput {
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
  NewRateAsc = "newRate_ASC",
  NewRateAscNullsFirst = "newRate_ASC_NULLS_FIRST",
  NewRateAscNullsLast = "newRate_ASC_NULLS_LAST",
  NewRateDesc = "newRate_DESC",
  NewRateDescNullsFirst = "newRate_DESC_NULLS_FIRST",
  NewRateDescNullsLast = "newRate_DESC_NULLS_LAST",
  OldRateAsc = "oldRate_ASC",
  OldRateAscNullsFirst = "oldRate_ASC_NULLS_FIRST",
  OldRateAscNullsLast = "oldRate_ASC_NULLS_LAST",
  OldRateDesc = "oldRate_DESC",
  OldRateDescNullsFirst = "oldRate_DESC_NULLS_FIRST",
  OldRateDescNullsLast = "oldRate_DESC_NULLS_LAST",
  PoolCapacityAsc = "pool_capacity_ASC",
  PoolCapacityAscNullsFirst = "pool_capacity_ASC_NULLS_FIRST",
  PoolCapacityAscNullsLast = "pool_capacity_ASC_NULLS_LAST",
  PoolCapacityDesc = "pool_capacity_DESC",
  PoolCapacityDescNullsFirst = "pool_capacity_DESC_NULLS_FIRST",
  PoolCapacityDescNullsLast = "pool_capacity_DESC_NULLS_LAST",
  PoolClosedAtBlockAsc = "pool_closedAtBlock_ASC",
  PoolClosedAtBlockAscNullsFirst = "pool_closedAtBlock_ASC_NULLS_FIRST",
  PoolClosedAtBlockAscNullsLast = "pool_closedAtBlock_ASC_NULLS_LAST",
  PoolClosedAtBlockDesc = "pool_closedAtBlock_DESC",
  PoolClosedAtBlockDescNullsFirst = "pool_closedAtBlock_DESC_NULLS_FIRST",
  PoolClosedAtBlockDescNullsLast = "pool_closedAtBlock_DESC_NULLS_LAST",
  PoolClosedAtAsc = "pool_closedAt_ASC",
  PoolClosedAtAscNullsFirst = "pool_closedAt_ASC_NULLS_FIRST",
  PoolClosedAtAscNullsLast = "pool_closedAt_ASC_NULLS_LAST",
  PoolClosedAtDesc = "pool_closedAt_DESC",
  PoolClosedAtDescNullsFirst = "pool_closedAt_DESC_NULLS_FIRST",
  PoolClosedAtDescNullsLast = "pool_closedAt_DESC_NULLS_LAST",
  PoolCreatedAtBlockAsc = "pool_createdAtBlock_ASC",
  PoolCreatedAtBlockAscNullsFirst = "pool_createdAtBlock_ASC_NULLS_FIRST",
  PoolCreatedAtBlockAscNullsLast = "pool_createdAtBlock_ASC_NULLS_LAST",
  PoolCreatedAtBlockDesc = "pool_createdAtBlock_DESC",
  PoolCreatedAtBlockDescNullsFirst = "pool_createdAtBlock_DESC_NULLS_FIRST",
  PoolCreatedAtBlockDescNullsLast = "pool_createdAtBlock_DESC_NULLS_LAST",
  PoolCreatedAtAsc = "pool_createdAt_ASC",
  PoolCreatedAtAscNullsFirst = "pool_createdAt_ASC_NULLS_FIRST",
  PoolCreatedAtAscNullsLast = "pool_createdAt_ASC_NULLS_LAST",
  PoolCreatedAtDesc = "pool_createdAt_DESC",
  PoolCreatedAtDescNullsFirst = "pool_createdAt_DESC_NULLS_FIRST",
  PoolCreatedAtDescNullsLast = "pool_createdAt_DESC_NULLS_LAST",
  PoolIdAsc = "pool_id_ASC",
  PoolIdAscNullsFirst = "pool_id_ASC_NULLS_FIRST",
  PoolIdAscNullsLast = "pool_id_ASC_NULLS_LAST",
  PoolIdDesc = "pool_id_DESC",
  PoolIdDescNullsFirst = "pool_id_DESC_NULLS_FIRST",
  PoolIdDescNullsLast = "pool_id_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolTotalRewardsToppedUpAsc = "pool_totalRewardsToppedUp_ASC",
  PoolTotalRewardsToppedUpAscNullsFirst = "pool_totalRewardsToppedUp_ASC_NULLS_FIRST",
  PoolTotalRewardsToppedUpAscNullsLast = "pool_totalRewardsToppedUp_ASC_NULLS_LAST",
  PoolTotalRewardsToppedUpDesc = "pool_totalRewardsToppedUp_DESC",
  PoolTotalRewardsToppedUpDescNullsFirst = "pool_totalRewardsToppedUp_DESC_NULLS_FIRST",
  PoolTotalRewardsToppedUpDescNullsLast = "pool_totalRewardsToppedUp_DESC_NULLS_LAST",
  PoolTvlStableAsc = "pool_tvlStable_ASC",
  PoolTvlStableAscNullsFirst = "pool_tvlStable_ASC_NULLS_FIRST",
  PoolTvlStableAscNullsLast = "pool_tvlStable_ASC_NULLS_LAST",
  PoolTvlStableDesc = "pool_tvlStable_DESC",
  PoolTvlStableDescNullsFirst = "pool_tvlStable_DESC_NULLS_FIRST",
  PoolTvlStableDescNullsLast = "pool_tvlStable_DESC_NULLS_LAST",
  PoolTvlTotalAsc = "pool_tvlTotal_ASC",
  PoolTvlTotalAscNullsFirst = "pool_tvlTotal_ASC_NULLS_FIRST",
  PoolTvlTotalAscNullsLast = "pool_tvlTotal_ASC_NULLS_LAST",
  PoolTvlTotalDesc = "pool_tvlTotal_DESC",
  PoolTvlTotalDescNullsFirst = "pool_tvlTotal_DESC_NULLS_FIRST",
  PoolTvlTotalDescNullsLast = "pool_tvlTotal_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  TxHashAsc = "txHash_ASC",
  TxHashAscNullsFirst = "txHash_ASC_NULLS_FIRST",
  TxHashAscNullsLast = "txHash_ASC_NULLS_LAST",
  TxHashDesc = "txHash_DESC",
  TxHashDescNullsFirst = "txHash_DESC_NULLS_FIRST",
  TxHashDescNullsLast = "txHash_DESC_NULLS_LAST",
}

export type DistributionRateChangeWhereInput = {
  AND?: InputMaybe<Array<DistributionRateChangeWhereInput>>;
  OR?: InputMaybe<Array<DistributionRateChangeWhereInput>>;
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
  newRate_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  newRate_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newRate_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newRate_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  newRate_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  newRate_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newRate_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newRate_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  newRate_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldRate_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldRate_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldRate_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldRate_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  oldRate_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  oldRate_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldRate_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldRate_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  oldRate_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  pool?: InputMaybe<PoolWhereInput>;
  pool_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
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
};

export type DistributionRateChangesConnection = {
  __typename?: "DistributionRateChangesConnection";
  edges: Array<DistributionRateChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type LiquidityEvent = {
  __typename?: "LiquidityEvent";
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  eventType: LiquidityEventType;
  id: Scalars["String"]["output"];
  pool: Pool;
  providerId?: Maybe<Scalars["String"]["output"]>;
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type LiquidityEventEdge = {
  __typename?: "LiquidityEventEdge";
  cursor: Scalars["String"]["output"];
  node: LiquidityEvent;
};

export enum LiquidityEventOrderByInput {
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
  EventTypeAsc = "eventType_ASC",
  EventTypeAscNullsFirst = "eventType_ASC_NULLS_FIRST",
  EventTypeAscNullsLast = "eventType_ASC_NULLS_LAST",
  EventTypeDesc = "eventType_DESC",
  EventTypeDescNullsFirst = "eventType_DESC_NULLS_FIRST",
  EventTypeDescNullsLast = "eventType_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  PoolCapacityAsc = "pool_capacity_ASC",
  PoolCapacityAscNullsFirst = "pool_capacity_ASC_NULLS_FIRST",
  PoolCapacityAscNullsLast = "pool_capacity_ASC_NULLS_LAST",
  PoolCapacityDesc = "pool_capacity_DESC",
  PoolCapacityDescNullsFirst = "pool_capacity_DESC_NULLS_FIRST",
  PoolCapacityDescNullsLast = "pool_capacity_DESC_NULLS_LAST",
  PoolClosedAtBlockAsc = "pool_closedAtBlock_ASC",
  PoolClosedAtBlockAscNullsFirst = "pool_closedAtBlock_ASC_NULLS_FIRST",
  PoolClosedAtBlockAscNullsLast = "pool_closedAtBlock_ASC_NULLS_LAST",
  PoolClosedAtBlockDesc = "pool_closedAtBlock_DESC",
  PoolClosedAtBlockDescNullsFirst = "pool_closedAtBlock_DESC_NULLS_FIRST",
  PoolClosedAtBlockDescNullsLast = "pool_closedAtBlock_DESC_NULLS_LAST",
  PoolClosedAtAsc = "pool_closedAt_ASC",
  PoolClosedAtAscNullsFirst = "pool_closedAt_ASC_NULLS_FIRST",
  PoolClosedAtAscNullsLast = "pool_closedAt_ASC_NULLS_LAST",
  PoolClosedAtDesc = "pool_closedAt_DESC",
  PoolClosedAtDescNullsFirst = "pool_closedAt_DESC_NULLS_FIRST",
  PoolClosedAtDescNullsLast = "pool_closedAt_DESC_NULLS_LAST",
  PoolCreatedAtBlockAsc = "pool_createdAtBlock_ASC",
  PoolCreatedAtBlockAscNullsFirst = "pool_createdAtBlock_ASC_NULLS_FIRST",
  PoolCreatedAtBlockAscNullsLast = "pool_createdAtBlock_ASC_NULLS_LAST",
  PoolCreatedAtBlockDesc = "pool_createdAtBlock_DESC",
  PoolCreatedAtBlockDescNullsFirst = "pool_createdAtBlock_DESC_NULLS_FIRST",
  PoolCreatedAtBlockDescNullsLast = "pool_createdAtBlock_DESC_NULLS_LAST",
  PoolCreatedAtAsc = "pool_createdAt_ASC",
  PoolCreatedAtAscNullsFirst = "pool_createdAt_ASC_NULLS_FIRST",
  PoolCreatedAtAscNullsLast = "pool_createdAt_ASC_NULLS_LAST",
  PoolCreatedAtDesc = "pool_createdAt_DESC",
  PoolCreatedAtDescNullsFirst = "pool_createdAt_DESC_NULLS_FIRST",
  PoolCreatedAtDescNullsLast = "pool_createdAt_DESC_NULLS_LAST",
  PoolIdAsc = "pool_id_ASC",
  PoolIdAscNullsFirst = "pool_id_ASC_NULLS_FIRST",
  PoolIdAscNullsLast = "pool_id_ASC_NULLS_LAST",
  PoolIdDesc = "pool_id_DESC",
  PoolIdDescNullsFirst = "pool_id_DESC_NULLS_FIRST",
  PoolIdDescNullsLast = "pool_id_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolTotalRewardsToppedUpAsc = "pool_totalRewardsToppedUp_ASC",
  PoolTotalRewardsToppedUpAscNullsFirst = "pool_totalRewardsToppedUp_ASC_NULLS_FIRST",
  PoolTotalRewardsToppedUpAscNullsLast = "pool_totalRewardsToppedUp_ASC_NULLS_LAST",
  PoolTotalRewardsToppedUpDesc = "pool_totalRewardsToppedUp_DESC",
  PoolTotalRewardsToppedUpDescNullsFirst = "pool_totalRewardsToppedUp_DESC_NULLS_FIRST",
  PoolTotalRewardsToppedUpDescNullsLast = "pool_totalRewardsToppedUp_DESC_NULLS_LAST",
  PoolTvlStableAsc = "pool_tvlStable_ASC",
  PoolTvlStableAscNullsFirst = "pool_tvlStable_ASC_NULLS_FIRST",
  PoolTvlStableAscNullsLast = "pool_tvlStable_ASC_NULLS_LAST",
  PoolTvlStableDesc = "pool_tvlStable_DESC",
  PoolTvlStableDescNullsFirst = "pool_tvlStable_DESC_NULLS_FIRST",
  PoolTvlStableDescNullsLast = "pool_tvlStable_DESC_NULLS_LAST",
  PoolTvlTotalAsc = "pool_tvlTotal_ASC",
  PoolTvlTotalAscNullsFirst = "pool_tvlTotal_ASC_NULLS_FIRST",
  PoolTvlTotalAscNullsLast = "pool_tvlTotal_ASC_NULLS_LAST",
  PoolTvlTotalDesc = "pool_tvlTotal_DESC",
  PoolTvlTotalDescNullsFirst = "pool_tvlTotal_DESC_NULLS_FIRST",
  PoolTvlTotalDescNullsLast = "pool_tvlTotal_DESC_NULLS_LAST",
  ProviderIdAsc = "providerId_ASC",
  ProviderIdAscNullsFirst = "providerId_ASC_NULLS_FIRST",
  ProviderIdAscNullsLast = "providerId_ASC_NULLS_LAST",
  ProviderIdDesc = "providerId_DESC",
  ProviderIdDescNullsFirst = "providerId_DESC_NULLS_FIRST",
  ProviderIdDescNullsLast = "providerId_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  TxHashAsc = "txHash_ASC",
  TxHashAscNullsFirst = "txHash_ASC_NULLS_FIRST",
  TxHashAscNullsLast = "txHash_ASC_NULLS_LAST",
  TxHashDesc = "txHash_DESC",
  TxHashDescNullsFirst = "txHash_DESC_NULLS_FIRST",
  TxHashDescNullsLast = "txHash_DESC_NULLS_LAST",
}

export enum LiquidityEventType {
  Deposit = "DEPOSIT",
  Exit = "EXIT",
  Withdrawal = "WITHDRAWAL",
}

export type LiquidityEventWhereInput = {
  AND?: InputMaybe<Array<LiquidityEventWhereInput>>;
  OR?: InputMaybe<Array<LiquidityEventWhereInput>>;
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
  eventType_eq?: InputMaybe<LiquidityEventType>;
  eventType_in?: InputMaybe<Array<LiquidityEventType>>;
  eventType_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  eventType_not_eq?: InputMaybe<LiquidityEventType>;
  eventType_not_in?: InputMaybe<Array<LiquidityEventType>>;
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
  pool?: InputMaybe<PoolWhereInput>;
  pool_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  providerId_contains?: InputMaybe<Scalars["String"]["input"]>;
  providerId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  providerId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  providerId_eq?: InputMaybe<Scalars["String"]["input"]>;
  providerId_gt?: InputMaybe<Scalars["String"]["input"]>;
  providerId_gte?: InputMaybe<Scalars["String"]["input"]>;
  providerId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  providerId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  providerId_lt?: InputMaybe<Scalars["String"]["input"]>;
  providerId_lte?: InputMaybe<Scalars["String"]["input"]>;
  providerId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  providerId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  providerId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  providerId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  providerId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  providerId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  providerId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
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
};

export type LiquidityEventsConnection = {
  __typename?: "LiquidityEventsConnection";
  edges: Array<LiquidityEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor: Scalars["String"]["output"];
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor: Scalars["String"]["output"];
};

export type Pool = {
  __typename?: "Pool";
  capacity: Scalars["BigInt"]["output"];
  capacityHistory: Array<CapacityChange>;
  closedAt?: Maybe<Scalars["DateTime"]["output"]>;
  closedAtBlock?: Maybe<Scalars["Int"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  createdAtBlock: Scalars["Int"]["output"];
  distributionRateHistory: Array<DistributionRateChange>;
  id: Scalars["String"]["output"];
  liquidityEvents: Array<LiquidityEvent>;
  rewardRate: Scalars["BigInt"]["output"];
  topUps: Array<TopUp>;
  totalRewardsToppedUp: Scalars["BigInt"]["output"];
  tvlStable: Scalars["BigInt"]["output"];
  tvlTotal: Scalars["BigInt"]["output"];
};

export type PoolCapacityHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<CapacityChangeOrderByInput>>;
  where?: InputMaybe<CapacityChangeWhereInput>;
};

export type PoolDistributionRateHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DistributionRateChangeOrderByInput>>;
  where?: InputMaybe<DistributionRateChangeWhereInput>;
};

export type PoolLiquidityEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<LiquidityEventOrderByInput>>;
  where?: InputMaybe<LiquidityEventWhereInput>;
};

export type PoolTopUpsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TopUpOrderByInput>>;
  where?: InputMaybe<TopUpWhereInput>;
};

export type PoolEdge = {
  __typename?: "PoolEdge";
  cursor: Scalars["String"]["output"];
  node: Pool;
};

export enum PoolOrderByInput {
  CapacityAsc = "capacity_ASC",
  CapacityAscNullsFirst = "capacity_ASC_NULLS_FIRST",
  CapacityAscNullsLast = "capacity_ASC_NULLS_LAST",
  CapacityDesc = "capacity_DESC",
  CapacityDescNullsFirst = "capacity_DESC_NULLS_FIRST",
  CapacityDescNullsLast = "capacity_DESC_NULLS_LAST",
  ClosedAtBlockAsc = "closedAtBlock_ASC",
  ClosedAtBlockAscNullsFirst = "closedAtBlock_ASC_NULLS_FIRST",
  ClosedAtBlockAscNullsLast = "closedAtBlock_ASC_NULLS_LAST",
  ClosedAtBlockDesc = "closedAtBlock_DESC",
  ClosedAtBlockDescNullsFirst = "closedAtBlock_DESC_NULLS_FIRST",
  ClosedAtBlockDescNullsLast = "closedAtBlock_DESC_NULLS_LAST",
  ClosedAtAsc = "closedAt_ASC",
  ClosedAtAscNullsFirst = "closedAt_ASC_NULLS_FIRST",
  ClosedAtAscNullsLast = "closedAt_ASC_NULLS_LAST",
  ClosedAtDesc = "closedAt_DESC",
  ClosedAtDescNullsFirst = "closedAt_DESC_NULLS_FIRST",
  ClosedAtDescNullsLast = "closedAt_DESC_NULLS_LAST",
  CreatedAtBlockAsc = "createdAtBlock_ASC",
  CreatedAtBlockAscNullsFirst = "createdAtBlock_ASC_NULLS_FIRST",
  CreatedAtBlockAscNullsLast = "createdAtBlock_ASC_NULLS_LAST",
  CreatedAtBlockDesc = "createdAtBlock_DESC",
  CreatedAtBlockDescNullsFirst = "createdAtBlock_DESC_NULLS_FIRST",
  CreatedAtBlockDescNullsLast = "createdAtBlock_DESC_NULLS_LAST",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtAscNullsFirst = "createdAt_ASC_NULLS_FIRST",
  CreatedAtAscNullsLast = "createdAt_ASC_NULLS_LAST",
  CreatedAtDesc = "createdAt_DESC",
  CreatedAtDescNullsFirst = "createdAt_DESC_NULLS_FIRST",
  CreatedAtDescNullsLast = "createdAt_DESC_NULLS_LAST",
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  RewardRateAsc = "rewardRate_ASC",
  RewardRateAscNullsFirst = "rewardRate_ASC_NULLS_FIRST",
  RewardRateAscNullsLast = "rewardRate_ASC_NULLS_LAST",
  RewardRateDesc = "rewardRate_DESC",
  RewardRateDescNullsFirst = "rewardRate_DESC_NULLS_FIRST",
  RewardRateDescNullsLast = "rewardRate_DESC_NULLS_LAST",
  TotalRewardsToppedUpAsc = "totalRewardsToppedUp_ASC",
  TotalRewardsToppedUpAscNullsFirst = "totalRewardsToppedUp_ASC_NULLS_FIRST",
  TotalRewardsToppedUpAscNullsLast = "totalRewardsToppedUp_ASC_NULLS_LAST",
  TotalRewardsToppedUpDesc = "totalRewardsToppedUp_DESC",
  TotalRewardsToppedUpDescNullsFirst = "totalRewardsToppedUp_DESC_NULLS_FIRST",
  TotalRewardsToppedUpDescNullsLast = "totalRewardsToppedUp_DESC_NULLS_LAST",
  TvlStableAsc = "tvlStable_ASC",
  TvlStableAscNullsFirst = "tvlStable_ASC_NULLS_FIRST",
  TvlStableAscNullsLast = "tvlStable_ASC_NULLS_LAST",
  TvlStableDesc = "tvlStable_DESC",
  TvlStableDescNullsFirst = "tvlStable_DESC_NULLS_FIRST",
  TvlStableDescNullsLast = "tvlStable_DESC_NULLS_LAST",
  TvlTotalAsc = "tvlTotal_ASC",
  TvlTotalAscNullsFirst = "tvlTotal_ASC_NULLS_FIRST",
  TvlTotalAscNullsLast = "tvlTotal_ASC_NULLS_LAST",
  TvlTotalDesc = "tvlTotal_DESC",
  TvlTotalDescNullsFirst = "tvlTotal_DESC_NULLS_FIRST",
  TvlTotalDescNullsLast = "tvlTotal_DESC_NULLS_LAST",
}

export type PoolWhereInput = {
  AND?: InputMaybe<Array<PoolWhereInput>>;
  OR?: InputMaybe<Array<PoolWhereInput>>;
  capacityHistory_every?: InputMaybe<CapacityChangeWhereInput>;
  capacityHistory_none?: InputMaybe<CapacityChangeWhereInput>;
  capacityHistory_some?: InputMaybe<CapacityChangeWhereInput>;
  capacity_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  capacity_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  capacity_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  capacity_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  capacity_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  capacity_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  capacity_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  capacity_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  capacity_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  closedAtBlock_eq?: InputMaybe<Scalars["Int"]["input"]>;
  closedAtBlock_gt?: InputMaybe<Scalars["Int"]["input"]>;
  closedAtBlock_gte?: InputMaybe<Scalars["Int"]["input"]>;
  closedAtBlock_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  closedAtBlock_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  closedAtBlock_lt?: InputMaybe<Scalars["Int"]["input"]>;
  closedAtBlock_lte?: InputMaybe<Scalars["Int"]["input"]>;
  closedAtBlock_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  closedAtBlock_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  closedAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  closedAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  closedAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  closedAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  closedAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  closedAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  closedAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  closedAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  closedAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  createdAtBlock_eq?: InputMaybe<Scalars["Int"]["input"]>;
  createdAtBlock_gt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAtBlock_gte?: InputMaybe<Scalars["Int"]["input"]>;
  createdAtBlock_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  createdAtBlock_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  createdAtBlock_lt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAtBlock_lte?: InputMaybe<Scalars["Int"]["input"]>;
  createdAtBlock_not_eq?: InputMaybe<Scalars["Int"]["input"]>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  createdAt_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  createdAt_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  createdAt_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  distributionRateHistory_every?: InputMaybe<DistributionRateChangeWhereInput>;
  distributionRateHistory_none?: InputMaybe<DistributionRateChangeWhereInput>;
  distributionRateHistory_some?: InputMaybe<DistributionRateChangeWhereInput>;
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
  liquidityEvents_every?: InputMaybe<LiquidityEventWhereInput>;
  liquidityEvents_none?: InputMaybe<LiquidityEventWhereInput>;
  liquidityEvents_some?: InputMaybe<LiquidityEventWhereInput>;
  rewardRate_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rewardRate_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewardRate_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  topUps_every?: InputMaybe<TopUpWhereInput>;
  topUps_none?: InputMaybe<TopUpWhereInput>;
  topUps_some?: InputMaybe<TopUpWhereInput>;
  totalRewardsToppedUp_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRewardsToppedUp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRewardsToppedUp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRewardsToppedUp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalRewardsToppedUp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  totalRewardsToppedUp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRewardsToppedUp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRewardsToppedUp_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRewardsToppedUp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tvlStable_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlStable_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlStable_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlStable_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tvlStable_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  tvlStable_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlStable_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlStable_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlStable_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tvlTotal_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlTotal_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlTotal_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlTotal_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tvlTotal_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  tvlTotal_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlTotal_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlTotal_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlTotal_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export type PoolsConnection = {
  __typename?: "PoolsConnection";
  edges: Array<PoolEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Query = {
  __typename?: "Query";
  apyTimeseries: ApyTimeseries;
  capacityChangeById?: Maybe<CapacityChange>;
  capacityChanges: Array<CapacityChange>;
  capacityChangesConnection: CapacityChangesConnection;
  distributionRateChangeById?: Maybe<DistributionRateChange>;
  distributionRateChanges: Array<DistributionRateChange>;
  distributionRateChangesConnection: DistributionRateChangesConnection;
  liquidityEventById?: Maybe<LiquidityEvent>;
  liquidityEvents: Array<LiquidityEvent>;
  liquidityEventsConnection: LiquidityEventsConnection;
  poolById?: Maybe<Pool>;
  pools: Array<Pool>;
  poolsConnection: PoolsConnection;
  topUpById?: Maybe<TopUp>;
  topUps: Array<TopUp>;
  topUpsConnection: TopUpsConnection;
  tvlTimeseries: TvlTimeseries;
};

export type QueryApyTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  poolId?: InputMaybe<Scalars["String"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryCapacityChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryCapacityChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<CapacityChangeOrderByInput>>;
  where?: InputMaybe<CapacityChangeWhereInput>;
};

export type QueryCapacityChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<CapacityChangeOrderByInput>;
  where?: InputMaybe<CapacityChangeWhereInput>;
};

export type QueryDistributionRateChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryDistributionRateChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<DistributionRateChangeOrderByInput>>;
  where?: InputMaybe<DistributionRateChangeWhereInput>;
};

export type QueryDistributionRateChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<DistributionRateChangeOrderByInput>;
  where?: InputMaybe<DistributionRateChangeWhereInput>;
};

export type QueryLiquidityEventByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryLiquidityEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<LiquidityEventOrderByInput>>;
  where?: InputMaybe<LiquidityEventWhereInput>;
};

export type QueryLiquidityEventsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<LiquidityEventOrderByInput>;
  where?: InputMaybe<LiquidityEventWhereInput>;
};

export type QueryPoolByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPoolsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolOrderByInput>>;
  where?: InputMaybe<PoolWhereInput>;
};

export type QueryPoolsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<PoolOrderByInput>;
  where?: InputMaybe<PoolWhereInput>;
};

export type QueryTopUpByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryTopUpsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TopUpOrderByInput>>;
  where?: InputMaybe<TopUpWhereInput>;
};

export type QueryTopUpsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<TopUpOrderByInput>;
  where?: InputMaybe<TopUpWhereInput>;
};

export type QueryTvlTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  poolId?: InputMaybe<Scalars["String"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type TopUp = {
  __typename?: "TopUp";
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  pool: Pool;
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type TopUpEdge = {
  __typename?: "TopUpEdge";
  cursor: Scalars["String"]["output"];
  node: TopUp;
};

export enum TopUpOrderByInput {
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
  IdAsc = "id_ASC",
  IdAscNullsFirst = "id_ASC_NULLS_FIRST",
  IdAscNullsLast = "id_ASC_NULLS_LAST",
  IdDesc = "id_DESC",
  IdDescNullsFirst = "id_DESC_NULLS_FIRST",
  IdDescNullsLast = "id_DESC_NULLS_LAST",
  PoolCapacityAsc = "pool_capacity_ASC",
  PoolCapacityAscNullsFirst = "pool_capacity_ASC_NULLS_FIRST",
  PoolCapacityAscNullsLast = "pool_capacity_ASC_NULLS_LAST",
  PoolCapacityDesc = "pool_capacity_DESC",
  PoolCapacityDescNullsFirst = "pool_capacity_DESC_NULLS_FIRST",
  PoolCapacityDescNullsLast = "pool_capacity_DESC_NULLS_LAST",
  PoolClosedAtBlockAsc = "pool_closedAtBlock_ASC",
  PoolClosedAtBlockAscNullsFirst = "pool_closedAtBlock_ASC_NULLS_FIRST",
  PoolClosedAtBlockAscNullsLast = "pool_closedAtBlock_ASC_NULLS_LAST",
  PoolClosedAtBlockDesc = "pool_closedAtBlock_DESC",
  PoolClosedAtBlockDescNullsFirst = "pool_closedAtBlock_DESC_NULLS_FIRST",
  PoolClosedAtBlockDescNullsLast = "pool_closedAtBlock_DESC_NULLS_LAST",
  PoolClosedAtAsc = "pool_closedAt_ASC",
  PoolClosedAtAscNullsFirst = "pool_closedAt_ASC_NULLS_FIRST",
  PoolClosedAtAscNullsLast = "pool_closedAt_ASC_NULLS_LAST",
  PoolClosedAtDesc = "pool_closedAt_DESC",
  PoolClosedAtDescNullsFirst = "pool_closedAt_DESC_NULLS_FIRST",
  PoolClosedAtDescNullsLast = "pool_closedAt_DESC_NULLS_LAST",
  PoolCreatedAtBlockAsc = "pool_createdAtBlock_ASC",
  PoolCreatedAtBlockAscNullsFirst = "pool_createdAtBlock_ASC_NULLS_FIRST",
  PoolCreatedAtBlockAscNullsLast = "pool_createdAtBlock_ASC_NULLS_LAST",
  PoolCreatedAtBlockDesc = "pool_createdAtBlock_DESC",
  PoolCreatedAtBlockDescNullsFirst = "pool_createdAtBlock_DESC_NULLS_FIRST",
  PoolCreatedAtBlockDescNullsLast = "pool_createdAtBlock_DESC_NULLS_LAST",
  PoolCreatedAtAsc = "pool_createdAt_ASC",
  PoolCreatedAtAscNullsFirst = "pool_createdAt_ASC_NULLS_FIRST",
  PoolCreatedAtAscNullsLast = "pool_createdAt_ASC_NULLS_LAST",
  PoolCreatedAtDesc = "pool_createdAt_DESC",
  PoolCreatedAtDescNullsFirst = "pool_createdAt_DESC_NULLS_FIRST",
  PoolCreatedAtDescNullsLast = "pool_createdAt_DESC_NULLS_LAST",
  PoolIdAsc = "pool_id_ASC",
  PoolIdAscNullsFirst = "pool_id_ASC_NULLS_FIRST",
  PoolIdAscNullsLast = "pool_id_ASC_NULLS_LAST",
  PoolIdDesc = "pool_id_DESC",
  PoolIdDescNullsFirst = "pool_id_DESC_NULLS_FIRST",
  PoolIdDescNullsLast = "pool_id_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolTotalRewardsToppedUpAsc = "pool_totalRewardsToppedUp_ASC",
  PoolTotalRewardsToppedUpAscNullsFirst = "pool_totalRewardsToppedUp_ASC_NULLS_FIRST",
  PoolTotalRewardsToppedUpAscNullsLast = "pool_totalRewardsToppedUp_ASC_NULLS_LAST",
  PoolTotalRewardsToppedUpDesc = "pool_totalRewardsToppedUp_DESC",
  PoolTotalRewardsToppedUpDescNullsFirst = "pool_totalRewardsToppedUp_DESC_NULLS_FIRST",
  PoolTotalRewardsToppedUpDescNullsLast = "pool_totalRewardsToppedUp_DESC_NULLS_LAST",
  PoolTvlStableAsc = "pool_tvlStable_ASC",
  PoolTvlStableAscNullsFirst = "pool_tvlStable_ASC_NULLS_FIRST",
  PoolTvlStableAscNullsLast = "pool_tvlStable_ASC_NULLS_LAST",
  PoolTvlStableDesc = "pool_tvlStable_DESC",
  PoolTvlStableDescNullsFirst = "pool_tvlStable_DESC_NULLS_FIRST",
  PoolTvlStableDescNullsLast = "pool_tvlStable_DESC_NULLS_LAST",
  PoolTvlTotalAsc = "pool_tvlTotal_ASC",
  PoolTvlTotalAscNullsFirst = "pool_tvlTotal_ASC_NULLS_FIRST",
  PoolTvlTotalAscNullsLast = "pool_tvlTotal_ASC_NULLS_LAST",
  PoolTvlTotalDesc = "pool_tvlTotal_DESC",
  PoolTvlTotalDescNullsFirst = "pool_tvlTotal_DESC_NULLS_FIRST",
  PoolTvlTotalDescNullsLast = "pool_tvlTotal_DESC_NULLS_LAST",
  TimestampAsc = "timestamp_ASC",
  TimestampAscNullsFirst = "timestamp_ASC_NULLS_FIRST",
  TimestampAscNullsLast = "timestamp_ASC_NULLS_LAST",
  TimestampDesc = "timestamp_DESC",
  TimestampDescNullsFirst = "timestamp_DESC_NULLS_FIRST",
  TimestampDescNullsLast = "timestamp_DESC_NULLS_LAST",
  TxHashAsc = "txHash_ASC",
  TxHashAscNullsFirst = "txHash_ASC_NULLS_FIRST",
  TxHashAscNullsLast = "txHash_ASC_NULLS_LAST",
  TxHashDesc = "txHash_DESC",
  TxHashDescNullsFirst = "txHash_DESC_NULLS_FIRST",
  TxHashDescNullsLast = "txHash_DESC_NULLS_LAST",
}

export type TopUpWhereInput = {
  AND?: InputMaybe<Array<TopUpWhereInput>>;
  OR?: InputMaybe<Array<TopUpWhereInput>>;
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
  pool?: InputMaybe<PoolWhereInput>;
  pool_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  timestamp_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  timestamp_lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
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
};

export type TopUpsConnection = {
  __typename?: "TopUpsConnection";
  edges: Array<TopUpEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type TvlEntry = {
  __typename?: "TvlEntry";
  timestamp: Scalars["DateTime"]["output"];
  value: TvlValue;
};

export type TvlTimeseries = {
  __typename?: "TvlTimeseries";
  data: Array<TvlEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type TvlValue = {
  __typename?: "TvlValue";
  tvlStable: Scalars["BigInt"]["output"];
  tvlTotal: Scalars["BigInt"]["output"];
};

export type ApyTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  poolId: Scalars["String"]["input"];
  to: Scalars["DateTime"]["input"];
}>;

export type ApyTimeseriesQuery = {
  __typename?: "Query";
  apyTimeseries: {
    __typename?: "ApyTimeseries";
    from: string;
    step: number;
    to: string;
    data: Array<{ __typename?: "ApyEntry"; value: number; timestamp: string }>;
  };
};

export type TvlTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  poolId: Scalars["String"]["input"];
  to: Scalars["DateTime"]["input"];
}>;

export type TvlTimeseriesQuery = {
  __typename?: "Query";
  tvlTimeseries: {
    __typename?: "TvlTimeseries";
    from: string;
    step: number;
    to: string;
    data: Array<{
      __typename?: "TvlEntry";
      timestamp: string;
      value: { __typename?: "TvlValue"; tvlStable: string; tvlTotal: string };
    }>;
  };
};

export type PoolByIdQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type PoolByIdQuery = {
  __typename?: "Query";
  poolById?: {
    __typename?: "Pool";
    totalRewardsToppedUp: string;
    createdAt: string;
  };
};

export type LiquidityEventsQueryVariables = Exact<{
  limit: Scalars["Int"]["input"];
  offset: Scalars["Int"]["input"];
  poolId: Scalars["String"]["input"];
}>;

export type LiquidityEventsQuery = {
  __typename?: "Query";
  liquidityEvents: Array<{
    __typename?: "LiquidityEvent";
    eventType: LiquidityEventType;
    txHash: string;
    timestamp: string;
    providerId?: string;
    amount: string;
  }>;
  liquidityEventsConnection: {
    __typename?: "LiquidityEventsConnection";
    totalCount: number;
  };
};

export type TopUpsQueryVariables = Exact<{
  limit: Scalars["Int"]["input"];
  offset: Scalars["Int"]["input"];
  poolId: Scalars["String"]["input"];
}>;

export type TopUpsQuery = {
  __typename?: "Query";
  topUps: Array<{
    __typename?: "TopUp";
    txHash: string;
    timestamp: string;
    amount: string;
  }>;
  topUpsConnection: { __typename?: "TopUpsConnection"; totalCount: number };
};

export const ApyTimeseriesDocument = `
    query apyTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {
  apyTimeseries(from: $from, poolId: $poolId, to: $to) {
    data {
      value
      timestamp
    }
    from
    step
    to
  }
}
    `;

export const useApyTimeseriesQuery = <
  TData = ApyTimeseriesQuery,
  TError = unknown,
>(
  variables: ApyTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<ApyTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<ApyTimeseriesQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<ApyTimeseriesQuery, TError, TData>({
    queryKey: ["apyTimeseries", variables],
    queryFn: fetcher<ApyTimeseriesQuery, ApyTimeseriesQueryVariables>(
      ApyTimeseriesDocument,
      variables,
    ),
    ...options,
  });
};

export const TvlTimeseriesDocument = `
    query tvlTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {
  tvlTimeseries(from: $from, poolId: $poolId, to: $to) {
    data {
      value {
        tvlStable
        tvlTotal
      }
      timestamp
    }
    from
    step
    to
  }
}
    `;

export const useTvlTimeseriesQuery = <
  TData = TvlTimeseriesQuery,
  TError = unknown,
>(
  variables: TvlTimeseriesQueryVariables,
  options?: Omit<
    UseQueryOptions<TvlTimeseriesQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<TvlTimeseriesQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<TvlTimeseriesQuery, TError, TData>({
    queryKey: ["tvlTimeseries", variables],
    queryFn: fetcher<TvlTimeseriesQuery, TvlTimeseriesQueryVariables>(
      TvlTimeseriesDocument,
      variables,
    ),
    ...options,
  });
};

export const PoolByIdDocument = `
    query poolById($id: String!) {
  poolById(id: $id) {
    totalRewardsToppedUp
    createdAt
  }
}
    `;

export const usePoolByIdQuery = <TData = PoolByIdQuery, TError = unknown>(
  variables: PoolByIdQueryVariables,
  options?: Omit<UseQueryOptions<PoolByIdQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<PoolByIdQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<PoolByIdQuery, TError, TData>({
    queryKey: ["poolById", variables],
    queryFn: fetcher<PoolByIdQuery, PoolByIdQueryVariables>(
      PoolByIdDocument,
      variables,
    ),
    ...options,
  });
};

export const LiquidityEventsDocument = `
    query liquidityEvents($limit: Int!, $offset: Int!, $poolId: String!) {
  liquidityEvents(
    limit: $limit
    offset: $offset
    orderBy: timestamp_DESC
    where: {pool: {id_eq: $poolId}}
  ) {
    eventType
    txHash
    timestamp
    providerId
    amount
  }
  liquidityEventsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {
    totalCount
  }
}
    `;

export const useLiquidityEventsQuery = <
  TData = LiquidityEventsQuery,
  TError = unknown,
>(
  variables: LiquidityEventsQueryVariables,
  options?: Omit<
    UseQueryOptions<LiquidityEventsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<LiquidityEventsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<LiquidityEventsQuery, TError, TData>({
    queryKey: ["liquidityEvents", variables],
    queryFn: fetcher<LiquidityEventsQuery, LiquidityEventsQueryVariables>(
      LiquidityEventsDocument,
      variables,
    ),
    ...options,
  });
};

export const TopUpsDocument = `
    query topUps($limit: Int!, $offset: Int!, $poolId: String!) {
  topUps(
    limit: $limit
    offset: $offset
    orderBy: timestamp_DESC
    where: {pool: {id_eq: $poolId}}
  ) {
    txHash
    timestamp
    amount
  }
  topUpsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {
    totalCount
  }
}
    `;

export const useTopUpsQuery = <TData = TopUpsQuery, TError = unknown>(
  variables: TopUpsQueryVariables,
  options?: Omit<UseQueryOptions<TopUpsQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<TopUpsQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<TopUpsQuery, TError, TData>({
    queryKey: ["topUps", variables],
    queryFn: fetcher<TopUpsQuery, TopUpsQueryVariables>(
      TopUpsDocument,
      variables,
    ),
    ...options,
  });
};
