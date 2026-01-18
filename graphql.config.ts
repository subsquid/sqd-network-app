#!/usr/bin/node

import 'dotenv/config';

import { CodegenConfig } from '@graphql-codegen/cli';

const isMainnet = process.env.NETWORK === 'mainnet';

const sharedConfig = {
  maybeValue: 'T',
  avoidOptionals: false,
  scalars: {
    BigInt: 'string',
    DateTime: 'string',
  },
};

export default {
  overwrite: true,
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    // Network Squid endpoint
    'src/api/subsquid-network-squid/graphql.tsx': {
      schema: isMainnet ? process.env.MAINNET_SQUID_API_URL! : process.env.TESTNET_SQUID_API_URL!,
      documents: ['src/api/subsquid-network-squid/schema.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        {
          'typescript-react-query': {
            reactQueryVersion: 5,
          },
        },
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
      ],
      config: {
        ...sharedConfig,
        fetcher: {
          func: './fetcher#fetcher',
          isReactHook: false,
        },
      },
    },
    // Pool Squid endpoint
    'src/api/pool-squid/graphql.tsx': {
      schema: isMainnet ? process.env.MAINNET_POOL_SQUID_API_URL! : process.env.TESTNET_POOL_SQUID_API_URL!,
      documents: ['src/api/pool-squid/schema.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        {
          'typescript-react-query': {
            reactQueryVersion: 5,
          },
        },
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
      ],
      config: {
        ...sharedConfig,
        fetcher: {
          func: './fetcher#fetcher',
          isReactHook: false,
        },
      },
    },
  },
} satisfies CodegenConfig;
