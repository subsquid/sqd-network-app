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

export type ActiveWorkersEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type ActiveWorkersTimeseries = {
  data: Array<ActiveWorkersEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type AprEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<AprValue>;
};

export type AprSnapshot = {
  stakerApr: Scalars["Float"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  workerApr: Scalars["Float"]["output"];
};

export type AprTimeseries = {
  data: Array<AprEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type AprValue = {
  stakerApr: Scalars["Float"]["output"];
  workerApr: Scalars["Float"]["output"];
};

export type Block = {
  hash: Scalars["String"]["output"];
  height: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  l1BlockNumber?: Maybe<Scalars["Int"]["output"]>;
  timestamp: Scalars["DateTime"]["output"];
};

export type BlockEdge = {
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
  edges: Array<BlockEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Commitment = {
  from: Scalars["DateTime"]["output"];
  fromBlock: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  recipients: Array<CommitmentRecipient>;
  to: Scalars["DateTime"]["output"];
  toBlock: Scalars["Int"]["output"];
};

export type CommitmentEdge = {
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
  edges: Array<CommitmentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Contracts = {
  distributedRewardsDistribution?: Maybe<Scalars["String"]["output"]>;
  gatewayRegistry?: Maybe<Scalars["String"]["output"]>;
  networkController?: Maybe<Scalars["String"]["output"]>;
  portalPoolFactory?: Maybe<Scalars["String"]["output"]>;
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
  portalPoolFactory_contains?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  portalPoolFactory_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_eq?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_gt?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_gte?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  portalPoolFactory_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  portalPoolFactory_lt?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_lte?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_not_containsInsensitive?: InputMaybe<
    Scalars["String"]["input"]
  >;
  portalPoolFactory_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  portalPoolFactory_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  portalPoolFactory_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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

export type Delegation = {
  claimableReward: Scalars["BigInt"]["output"];
  claimedReward: Scalars["BigInt"]["output"];
  deposit: Scalars["BigInt"]["output"];
  id: Scalars["String"]["output"];
  lockEnd?: Maybe<Scalars["Int"]["output"]>;
  lockStart?: Maybe<Scalars["Int"]["output"]>;
  locked?: Maybe<Scalars["Boolean"]["output"]>;
  ownerId: Scalars["String"]["output"];
  rewards: Array<DelegationReward>;
  status: DelegationStatus;
  statusHistory: Array<DelegationStatusChange>;
  worker: Worker;
  workerId: Scalars["String"]["output"];
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
  OwnerIdAsc = "ownerId_ASC",
  OwnerIdAscNullsFirst = "ownerId_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "ownerId_ASC_NULLS_LAST",
  OwnerIdDesc = "ownerId_DESC",
  OwnerIdDescNullsFirst = "ownerId_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "ownerId_DESC_NULLS_LAST",
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
  WorkerOwnerIdAsc = "worker_ownerId_ASC",
  WorkerOwnerIdAscNullsFirst = "worker_ownerId_ASC_NULLS_FIRST",
  WorkerOwnerIdAscNullsLast = "worker_ownerId_ASC_NULLS_LAST",
  WorkerOwnerIdDesc = "worker_ownerId_DESC",
  WorkerOwnerIdDescNullsFirst = "worker_ownerId_DESC_NULLS_FIRST",
  WorkerOwnerIdDescNullsLast = "worker_ownerId_DESC_NULLS_LAST",
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
  amount: Scalars["BigInt"]["output"];
  apr: Scalars["Float"]["output"];
  blockNumber: Scalars["Int"]["output"];
  delegation: Delegation;
  delegationId: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
};

export type DelegationRewardEdge = {
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
  DelegationOwnerIdAsc = "delegation_ownerId_ASC",
  DelegationOwnerIdAscNullsFirst = "delegation_ownerId_ASC_NULLS_FIRST",
  DelegationOwnerIdAscNullsLast = "delegation_ownerId_ASC_NULLS_LAST",
  DelegationOwnerIdDesc = "delegation_ownerId_DESC",
  DelegationOwnerIdDescNullsFirst = "delegation_ownerId_DESC_NULLS_FIRST",
  DelegationOwnerIdDescNullsLast = "delegation_ownerId_DESC_NULLS_LAST",
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
  blockNumber: Scalars["Int"]["output"];
  delegation: Delegation;
  delegationId: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  pending: Scalars["Boolean"]["output"];
  status: DelegationStatus;
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
};

export type DelegationStatusChangeEdge = {
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
  DelegationOwnerIdAsc = "delegation_ownerId_ASC",
  DelegationOwnerIdAscNullsFirst = "delegation_ownerId_ASC_NULLS_FIRST",
  DelegationOwnerIdAscNullsLast = "delegation_ownerId_ASC_NULLS_LAST",
  DelegationOwnerIdDesc = "delegation_ownerId_DESC",
  DelegationOwnerIdDescNullsFirst = "delegation_ownerId_DESC_NULLS_FIRST",
  DelegationOwnerIdDescNullsLast = "delegation_ownerId_DESC_NULLS_LAST",
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
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type DelegationsConnection = {
  edges: Array<DelegationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type DelegationsEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DelegationsTimeseries = {
  data: Array<DelegationsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type DelegatorsEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type DelegatorsTimeseries = {
  data: Array<DelegatorsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Epoch = {
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
  edges: Array<EpochEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type OperatorsEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type PageInfo = {
  endCursor: Scalars["String"]["output"];
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor: Scalars["String"]["output"];
};

export type QueriesCountEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type QueriesCountTimeseries = {
  data: Array<QueriesCountEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Query = {
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
  queriesCountTimeseries: QueriesCountTimeseries;
  rewardTimeseries: RewardTimeseries;
  servedDataTimeseries: ServedDataTimeseries;
  settings: Array<Settings>;
  settingsById?: Maybe<Settings>;
  settingsConnection: SettingsConnection;
  squidStatus: SquidStatus;
  storedDataTimeseries: StoredDataTimeseries;
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
  workersSummary: WorkersSummary;
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
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<RewardValue>;
};

export type RewardTimeseries = {
  data: Array<RewardEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type RewardValue = {
  stakerReward: Scalars["BigInt"]["output"];
  workerReward: Scalars["BigInt"]["output"];
};

export type ServedDataEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type ServedDataTimeseries = {
  data: Array<ServedDataEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Settings = {
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
  edges: Array<SettingsEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type SettingsEdge = {
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
  ContractsPortalPoolFactoryAsc = "contracts_portalPoolFactory_ASC",
  ContractsPortalPoolFactoryAscNullsFirst = "contracts_portalPoolFactory_ASC_NULLS_FIRST",
  ContractsPortalPoolFactoryAscNullsLast = "contracts_portalPoolFactory_ASC_NULLS_LAST",
  ContractsPortalPoolFactoryDesc = "contracts_portalPoolFactory_DESC",
  ContractsPortalPoolFactoryDescNullsFirst = "contracts_portalPoolFactory_DESC_NULLS_FIRST",
  ContractsPortalPoolFactoryDescNullsLast = "contracts_portalPoolFactory_DESC_NULLS_LAST",
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
  finalizedHeight: Scalars["Float"]["output"];
  height: Scalars["Float"]["output"];
};

export type StoredDataEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type StoredDataTimeseries = {
  data: Array<StoredDataEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type UniqueOperatorsTimeseries = {
  data: Array<OperatorsEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type UptimeEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value?: Maybe<Scalars["Float"]["output"]>;
};

export type UptimeTimeseries = {
  data: Array<UptimeEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type Worker = {
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
  ownerId: Scalars["String"]["output"];
  peerId: Scalars["String"]["output"];
  queries24Hours?: Maybe<Scalars["BigInt"]["output"]>;
  queries90Days?: Maybe<Scalars["BigInt"]["output"]>;
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
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
};

export type WorkerEdge = {
  cursor: Scalars["String"]["output"];
  node: Worker;
};

export type WorkerMetrics = {
  id: Scalars["String"]["output"];
  pings: Scalars["Int"]["output"];
  queries: Scalars["Int"]["output"];
  scannedData: Scalars["BigInt"]["output"];
  servedData: Scalars["BigInt"]["output"];
  storedData: Scalars["BigInt"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
  worker: Worker;
  workerId: Scalars["String"]["output"];
};

export type WorkerMetricsConnection = {
  edges: Array<WorkerMetricsEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type WorkerMetricsEdge = {
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
  WorkerOwnerIdAsc = "worker_ownerId_ASC",
  WorkerOwnerIdAscNullsFirst = "worker_ownerId_ASC_NULLS_FIRST",
  WorkerOwnerIdAscNullsLast = "worker_ownerId_ASC_NULLS_LAST",
  WorkerOwnerIdDesc = "worker_ownerId_DESC",
  WorkerOwnerIdDescNullsFirst = "worker_ownerId_DESC_NULLS_FIRST",
  WorkerOwnerIdDescNullsLast = "worker_ownerId_DESC_NULLS_LAST",
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
  OwnerIdAsc = "ownerId_ASC",
  OwnerIdAscNullsFirst = "ownerId_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "ownerId_ASC_NULLS_LAST",
  OwnerIdDesc = "ownerId_DESC",
  OwnerIdDescNullsFirst = "ownerId_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "ownerId_DESC_NULLS_LAST",
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
  amount: Scalars["BigInt"]["output"];
  apr: Scalars["Float"]["output"];
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  stakerApr: Scalars["Float"]["output"];
  stakersReward: Scalars["BigInt"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  worker: Worker;
  workerId: Scalars["String"]["output"];
};

export type WorkerRewardEdge = {
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
  WorkerOwnerIdAsc = "worker_ownerId_ASC",
  WorkerOwnerIdAscNullsFirst = "worker_ownerId_ASC_NULLS_FIRST",
  WorkerOwnerIdAscNullsLast = "worker_ownerId_ASC_NULLS_LAST",
  WorkerOwnerIdDesc = "worker_ownerId_DESC",
  WorkerOwnerIdDescNullsFirst = "worker_ownerId_DESC_NULLS_FIRST",
  WorkerOwnerIdDescNullsLast = "worker_ownerId_DESC_NULLS_LAST",
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
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type WorkerRewardsConnection = {
  edges: Array<WorkerRewardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type WorkerSnapshot = {
  epoch: Epoch;
  epochId: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
  worker: Worker;
  workerId: Scalars["String"]["output"];
};

export type WorkerSnapshotDay = {
  timestamp: Scalars["DateTime"]["output"];
  uptime: Scalars["Float"]["output"];
};

export type WorkerSnapshotEdge = {
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
  WorkerOwnerIdAsc = "worker_ownerId_ASC",
  WorkerOwnerIdAscNullsFirst = "worker_ownerId_ASC_NULLS_FIRST",
  WorkerOwnerIdAscNullsLast = "worker_ownerId_ASC_NULLS_LAST",
  WorkerOwnerIdDesc = "worker_ownerId_DESC",
  WorkerOwnerIdDescNullsFirst = "worker_ownerId_DESC_NULLS_FIRST",
  WorkerOwnerIdDescNullsLast = "worker_ownerId_DESC_NULLS_LAST",
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
  epochId_contains?: InputMaybe<Scalars["String"]["input"]>;
  epochId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  epochId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  epochId_eq?: InputMaybe<Scalars["String"]["input"]>;
  epochId_gt?: InputMaybe<Scalars["String"]["input"]>;
  epochId_gte?: InputMaybe<Scalars["String"]["input"]>;
  epochId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  epochId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  epochId_lt?: InputMaybe<Scalars["String"]["input"]>;
  epochId_lte?: InputMaybe<Scalars["String"]["input"]>;
  epochId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  epochId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  epochId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  epochId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  epochId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  epochId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  epochId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type WorkerSnapshotsConnection = {
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
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  pending: Scalars["Boolean"]["output"];
  status: WorkerStatus;
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
  worker: Worker;
  workerId: Scalars["String"]["output"];
};

export type WorkerStatusChangeEdge = {
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
  WorkerOwnerIdAsc = "worker_ownerId_ASC",
  WorkerOwnerIdAscNullsFirst = "worker_ownerId_ASC_NULLS_FIRST",
  WorkerOwnerIdAscNullsLast = "worker_ownerId_ASC_NULLS_LAST",
  WorkerOwnerIdDesc = "worker_ownerId_DESC",
  WorkerOwnerIdDescNullsFirst = "worker_ownerId_DESC_NULLS_FIRST",
  WorkerOwnerIdDescNullsLast = "worker_ownerId_DESC_NULLS_LAST",
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
  worker_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type WorkerStatusChangesConnection = {
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
  edges: Array<WorkerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type WorkersSummary = {
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
  workerApr: Scalars["Float"]["output"];
  workersCount: Scalars["Float"]["output"];
};

export type SquidNetworkHeightQueryVariables = Exact<{ [key: string]: never }>;

export type SquidNetworkHeightQuery = { squidStatus: { height: number } };

export type SettingsQueryVariables = Exact<{ [key: string]: never }>;

export type SettingsQuery = {
  settingsConnection: {
    edges: Array<{
      node: {
        id: string;
        bondAmount?: string | null;
        delegationLimitCoefficient: number;
        minimalWorkerVersion?: string | null;
        recommendedWorkerVersion?: string | null;
      };
    }>;
  };
};

export type AllWorkersQueryVariables = Exact<{ [key: string]: never }>;

export type AllWorkersQuery = {
  workers: Array<{
    id: string;
    name?: string | null;
    peerId: string;
    ownerId: string;
    status: WorkerStatus;
    online?: boolean | null;
    jailed?: boolean | null;
    dialOk?: boolean | null;
    jailReason?: string | null;
    version?: string | null;
    createdAt: string;
    uptime90Days?: number | null;
    uptime24Hours?: number | null;
    apr?: number | null;
    stakerApr?: number | null;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean | null;
    lockEnd?: number | null;
    statusHistory: Array<{
      blockNumber: number;
      pending: boolean;
      timestamp?: string | null;
    }>;
  }>;
};

export type WorkerByPeerIdQueryVariables = Exact<{
  peerId: Scalars["String"]["input"];
  ownerIds?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type WorkerByPeerIdQuery = {
  workers: Array<{
    id: string;
    name?: string | null;
    peerId: string;
    ownerId: string;
    status: WorkerStatus;
    online?: boolean | null;
    jailed?: boolean | null;
    dialOk?: boolean | null;
    jailReason?: string | null;
    version?: string | null;
    createdAt: string;
    uptime90Days?: number | null;
    uptime24Hours?: number | null;
    apr?: number | null;
    stakerApr?: number | null;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean | null;
    lockEnd?: number | null;
    bond: string;
    claimableReward: string;
    claimedReward: string;
    totalDelegationRewards: string;
    queries24Hours?: string | null;
    queries90Days?: string | null;
    scannedData24Hours?: string | null;
    scannedData90Days?: string | null;
    servedData24Hours?: string | null;
    servedData90Days?: string | null;
    storedData?: string | null;
    website?: string | null;
    email?: string | null;
    description?: string | null;
    statusHistory: Array<{
      blockNumber: number;
      pending: boolean;
      timestamp?: string | null;
    }>;
    dayUptimes?: Array<{ timestamp: string; uptime: number }> | null;
    delegations: Array<{
      deposit: string;
      claimableReward: string;
      claimedReward: string;
      locked?: boolean | null;
      lockEnd?: number | null;
      ownerId: string;
    }>;
  }>;
};

export type MyWorkersQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type MyWorkersQuery = {
  workers: Array<{
    id: string;
    name?: string | null;
    peerId: string;
    ownerId: string;
    status: WorkerStatus;
    online?: boolean | null;
    jailed?: boolean | null;
    dialOk?: boolean | null;
    jailReason?: string | null;
    version?: string | null;
    createdAt: string;
    uptime90Days?: number | null;
    uptime24Hours?: number | null;
    apr?: number | null;
    stakerApr?: number | null;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean | null;
    lockEnd?: number | null;
    bond: string;
    claimableReward: string;
    claimedReward: string;
    statusHistory: Array<{
      blockNumber: number;
      pending: boolean;
      timestamp?: string | null;
    }>;
  }>;
};

export type MyWorkersCountQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type MyWorkersCountQuery = { workersConnection: { totalCount: number } };

export type WorkerDelegationInfoQueryVariables = Exact<{
  workerId: Scalars["String"]["input"];
}>;

export type WorkerDelegationInfoQuery = {
  workerById?: {
    bond: string;
    totalDelegation: string;
    capedDelegation: string;
    liveness?: number | null;
    dTenure?: number | null;
    trafficWeight?: number | null;
  } | null;
  settings: Array<{ utilizedStake: string; baseApr: number }>;
};

export type MyDelegationsQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
  peerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type MyDelegationsQuery = {
  workers: Array<{
    id: string;
    name?: string | null;
    peerId: string;
    ownerId: string;
    status: WorkerStatus;
    online?: boolean | null;
    jailed?: boolean | null;
    dialOk?: boolean | null;
    jailReason?: string | null;
    version?: string | null;
    createdAt: string;
    uptime90Days?: number | null;
    uptime24Hours?: number | null;
    apr?: number | null;
    stakerApr?: number | null;
    totalDelegation: string;
    capedDelegation: string;
    delegationCount: number;
    locked?: boolean | null;
    lockEnd?: number | null;
    statusHistory: Array<{
      blockNumber: number;
      pending: boolean;
      timestamp?: string | null;
    }>;
    delegations: Array<{
      deposit: string;
      claimableReward: string;
      claimedReward: string;
      locked?: boolean | null;
      lockEnd?: number | null;
      ownerId: string;
    }>;
  }>;
};

export type WorkersByOwnerQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type WorkersByOwnerQuery = {
  workers: Array<{
    id: string;
    name?: string | null;
    peerId: string;
    ownerId: string;
    bond: string;
    claimableReward: string;
  }>;
};

export type DelegationsByOwnerQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type DelegationsByOwnerQuery = {
  delegations: Array<{
    deposit: string;
    claimableReward: string;
    claimedReward: string;
    locked?: boolean | null;
    lockEnd?: number | null;
    ownerId: string;
    worker: { id: string; name?: string | null; peerId: string };
  }>;
};

export type WorkersSummaryQueryVariables = Exact<{ [key: string]: never }>;

export type WorkersSummaryQuery = {
  workersSummary: {
    onlineWorkersCount: number;
    queries90Days: string;
    queries24Hours: string;
    servedData90Days: string;
    servedData24Hours: string;
    stakerApr: number;
    totalBond: string;
    totalDelegation: string;
    storedData: string;
    workerApr: number;
    workersCount: number;
    blockTimeL1: number;
    lastBlockL1: number;
    lastBlockTimestampL1: string;
    aprs: Array<{ stakerApr: number; timestamp: string; workerApr: number }>;
  };
};

export type CurrentEpochQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentEpochQuery = {
  workersSummary: {
    blockTimeL1: number;
    lastBlockL1: number;
    lastBlockTimestampL1: string;
  };
  epoches: Array<{ number: number; start: number; end: number }>;
};

export type ActiveWorkersTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ActiveWorkersTimeseriesQuery = {
  activeWorkersTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type UniqueOperatorsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UniqueOperatorsTimeseriesQuery = {
  uniqueOperatorsTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type DelegationsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type DelegationsTimeseriesQuery = {
  delegationsTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type DelegatorsTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type DelegatorsTimeseriesQuery = {
  delegatorsTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type QueriesCountTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type QueriesCountTimeseriesQuery = {
  queriesCountTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type ServedDataTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ServedDataTimeseriesQuery = {
  servedDataTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type StoredDataTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type StoredDataTimeseriesQuery = {
  storedDataTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{ timestamp: string; value?: number | null }>;
  };
};

export type RewardTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  to: Scalars["DateTime"]["input"];
  step?: InputMaybe<Scalars["String"]["input"]>;
  workerId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type RewardTimeseriesQuery = {
  rewardTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{
      timestamp: string;
      value?: { workerReward: string; stakerReward: string } | null;
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
  aprTimeseries: {
    step: number;
    from: string;
    to: string;
    data: Array<{
      timestamp: string;
      value?: { workerApr: number; stakerApr: number } | null;
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
  uptimeTimeseries: {
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

export const SquidNetworkHeightDocument = new TypedDocumentString(`
    query squidNetworkHeight {
  squidStatus {
    height
  }
}
    `) as unknown as TypedDocumentString<
  SquidNetworkHeightQuery,
  SquidNetworkHeightQueryVariables
>;
export const SettingsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<SettingsQuery, SettingsQueryVariables>;
export const AllWorkersDocument = new TypedDocumentString(`
    query allWorkers {
  workers(where: {status_eq: ACTIVE}, orderBy: totalDelegation_ASC) {
    id
    name
    peerId
    ownerId
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
}
    `) as unknown as TypedDocumentString<
  AllWorkersQuery,
  AllWorkersQueryVariables
>;
export const WorkerByPeerIdDocument = new TypedDocumentString(`
    query workerByPeerId($peerId: String!, $ownerIds: [String!]) {
  workers(where: {peerId_eq: $peerId}, limit: 1) {
    id
    name
    peerId
    ownerId
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
    bond
    claimableReward
    claimedReward
    totalDelegationRewards
    queries24Hours
    queries90Days
    scannedData24Hours
    scannedData90Days
    servedData24Hours
    servedData90Days
    storedData
    website
    email
    description
    dayUptimes {
      timestamp
      uptime
    }
    delegations(where: {ownerId_in: $ownerIds, deposit_gt: "0"}) {
      deposit
      claimableReward
      claimedReward
      locked
      lockEnd
      ownerId
    }
  }
}
    `) as unknown as TypedDocumentString<
  WorkerByPeerIdQuery,
  WorkerByPeerIdQueryVariables
>;
export const MyWorkersDocument = new TypedDocumentString(`
    query myWorkers($ownerIds: [String!]!) {
  workers(
    orderBy: id_ASC
    where: {ownerId_in: $ownerIds, status_not_eq: WITHDRAWN}
  ) {
    id
    name
    peerId
    ownerId
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
    bond
    claimableReward
    claimedReward
  }
}
    `) as unknown as TypedDocumentString<
  MyWorkersQuery,
  MyWorkersQueryVariables
>;
export const MyWorkersCountDocument = new TypedDocumentString(`
    query myWorkersCount($ownerIds: [String!]!) {
  workersConnection(orderBy: id_ASC, where: {ownerId_in: $ownerIds}) {
    totalCount
  }
}
    `) as unknown as TypedDocumentString<
  MyWorkersCountQuery,
  MyWorkersCountQueryVariables
>;
export const WorkerDelegationInfoDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  WorkerDelegationInfoQuery,
  WorkerDelegationInfoQueryVariables
>;
export const MyDelegationsDocument = new TypedDocumentString(`
    query myDelegations($ownerIds: [String!]!, $peerId: String) {
  workers(
    orderBy: id_ASC
    where: {peerId_eq: $peerId, delegations_some: {ownerId_in: $ownerIds, deposit_gt: "0"}}
  ) {
    id
    name
    peerId
    ownerId
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
    delegations(where: {ownerId_in: $ownerIds, deposit_gt: "0"}) {
      deposit
      claimableReward
      claimedReward
      locked
      lockEnd
      ownerId
    }
  }
}
    `) as unknown as TypedDocumentString<
  MyDelegationsQuery,
  MyDelegationsQueryVariables
>;
export const WorkersByOwnerDocument = new TypedDocumentString(`
    query workersByOwner($ownerIds: [String!]!) {
  workers(
    where: {ownerId_in: $ownerIds, OR: [{bond_gt: "0"}, {claimableReward_gt: "0"}]}
  ) {
    id
    name
    peerId
    ownerId
    bond
    claimableReward
  }
}
    `) as unknown as TypedDocumentString<
  WorkersByOwnerQuery,
  WorkersByOwnerQueryVariables
>;
export const DelegationsByOwnerDocument = new TypedDocumentString(`
    query delegationsByOwner($ownerIds: [String!]!) {
  delegations(
    where: {ownerId_in: $ownerIds, OR: [{deposit_gt: "0"}, {claimableReward_gt: "0"}]}
  ) {
    deposit
    claimableReward
    claimedReward
    locked
    lockEnd
    ownerId
    worker {
      id
      name
      peerId
    }
  }
}
    `) as unknown as TypedDocumentString<
  DelegationsByOwnerQuery,
  DelegationsByOwnerQueryVariables
>;
export const WorkersSummaryDocument = new TypedDocumentString(`
    query workersSummary {
  workersSummary {
    onlineWorkersCount
    queries90Days
    queries24Hours
    servedData90Days
    servedData24Hours
    stakerApr
    totalBond
    totalDelegation
    storedData
    workerApr
    workersCount
    blockTimeL1
    lastBlockL1
    lastBlockTimestampL1
    aprs {
      stakerApr
      timestamp
      workerApr
    }
  }
}
    `) as unknown as TypedDocumentString<
  WorkersSummaryQuery,
  WorkersSummaryQueryVariables
>;
export const CurrentEpochDocument = new TypedDocumentString(`
    query currentEpoch {
  workersSummary {
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
    `) as unknown as TypedDocumentString<
  CurrentEpochQuery,
  CurrentEpochQueryVariables
>;
export const ActiveWorkersTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  ActiveWorkersTimeseriesQuery,
  ActiveWorkersTimeseriesQueryVariables
>;
export const UniqueOperatorsTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  UniqueOperatorsTimeseriesQuery,
  UniqueOperatorsTimeseriesQueryVariables
>;
export const DelegationsTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  DelegationsTimeseriesQuery,
  DelegationsTimeseriesQueryVariables
>;
export const DelegatorsTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  DelegatorsTimeseriesQuery,
  DelegatorsTimeseriesQueryVariables
>;
export const QueriesCountTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  QueriesCountTimeseriesQuery,
  QueriesCountTimeseriesQueryVariables
>;
export const ServedDataTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  ServedDataTimeseriesQuery,
  ServedDataTimeseriesQueryVariables
>;
export const StoredDataTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  StoredDataTimeseriesQuery,
  StoredDataTimeseriesQueryVariables
>;
export const RewardTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  RewardTimeseriesQuery,
  RewardTimeseriesQueryVariables
>;
export const AprTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  AprTimeseriesQuery,
  AprTimeseriesQueryVariables
>;
export const UptimeTimeseriesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<
  UptimeTimeseriesQuery,
  UptimeTimeseriesQueryVariables
>;
