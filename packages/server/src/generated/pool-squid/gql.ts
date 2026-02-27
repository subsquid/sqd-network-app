/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  'query apyTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {\n  apyTimeseries(from: $from, poolId: $poolId, to: $to) {\n    data {\n      value\n      timestamp\n    }\n    from\n    step\n    to\n  }\n}\n\nquery tvlTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {\n  tvlTimeseries(from: $from, poolId: $poolId, to: $to) {\n    data {\n      value {\n        tvlStable\n        tvlTotal\n      }\n      timestamp\n    }\n    from\n    step\n    to\n  }\n}\n\nquery poolById($id: String!) {\n  poolById(id: $id) {\n    totalRewardsToppedUp\n    createdAt\n  }\n}\n\nquery liquidityEvents($limit: Int!, $offset: Int!, $poolId: String!) {\n  liquidityEvents(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}}\n  ) {\n    eventType\n    txHash\n    timestamp\n    providerId\n    amount\n  }\n  liquidityEventsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {\n    totalCount\n  }\n}\n\nquery topUps($limit: Int!, $offset: Int!, $poolId: String!) {\n  topUps(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}}\n  ) {\n    txHash\n    timestamp\n    amount\n  }\n  topUpsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {\n    totalCount\n  }\n}\n\nquery claims($limit: Int!, $offset: Int!, $poolId: String!, $providerId: String) {\n  claims(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId}\n  ) {\n    providerId\n    timestamp\n    txHash\n    blockNumber\n    amount\n    id\n  }\n  claimsConnection(\n    orderBy: id_ASC\n    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId}\n  ) {\n    totalCount\n  }\n}': typeof types.ApyTimeseriesDocument;
};
const documents: Documents = {
  'query apyTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {\n  apyTimeseries(from: $from, poolId: $poolId, to: $to) {\n    data {\n      value\n      timestamp\n    }\n    from\n    step\n    to\n  }\n}\n\nquery tvlTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {\n  tvlTimeseries(from: $from, poolId: $poolId, to: $to) {\n    data {\n      value {\n        tvlStable\n        tvlTotal\n      }\n      timestamp\n    }\n    from\n    step\n    to\n  }\n}\n\nquery poolById($id: String!) {\n  poolById(id: $id) {\n    totalRewardsToppedUp\n    createdAt\n  }\n}\n\nquery liquidityEvents($limit: Int!, $offset: Int!, $poolId: String!) {\n  liquidityEvents(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}}\n  ) {\n    eventType\n    txHash\n    timestamp\n    providerId\n    amount\n  }\n  liquidityEventsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {\n    totalCount\n  }\n}\n\nquery topUps($limit: Int!, $offset: Int!, $poolId: String!) {\n  topUps(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}}\n  ) {\n    txHash\n    timestamp\n    amount\n  }\n  topUpsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {\n    totalCount\n  }\n}\n\nquery claims($limit: Int!, $offset: Int!, $poolId: String!, $providerId: String) {\n  claims(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId}\n  ) {\n    providerId\n    timestamp\n    txHash\n    blockNumber\n    amount\n    id\n  }\n  claimsConnection(\n    orderBy: id_ASC\n    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId}\n  ) {\n    totalCount\n  }\n}':
    types.ApyTimeseriesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query apyTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {\n  apyTimeseries(from: $from, poolId: $poolId, to: $to) {\n    data {\n      value\n      timestamp\n    }\n    from\n    step\n    to\n  }\n}\n\nquery tvlTimeseries($from: DateTime!, $poolId: String!, $to: DateTime!) {\n  tvlTimeseries(from: $from, poolId: $poolId, to: $to) {\n    data {\n      value {\n        tvlStable\n        tvlTotal\n      }\n      timestamp\n    }\n    from\n    step\n    to\n  }\n}\n\nquery poolById($id: String!) {\n  poolById(id: $id) {\n    totalRewardsToppedUp\n    createdAt\n  }\n}\n\nquery liquidityEvents($limit: Int!, $offset: Int!, $poolId: String!) {\n  liquidityEvents(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}}\n  ) {\n    eventType\n    txHash\n    timestamp\n    providerId\n    amount\n  }\n  liquidityEventsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {\n    totalCount\n  }\n}\n\nquery topUps($limit: Int!, $offset: Int!, $poolId: String!) {\n  topUps(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}}\n  ) {\n    txHash\n    timestamp\n    amount\n  }\n  topUpsConnection(orderBy: id_ASC, where: {pool: {id_eq: $poolId}}) {\n    totalCount\n  }\n}\n\nquery claims($limit: Int!, $offset: Int!, $poolId: String!, $providerId: String) {\n  claims(\n    limit: $limit\n    offset: $offset\n    orderBy: timestamp_DESC\n    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId}\n  ) {\n    providerId\n    timestamp\n    txHash\n    blockNumber\n    amount\n    id\n  }\n  claimsConnection(\n    orderBy: id_ASC\n    where: {pool: {id_eq: $poolId}, providerId_eq: $providerId}\n  ) {\n    totalCount\n  }\n}',
): typeof import('./graphql').ApyTimeseriesDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
