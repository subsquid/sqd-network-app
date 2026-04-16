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

export type Gateway = {
  createdAt: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  endpointUrl?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  ownerId: Scalars["String"]["output"];
  stake: GatewayStake;
  stakeId: Scalars["String"]["output"];
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
  OwnerIdAsc = "ownerId_ASC",
  OwnerIdAscNullsFirst = "ownerId_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "ownerId_ASC_NULLS_LAST",
  OwnerIdDesc = "ownerId_DESC",
  OwnerIdDescNullsFirst = "ownerId_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "ownerId_DESC_NULLS_LAST",
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
  StakeOwnerIdAsc = "stake_ownerId_ASC",
  StakeOwnerIdAscNullsFirst = "stake_ownerId_ASC_NULLS_FIRST",
  StakeOwnerIdAscNullsLast = "stake_ownerId_ASC_NULLS_LAST",
  StakeOwnerIdDesc = "stake_ownerId_DESC",
  StakeOwnerIdDescNullsFirst = "stake_ownerId_DESC_NULLS_FIRST",
  StakeOwnerIdDescNullsLast = "stake_ownerId_DESC_NULLS_LAST",
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
  amount: Scalars["BigInt"]["output"];
  autoExtension: Scalars["Boolean"]["output"];
  computationUnits: Scalars["BigInt"]["output"];
  computationUnitsPending?: Maybe<Scalars["BigInt"]["output"]>;
  gateways: Array<Gateway>;
  id: Scalars["String"]["output"];
  lockEnd?: Maybe<Scalars["Int"]["output"]>;
  lockStart?: Maybe<Scalars["Int"]["output"]>;
  locked: Scalars["Boolean"]["output"];
  ownerId: Scalars["String"]["output"];
};

export type GatewayStakeGatewaysArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<GatewayOrderByInput>>;
  where?: InputMaybe<GatewayWhereInput>;
};

export type GatewayStakeEdge = {
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
  OwnerIdAsc = "ownerId_ASC",
  OwnerIdAscNullsFirst = "ownerId_ASC_NULLS_FIRST",
  OwnerIdAscNullsLast = "ownerId_ASC_NULLS_LAST",
  OwnerIdDesc = "ownerId_DESC",
  OwnerIdDescNullsFirst = "ownerId_DESC_NULLS_FIRST",
  OwnerIdDescNullsLast = "ownerId_DESC_NULLS_LAST",
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
};

export type GatewayStakesConnection = {
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
  blockNumber: Scalars["Int"]["output"];
  gateway: Gateway;
  gatewayId: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  status: GatewayStatus;
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
};

export type GatewayStatusChangeEdge = {
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
  GatewayOwnerIdAsc = "gateway_ownerId_ASC",
  GatewayOwnerIdAscNullsFirst = "gateway_ownerId_ASC_NULLS_FIRST",
  GatewayOwnerIdAscNullsLast = "gateway_ownerId_ASC_NULLS_LAST",
  GatewayOwnerIdDesc = "gateway_ownerId_DESC",
  GatewayOwnerIdDescNullsFirst = "gateway_ownerId_DESC_NULLS_FIRST",
  GatewayOwnerIdDescNullsLast = "gateway_ownerId_DESC_NULLS_LAST",
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
  gatewayId_contains?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_eq?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_gt?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_gte?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gatewayId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  gatewayId_lt?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_lte?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gatewayId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  gatewayId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  stake?: InputMaybe<GatewayStakeWhereInput>;
  stakeId_contains?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_eq?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_gt?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_gte?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  stakeId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  stakeId_lt?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_lte?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  stakeId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  stakeId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
  edges: Array<GatewayEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GatewaysSummary = {
  gatewayStakeCount: Scalars["Float"]["output"];
  portalPoolCount: Scalars["Float"]["output"];
  totalGatewayStake: Scalars["BigInt"]["output"];
  totalPortalPoolTvl: Scalars["BigInt"]["output"];
};

export type PageInfo = {
  endCursor: Scalars["String"]["output"];
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor: Scalars["String"]["output"];
};

export type PoolApyEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value: Scalars["Float"]["output"];
};

export type PoolApyTimeseries = {
  data: Array<PoolApyEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type PoolCapacityChange = {
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  newCapacity: Scalars["BigInt"]["output"];
  oldCapacity: Scalars["BigInt"]["output"];
  pool: PortalPool;
  poolId: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type PoolCapacityChangeEdge = {
  cursor: Scalars["String"]["output"];
  node: PoolCapacityChange;
};

export enum PoolCapacityChangeOrderByInput {
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
  PoolMetadataAsc = "pool_metadata_ASC",
  PoolMetadataAscNullsFirst = "pool_metadata_ASC_NULLS_FIRST",
  PoolMetadataAscNullsLast = "pool_metadata_ASC_NULLS_LAST",
  PoolMetadataDesc = "pool_metadata_DESC",
  PoolMetadataDescNullsFirst = "pool_metadata_DESC_NULLS_FIRST",
  PoolMetadataDescNullsLast = "pool_metadata_DESC_NULLS_LAST",
  PoolOperatorAsc = "pool_operator_ASC",
  PoolOperatorAscNullsFirst = "pool_operator_ASC_NULLS_FIRST",
  PoolOperatorAscNullsLast = "pool_operator_ASC_NULLS_LAST",
  PoolOperatorDesc = "pool_operator_DESC",
  PoolOperatorDescNullsFirst = "pool_operator_DESC_NULLS_FIRST",
  PoolOperatorDescNullsLast = "pool_operator_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolRewardTokenAsc = "pool_rewardToken_ASC",
  PoolRewardTokenAscNullsFirst = "pool_rewardToken_ASC_NULLS_FIRST",
  PoolRewardTokenAscNullsLast = "pool_rewardToken_ASC_NULLS_LAST",
  PoolRewardTokenDesc = "pool_rewardToken_DESC",
  PoolRewardTokenDescNullsFirst = "pool_rewardToken_DESC_NULLS_FIRST",
  PoolRewardTokenDescNullsLast = "pool_rewardToken_DESC_NULLS_LAST",
  PoolTokenSuffixAsc = "pool_tokenSuffix_ASC",
  PoolTokenSuffixAscNullsFirst = "pool_tokenSuffix_ASC_NULLS_FIRST",
  PoolTokenSuffixAscNullsLast = "pool_tokenSuffix_ASC_NULLS_LAST",
  PoolTokenSuffixDesc = "pool_tokenSuffix_DESC",
  PoolTokenSuffixDescNullsFirst = "pool_tokenSuffix_DESC_NULLS_FIRST",
  PoolTokenSuffixDescNullsLast = "pool_tokenSuffix_DESC_NULLS_LAST",
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

export type PoolCapacityChangeWhereInput = {
  AND?: InputMaybe<Array<PoolCapacityChangeWhereInput>>;
  OR?: InputMaybe<Array<PoolCapacityChangeWhereInput>>;
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
  pool?: InputMaybe<PortalPoolWhereInput>;
  poolId_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  poolId_lt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_lte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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

export type PoolCapacityChangesConnection = {
  edges: Array<PoolCapacityChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type PoolDistributionRateChange = {
  blockNumber: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  newRate: Scalars["BigInt"]["output"];
  oldRate: Scalars["BigInt"]["output"];
  pool: PortalPool;
  poolId: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type PoolDistributionRateChangeEdge = {
  cursor: Scalars["String"]["output"];
  node: PoolDistributionRateChange;
};

export enum PoolDistributionRateChangeOrderByInput {
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
  PoolMetadataAsc = "pool_metadata_ASC",
  PoolMetadataAscNullsFirst = "pool_metadata_ASC_NULLS_FIRST",
  PoolMetadataAscNullsLast = "pool_metadata_ASC_NULLS_LAST",
  PoolMetadataDesc = "pool_metadata_DESC",
  PoolMetadataDescNullsFirst = "pool_metadata_DESC_NULLS_FIRST",
  PoolMetadataDescNullsLast = "pool_metadata_DESC_NULLS_LAST",
  PoolOperatorAsc = "pool_operator_ASC",
  PoolOperatorAscNullsFirst = "pool_operator_ASC_NULLS_FIRST",
  PoolOperatorAscNullsLast = "pool_operator_ASC_NULLS_LAST",
  PoolOperatorDesc = "pool_operator_DESC",
  PoolOperatorDescNullsFirst = "pool_operator_DESC_NULLS_FIRST",
  PoolOperatorDescNullsLast = "pool_operator_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolRewardTokenAsc = "pool_rewardToken_ASC",
  PoolRewardTokenAscNullsFirst = "pool_rewardToken_ASC_NULLS_FIRST",
  PoolRewardTokenAscNullsLast = "pool_rewardToken_ASC_NULLS_LAST",
  PoolRewardTokenDesc = "pool_rewardToken_DESC",
  PoolRewardTokenDescNullsFirst = "pool_rewardToken_DESC_NULLS_FIRST",
  PoolRewardTokenDescNullsLast = "pool_rewardToken_DESC_NULLS_LAST",
  PoolTokenSuffixAsc = "pool_tokenSuffix_ASC",
  PoolTokenSuffixAscNullsFirst = "pool_tokenSuffix_ASC_NULLS_FIRST",
  PoolTokenSuffixAscNullsLast = "pool_tokenSuffix_ASC_NULLS_LAST",
  PoolTokenSuffixDesc = "pool_tokenSuffix_DESC",
  PoolTokenSuffixDescNullsFirst = "pool_tokenSuffix_DESC_NULLS_FIRST",
  PoolTokenSuffixDescNullsLast = "pool_tokenSuffix_DESC_NULLS_LAST",
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

export type PoolDistributionRateChangeWhereInput = {
  AND?: InputMaybe<Array<PoolDistributionRateChangeWhereInput>>;
  OR?: InputMaybe<Array<PoolDistributionRateChangeWhereInput>>;
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
  pool?: InputMaybe<PortalPoolWhereInput>;
  poolId_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  poolId_lt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_lte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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

export type PoolDistributionRateChangesConnection = {
  edges: Array<PoolDistributionRateChangeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type PoolEvent = {
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["Int"]["output"];
  eventType: PoolEventType;
  id: Scalars["String"]["output"];
  pool: PortalPool;
  poolId: Scalars["String"]["output"];
  providerId?: Maybe<Scalars["String"]["output"]>;
  timestamp: Scalars["DateTime"]["output"];
  txHash: Scalars["String"]["output"];
};

export type PoolEventEdge = {
  cursor: Scalars["String"]["output"];
  node: PoolEvent;
};

export enum PoolEventOrderByInput {
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
  PoolMetadataAsc = "pool_metadata_ASC",
  PoolMetadataAscNullsFirst = "pool_metadata_ASC_NULLS_FIRST",
  PoolMetadataAscNullsLast = "pool_metadata_ASC_NULLS_LAST",
  PoolMetadataDesc = "pool_metadata_DESC",
  PoolMetadataDescNullsFirst = "pool_metadata_DESC_NULLS_FIRST",
  PoolMetadataDescNullsLast = "pool_metadata_DESC_NULLS_LAST",
  PoolOperatorAsc = "pool_operator_ASC",
  PoolOperatorAscNullsFirst = "pool_operator_ASC_NULLS_FIRST",
  PoolOperatorAscNullsLast = "pool_operator_ASC_NULLS_LAST",
  PoolOperatorDesc = "pool_operator_DESC",
  PoolOperatorDescNullsFirst = "pool_operator_DESC_NULLS_FIRST",
  PoolOperatorDescNullsLast = "pool_operator_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolRewardTokenAsc = "pool_rewardToken_ASC",
  PoolRewardTokenAscNullsFirst = "pool_rewardToken_ASC_NULLS_FIRST",
  PoolRewardTokenAscNullsLast = "pool_rewardToken_ASC_NULLS_LAST",
  PoolRewardTokenDesc = "pool_rewardToken_DESC",
  PoolRewardTokenDescNullsFirst = "pool_rewardToken_DESC_NULLS_FIRST",
  PoolRewardTokenDescNullsLast = "pool_rewardToken_DESC_NULLS_LAST",
  PoolTokenSuffixAsc = "pool_tokenSuffix_ASC",
  PoolTokenSuffixAscNullsFirst = "pool_tokenSuffix_ASC_NULLS_FIRST",
  PoolTokenSuffixAscNullsLast = "pool_tokenSuffix_ASC_NULLS_LAST",
  PoolTokenSuffixDesc = "pool_tokenSuffix_DESC",
  PoolTokenSuffixDescNullsFirst = "pool_tokenSuffix_DESC_NULLS_FIRST",
  PoolTokenSuffixDescNullsLast = "pool_tokenSuffix_DESC_NULLS_LAST",
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

export enum PoolEventType {
  Claim = "CLAIM",
  Deposit = "DEPOSIT",
  Exit = "EXIT",
  Topup = "TOPUP",
  Withdrawal = "WITHDRAWAL",
}

export type PoolEventWhereInput = {
  AND?: InputMaybe<Array<PoolEventWhereInput>>;
  OR?: InputMaybe<Array<PoolEventWhereInput>>;
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
  eventType_eq?: InputMaybe<PoolEventType>;
  eventType_in?: InputMaybe<Array<PoolEventType>>;
  eventType_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  eventType_not_eq?: InputMaybe<PoolEventType>;
  eventType_not_in?: InputMaybe<Array<PoolEventType>>;
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
  pool?: InputMaybe<PortalPoolWhereInput>;
  poolId_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  poolId_lt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_lte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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

export type PoolEventsConnection = {
  edges: Array<PoolEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type PoolProvider = {
  deposited: Scalars["BigInt"]["output"];
  /** pool address + provider address */
  id: Scalars["String"]["output"];
  pool: PortalPool;
  poolId: Scalars["String"]["output"];
  providerId: Scalars["String"]["output"];
};

export type PoolProviderEdge = {
  cursor: Scalars["String"]["output"];
  node: PoolProvider;
};

export enum PoolProviderOrderByInput {
  DepositedAsc = "deposited_ASC",
  DepositedAscNullsFirst = "deposited_ASC_NULLS_FIRST",
  DepositedAscNullsLast = "deposited_ASC_NULLS_LAST",
  DepositedDesc = "deposited_DESC",
  DepositedDescNullsFirst = "deposited_DESC_NULLS_FIRST",
  DepositedDescNullsLast = "deposited_DESC_NULLS_LAST",
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
  PoolMetadataAsc = "pool_metadata_ASC",
  PoolMetadataAscNullsFirst = "pool_metadata_ASC_NULLS_FIRST",
  PoolMetadataAscNullsLast = "pool_metadata_ASC_NULLS_LAST",
  PoolMetadataDesc = "pool_metadata_DESC",
  PoolMetadataDescNullsFirst = "pool_metadata_DESC_NULLS_FIRST",
  PoolMetadataDescNullsLast = "pool_metadata_DESC_NULLS_LAST",
  PoolOperatorAsc = "pool_operator_ASC",
  PoolOperatorAscNullsFirst = "pool_operator_ASC_NULLS_FIRST",
  PoolOperatorAscNullsLast = "pool_operator_ASC_NULLS_LAST",
  PoolOperatorDesc = "pool_operator_DESC",
  PoolOperatorDescNullsFirst = "pool_operator_DESC_NULLS_FIRST",
  PoolOperatorDescNullsLast = "pool_operator_DESC_NULLS_LAST",
  PoolRewardRateAsc = "pool_rewardRate_ASC",
  PoolRewardRateAscNullsFirst = "pool_rewardRate_ASC_NULLS_FIRST",
  PoolRewardRateAscNullsLast = "pool_rewardRate_ASC_NULLS_LAST",
  PoolRewardRateDesc = "pool_rewardRate_DESC",
  PoolRewardRateDescNullsFirst = "pool_rewardRate_DESC_NULLS_FIRST",
  PoolRewardRateDescNullsLast = "pool_rewardRate_DESC_NULLS_LAST",
  PoolRewardTokenAsc = "pool_rewardToken_ASC",
  PoolRewardTokenAscNullsFirst = "pool_rewardToken_ASC_NULLS_FIRST",
  PoolRewardTokenAscNullsLast = "pool_rewardToken_ASC_NULLS_LAST",
  PoolRewardTokenDesc = "pool_rewardToken_DESC",
  PoolRewardTokenDescNullsFirst = "pool_rewardToken_DESC_NULLS_FIRST",
  PoolRewardTokenDescNullsLast = "pool_rewardToken_DESC_NULLS_LAST",
  PoolTokenSuffixAsc = "pool_tokenSuffix_ASC",
  PoolTokenSuffixAscNullsFirst = "pool_tokenSuffix_ASC_NULLS_FIRST",
  PoolTokenSuffixAscNullsLast = "pool_tokenSuffix_ASC_NULLS_LAST",
  PoolTokenSuffixDesc = "pool_tokenSuffix_DESC",
  PoolTokenSuffixDescNullsFirst = "pool_tokenSuffix_DESC_NULLS_FIRST",
  PoolTokenSuffixDescNullsLast = "pool_tokenSuffix_DESC_NULLS_LAST",
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
}

export type PoolProviderWhereInput = {
  AND?: InputMaybe<Array<PoolProviderWhereInput>>;
  OR?: InputMaybe<Array<PoolProviderWhereInput>>;
  deposited_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposited_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposited_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposited_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  deposited_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  deposited_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposited_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposited_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  deposited_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
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
  pool?: InputMaybe<PortalPoolWhereInput>;
  poolId_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_gte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  poolId_lt?: InputMaybe<Scalars["String"]["input"]>;
  poolId_lte?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  poolId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  poolId_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  poolId_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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
};

export type PoolProvidersConnection = {
  edges: Array<PoolProviderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type PoolTvlEntry = {
  timestamp: Scalars["DateTime"]["output"];
  value: PoolTvlValue;
};

export type PoolTvlTimeseries = {
  data: Array<PoolTvlEntry>;
  from: Scalars["DateTime"]["output"];
  step: Scalars["Float"]["output"];
  to: Scalars["DateTime"]["output"];
};

export type PoolTvlValue = {
  tvlStable: Scalars["BigInt"]["output"];
  tvlTotal: Scalars["BigInt"]["output"];
};

export type PortalPool = {
  capacity: Scalars["BigInt"]["output"];
  capacityHistory: Array<PoolCapacityChange>;
  closedAt?: Maybe<Scalars["DateTime"]["output"]>;
  closedAtBlock?: Maybe<Scalars["Int"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  createdAtBlock: Scalars["Int"]["output"];
  distributionRateHistory: Array<PoolDistributionRateChange>;
  events: Array<PoolEvent>;
  id: Scalars["String"]["output"];
  metadata?: Maybe<Scalars["String"]["output"]>;
  operator: Scalars["String"]["output"];
  providers: Array<PoolProvider>;
  rewardRate: Scalars["BigInt"]["output"];
  rewardToken: Scalars["String"]["output"];
  tokenSuffix: Scalars["String"]["output"];
  totalRewardsToppedUp: Scalars["BigInt"]["output"];
  tvlStable: Scalars["BigInt"]["output"];
  tvlTotal: Scalars["BigInt"]["output"];
};

export type PortalPoolCapacityHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolCapacityChangeOrderByInput>>;
  where?: InputMaybe<PoolCapacityChangeWhereInput>;
};

export type PortalPoolDistributionRateHistoryArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolDistributionRateChangeOrderByInput>>;
  where?: InputMaybe<PoolDistributionRateChangeWhereInput>;
};

export type PortalPoolEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolEventOrderByInput>>;
  where?: InputMaybe<PoolEventWhereInput>;
};

export type PortalPoolProvidersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolProviderOrderByInput>>;
  where?: InputMaybe<PoolProviderWhereInput>;
};

export type PortalPoolEdge = {
  cursor: Scalars["String"]["output"];
  node: PortalPool;
};

export enum PortalPoolOrderByInput {
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
  MetadataAsc = "metadata_ASC",
  MetadataAscNullsFirst = "metadata_ASC_NULLS_FIRST",
  MetadataAscNullsLast = "metadata_ASC_NULLS_LAST",
  MetadataDesc = "metadata_DESC",
  MetadataDescNullsFirst = "metadata_DESC_NULLS_FIRST",
  MetadataDescNullsLast = "metadata_DESC_NULLS_LAST",
  OperatorAsc = "operator_ASC",
  OperatorAscNullsFirst = "operator_ASC_NULLS_FIRST",
  OperatorAscNullsLast = "operator_ASC_NULLS_LAST",
  OperatorDesc = "operator_DESC",
  OperatorDescNullsFirst = "operator_DESC_NULLS_FIRST",
  OperatorDescNullsLast = "operator_DESC_NULLS_LAST",
  RewardRateAsc = "rewardRate_ASC",
  RewardRateAscNullsFirst = "rewardRate_ASC_NULLS_FIRST",
  RewardRateAscNullsLast = "rewardRate_ASC_NULLS_LAST",
  RewardRateDesc = "rewardRate_DESC",
  RewardRateDescNullsFirst = "rewardRate_DESC_NULLS_FIRST",
  RewardRateDescNullsLast = "rewardRate_DESC_NULLS_LAST",
  RewardTokenAsc = "rewardToken_ASC",
  RewardTokenAscNullsFirst = "rewardToken_ASC_NULLS_FIRST",
  RewardTokenAscNullsLast = "rewardToken_ASC_NULLS_LAST",
  RewardTokenDesc = "rewardToken_DESC",
  RewardTokenDescNullsFirst = "rewardToken_DESC_NULLS_FIRST",
  RewardTokenDescNullsLast = "rewardToken_DESC_NULLS_LAST",
  TokenSuffixAsc = "tokenSuffix_ASC",
  TokenSuffixAscNullsFirst = "tokenSuffix_ASC_NULLS_FIRST",
  TokenSuffixAscNullsLast = "tokenSuffix_ASC_NULLS_LAST",
  TokenSuffixDesc = "tokenSuffix_DESC",
  TokenSuffixDescNullsFirst = "tokenSuffix_DESC_NULLS_FIRST",
  TokenSuffixDescNullsLast = "tokenSuffix_DESC_NULLS_LAST",
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

export type PortalPoolWhereInput = {
  AND?: InputMaybe<Array<PortalPoolWhereInput>>;
  OR?: InputMaybe<Array<PortalPoolWhereInput>>;
  capacityHistory_every?: InputMaybe<PoolCapacityChangeWhereInput>;
  capacityHistory_none?: InputMaybe<PoolCapacityChangeWhereInput>;
  capacityHistory_some?: InputMaybe<PoolCapacityChangeWhereInput>;
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
  distributionRateHistory_every?: InputMaybe<PoolDistributionRateChangeWhereInput>;
  distributionRateHistory_none?: InputMaybe<PoolDistributionRateChangeWhereInput>;
  distributionRateHistory_some?: InputMaybe<PoolDistributionRateChangeWhereInput>;
  events_every?: InputMaybe<PoolEventWhereInput>;
  events_none?: InputMaybe<PoolEventWhereInput>;
  events_some?: InputMaybe<PoolEventWhereInput>;
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
  metadata_contains?: InputMaybe<Scalars["String"]["input"]>;
  metadata_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  metadata_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  metadata_eq?: InputMaybe<Scalars["String"]["input"]>;
  metadata_gt?: InputMaybe<Scalars["String"]["input"]>;
  metadata_gte?: InputMaybe<Scalars["String"]["input"]>;
  metadata_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metadata_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata_lt?: InputMaybe<Scalars["String"]["input"]>;
  metadata_lte?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metadata_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  metadata_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  operator_contains?: InputMaybe<Scalars["String"]["input"]>;
  operator_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  operator_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  operator_eq?: InputMaybe<Scalars["String"]["input"]>;
  operator_gt?: InputMaybe<Scalars["String"]["input"]>;
  operator_gte?: InputMaybe<Scalars["String"]["input"]>;
  operator_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  operator_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  operator_lt?: InputMaybe<Scalars["String"]["input"]>;
  operator_lte?: InputMaybe<Scalars["String"]["input"]>;
  operator_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  operator_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  operator_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  operator_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  operator_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  operator_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  operator_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  providers_every?: InputMaybe<PoolProviderWhereInput>;
  providers_none?: InputMaybe<PoolProviderWhereInput>;
  providers_some?: InputMaybe<PoolProviderWhereInput>;
  rewardRate_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rewardRate_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewardRate_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_not_eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  rewardRate_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rewardToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_eq?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardToken_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  rewardToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardToken_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_contains?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_eq?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_gt?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_gte?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokenSuffix_isNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  tokenSuffix_lt?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_lte?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_not_containsInsensitive?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_not_endsWith?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_not_eq?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokenSuffix_not_startsWith?: InputMaybe<Scalars["String"]["input"]>;
  tokenSuffix_startsWith?: InputMaybe<Scalars["String"]["input"]>;
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

export type PortalPoolsConnection = {
  edges: Array<PortalPoolEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Query = {
  gatewayById?: Maybe<Gateway>;
  gatewayStakeById?: Maybe<GatewayStake>;
  gatewayStakes: Array<GatewayStake>;
  gatewayStakesConnection: GatewayStakesConnection;
  gatewayStatusChangeById?: Maybe<GatewayStatusChange>;
  gatewayStatusChanges: Array<GatewayStatusChange>;
  gatewayStatusChangesConnection: GatewayStatusChangesConnection;
  gateways: Array<Gateway>;
  gatewaysConnection: GatewaysConnection;
  gatewaysSummary: GatewaysSummary;
  poolApyTimeseries: PoolApyTimeseries;
  poolCapacityChangeById?: Maybe<PoolCapacityChange>;
  poolCapacityChanges: Array<PoolCapacityChange>;
  poolCapacityChangesConnection: PoolCapacityChangesConnection;
  poolDistributionRateChangeById?: Maybe<PoolDistributionRateChange>;
  poolDistributionRateChanges: Array<PoolDistributionRateChange>;
  poolDistributionRateChangesConnection: PoolDistributionRateChangesConnection;
  poolEventById?: Maybe<PoolEvent>;
  poolEvents: Array<PoolEvent>;
  poolEventsConnection: PoolEventsConnection;
  poolProviderById?: Maybe<PoolProvider>;
  poolProviders: Array<PoolProvider>;
  poolProvidersConnection: PoolProvidersConnection;
  poolTvlTimeseries: PoolTvlTimeseries;
  portalPoolById?: Maybe<PortalPool>;
  portalPools: Array<PortalPool>;
  portalPoolsConnection: PortalPoolsConnection;
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

export type QueryPoolApyTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  poolId?: InputMaybe<Scalars["String"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryPoolCapacityChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPoolCapacityChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolCapacityChangeOrderByInput>>;
  where?: InputMaybe<PoolCapacityChangeWhereInput>;
};

export type QueryPoolCapacityChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<PoolCapacityChangeOrderByInput>;
  where?: InputMaybe<PoolCapacityChangeWhereInput>;
};

export type QueryPoolDistributionRateChangeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPoolDistributionRateChangesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolDistributionRateChangeOrderByInput>>;
  where?: InputMaybe<PoolDistributionRateChangeWhereInput>;
};

export type QueryPoolDistributionRateChangesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<PoolDistributionRateChangeOrderByInput>;
  where?: InputMaybe<PoolDistributionRateChangeWhereInput>;
};

export type QueryPoolEventByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPoolEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolEventOrderByInput>>;
  where?: InputMaybe<PoolEventWhereInput>;
};

export type QueryPoolEventsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<PoolEventOrderByInput>;
  where?: InputMaybe<PoolEventWhereInput>;
};

export type QueryPoolProviderByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPoolProvidersArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PoolProviderOrderByInput>>;
  where?: InputMaybe<PoolProviderWhereInput>;
};

export type QueryPoolProvidersConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<PoolProviderOrderByInput>;
  where?: InputMaybe<PoolProviderWhereInput>;
};

export type QueryPoolTvlTimeseriesArgs = {
  from?: InputMaybe<Scalars["DateTime"]["input"]>;
  poolId?: InputMaybe<Scalars["String"]["input"]>;
  step?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryPortalPoolByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPortalPoolsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<PortalPoolOrderByInput>>;
  where?: InputMaybe<PortalPoolWhereInput>;
};

export type QueryPortalPoolsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: Array<PortalPoolOrderByInput>;
  where?: InputMaybe<PortalPoolWhereInput>;
};

export type GatewayByPeerIdQueryVariables = Exact<{
  peerId: Scalars["String"]["input"];
}>;

export type GatewayByPeerIdQuery = {
  gatewayById?: {
    id: string;
    name?: string | null;
    status: GatewayStatus;
    description?: string | null;
    email?: string | null;
    endpointUrl?: string | null;
    website?: string | null;
    createdAt: string;
    ownerId: string;
  } | null;
};

export type MyGatewaysQueryVariables = Exact<{
  address: Scalars["String"]["input"];
}>;

export type MyGatewaysQuery = {
  gateways: Array<{
    id: string;
    name?: string | null;
    status: GatewayStatus;
    description?: string | null;
    email?: string | null;
    endpointUrl?: string | null;
    website?: string | null;
    createdAt: string;
    ownerId: string;
  }>;
};

export type MyGatewayStakesQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type MyGatewayStakesQuery = {
  gatewayStakes: Array<{
    id: string;
    amount: string;
    ownerId: string;
    autoExtension: boolean;
    computationUnits: string;
    computationUnitsPending?: string | null;
    locked: boolean;
    lockStart?: number | null;
    lockEnd?: number | null;
  }>;
};

export type GatewayStakesByOwnerQueryVariables = Exact<{
  ownerIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type GatewayStakesByOwnerQuery = {
  gatewayStakes: Array<{ id: string; amount: string; ownerId: string }>;
};

export type GatewaysSummaryQueryVariables = Exact<{ [key: string]: never }>;

export type GatewaysSummaryQuery = {
  gatewaysSummary: { totalGatewayStake: string; totalPortalPoolTvl: string };
};

export type PortalPoolsQueryVariables = Exact<{
  limit: Scalars["Int"]["input"];
  offset: Scalars["Int"]["input"];
}>;

export type PortalPoolsQuery = {
  portalPools: Array<{
    id: string;
    rewardRate: string;
    totalRewardsToppedUp: string;
    tvlStable: string;
    tvlTotal: string;
    closedAt?: string | null;
    closedAtBlock?: number | null;
    createdAt: string;
    createdAtBlock: number;
    capacity: string;
  }>;
};

export type PortalPoolByIdQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type PortalPoolByIdQuery = {
  portalPoolById?: { totalRewardsToppedUp: string; createdAt: string } | null;
};

export type PoolApyTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  poolId: Scalars["String"]["input"];
  to: Scalars["DateTime"]["input"];
}>;

export type PoolApyTimeseriesQuery = {
  poolApyTimeseries: {
    from: string;
    step: number;
    to: string;
    data: Array<{ value: number; timestamp: string }>;
  };
};

export type PoolTvlTimeseriesQueryVariables = Exact<{
  from: Scalars["DateTime"]["input"];
  poolId: Scalars["String"]["input"];
  to: Scalars["DateTime"]["input"];
}>;

export type PoolTvlTimeseriesQuery = {
  poolTvlTimeseries: {
    from: string;
    step: number;
    to: string;
    data: Array<{
      timestamp: string;
      value: { tvlStable: string; tvlTotal: string };
    }>;
  };
};

export type PoolEventsQueryVariables = Exact<{
  limit: Scalars["Int"]["input"];
  offset: Scalars["Int"]["input"];
  poolId: Scalars["String"]["input"];
  providerId?: InputMaybe<Scalars["String"]["input"]>;
  eventTypes?: InputMaybe<Array<PoolEventType> | PoolEventType>;
}>;

export type PoolEventsQuery = {
  poolEvents: Array<{
    id: string;
    eventType: PoolEventType;
    txHash: string;
    timestamp: string;
    providerId?: string | null;
    amount: string;
    blockNumber: number;
  }>;
  poolEventsConnection: { totalCount: number };
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

export const GatewayByPeerIdDocument = new TypedDocumentString(`
    query gatewayByPeerId($peerId: String!) {
  gatewayById(id: $peerId) {
    id
    name
    status
    description
    email
    endpointUrl
    website
    createdAt
    ownerId
  }
}
    `) as unknown as TypedDocumentString<
  GatewayByPeerIdQuery,
  GatewayByPeerIdQueryVariables
>;
export const MyGatewaysDocument = new TypedDocumentString(`
    query myGateways($address: String!) {
  gateways(where: {ownerId_eq: $address, status_not_eq: DEREGISTERED}) {
    id
    name
    status
    description
    email
    endpointUrl
    website
    createdAt
    ownerId
  }
}
    `) as unknown as TypedDocumentString<
  MyGatewaysQuery,
  MyGatewaysQueryVariables
>;
export const MyGatewayStakesDocument = new TypedDocumentString(`
    query myGatewayStakes($ownerIds: [String!]!) {
  gatewayStakes(where: {ownerId_in: $ownerIds, amount_gt: "0"}) {
    id
    amount
    ownerId
    autoExtension
    computationUnits
    computationUnitsPending
    locked
    lockStart
    lockEnd
  }
}
    `) as unknown as TypedDocumentString<
  MyGatewayStakesQuery,
  MyGatewayStakesQueryVariables
>;
export const GatewayStakesByOwnerDocument = new TypedDocumentString(`
    query gatewayStakesByOwner($ownerIds: [String!]!) {
  gatewayStakes(where: {ownerId_in: $ownerIds, amount_gt: "0"}) {
    id
    amount
    ownerId
  }
}
    `) as unknown as TypedDocumentString<
  GatewayStakesByOwnerQuery,
  GatewayStakesByOwnerQueryVariables
>;
export const GatewaysSummaryDocument = new TypedDocumentString(`
    query gatewaysSummary {
  gatewaysSummary {
    totalGatewayStake
    totalPortalPoolTvl
  }
}
    `) as unknown as TypedDocumentString<
  GatewaysSummaryQuery,
  GatewaysSummaryQueryVariables
>;
export const PortalPoolsDocument = new TypedDocumentString(`
    query portalPools($limit: Int!, $offset: Int!) {
  portalPools(limit: $limit, offset: $offset, orderBy: createdAt_DESC) {
    id
    rewardRate
    totalRewardsToppedUp
    tvlStable
    tvlTotal
    closedAt
    closedAtBlock
    createdAt
    createdAtBlock
    capacity
  }
}
    `) as unknown as TypedDocumentString<
  PortalPoolsQuery,
  PortalPoolsQueryVariables
>;
export const PortalPoolByIdDocument = new TypedDocumentString(`
    query portalPoolById($id: String!) {
  portalPoolById(id: $id) {
    totalRewardsToppedUp
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
  PortalPoolByIdQuery,
  PortalPoolByIdQueryVariables
>;
export const PoolApyTimeseriesDocument = new TypedDocumentString(`
    query poolApyTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {
  poolApyTimeseries(from: $from, poolId: $poolId, to: $to) {
    data {
      value
      timestamp
    }
    from
    step
    to
  }
}
    `) as unknown as TypedDocumentString<
  PoolApyTimeseriesQuery,
  PoolApyTimeseriesQueryVariables
>;
export const PoolTvlTimeseriesDocument = new TypedDocumentString(`
    query poolTvlTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {
  poolTvlTimeseries(from: $from, poolId: $poolId, to: $to) {
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
    `) as unknown as TypedDocumentString<
  PoolTvlTimeseriesQuery,
  PoolTvlTimeseriesQueryVariables
>;
export const PoolEventsDocument = new TypedDocumentString(`
    query poolEvents($limit: Int!, $offset: Int!, $poolId: String!, $providerId: String, $eventTypes: [PoolEventType!]) {
  poolEvents(
    limit: $limit
    offset: $offset
    orderBy: timestamp_DESC
    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId, eventType_in: $eventTypes}
  ) {
    id
    eventType
    txHash
    timestamp
    providerId
    amount
    blockNumber
  }
  poolEventsConnection(
    orderBy: id_ASC
    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId, eventType_in: $eventTypes}
  ) {
    totalCount
  }
}
    `) as unknown as TypedDocumentString<
  PoolEventsQuery,
  PoolEventsQueryVariables
>;
