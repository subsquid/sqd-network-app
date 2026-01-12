#!/usr/bin/node

import 'dotenv/config';

import { CodegenConfig } from '@graphql-codegen/cli';

export default {
  overwrite: true,
  schema:
    process.env.NETWORK === 'mainnet'
      ? process.env.MAINNET_SQUID_API_URL
      : process.env.TESTNET_SQUID_API_URL,
  documents: ['src/api/subsquid-network-squid/schema.graphql'],
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    'src/api/subsquid-network-squid/graphql.tsx': {
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
        maybeValue: 'T',
        avoidOptionals: false,
        scalars: {
          BigInt: 'string',
          DateTime: 'string',
        },
        fetcher: {
          func: './fetcher#fetcher',
          isReactHook: false,
        },
      },
    },
  },
} satisfies CodegenConfig;
