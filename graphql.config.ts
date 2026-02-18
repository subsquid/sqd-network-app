#!/usr/bin/node

import 'dotenv/config';

import { CodegenConfig } from '@graphql-codegen/cli';

const isMainnet = process.env.NETWORK === 'mainnet';

const networkSquidSchema = isMainnet
  ? process.env.MAINNET_SQUID_API_URL!
  : process.env.TESTNET_SQUID_API_URL!;
const poolSquidSchema = isMainnet
  ? process.env.MAINNET_POOL_SQUID_API_URL!
  : process.env.TESTNET_POOL_SQUID_API_URL!;

const sharedConfig = {
  maybeValue: 'T',
  avoidOptionals: false,
  skipTypename: true,
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
    // Server: types + document strings (TypedDocumentString)
    'server/src/generated/network-squid/': {
      schema: networkSquidSchema,
      documents: ['graphql/network-squid.graphql'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        ...sharedConfig,
        documentMode: 'string',
        useTypeImports: true,
      },
    },
    'server/src/generated/pool-squid/': {
      schema: poolSquidSchema,
      documents: ['graphql/pool-squid.graphql'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        ...sharedConfig,
        documentMode: 'string',
        useTypeImports: true,
      },
    },
  },
} satisfies CodegenConfig;
