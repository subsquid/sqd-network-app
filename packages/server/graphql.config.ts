#!/usr/bin/node

import 'dotenv/config';

import { CodegenConfig } from '@graphql-codegen/cli';

const isMainnet = process.env.NETWORK === 'mainnet';

const workersSquidSchema = isMainnet
  ? process.env.MAINNET_WORKERS_SQUID_API_URL!
  : process.env.TESTNET_WORKERS_SQUID_API_URL!;
const gatewaysSquidSchema = isMainnet
  ? process.env.MAINNET_GATEWAYS_SQUID_API_URL!
  : process.env.TESTNET_GATEWAYS_SQUID_API_URL!;
const tokenSquidSchema = isMainnet
  ? process.env.MAINNET_TOKEN_SQUID_API_URL!
  : process.env.TESTNET_TOKEN_SQUID_API_URL!;

const sharedConfig = {
  maybeValue: 'T',
  avoidOptionals: false,
  skipTypename: true,
  scalars: {
    BigInt: 'string',
    DateTime: 'string',
  },
};

const sharedPreset = {
  preset: 'client' as const,
  presetConfig: {
    fragmentMasking: false,
  },
  config: {
    ...sharedConfig,
    documentMode: 'string',
    useTypeImports: true,
  },
};

export default {
  overwrite: true,
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    'packages/server/src/generated/workers-squid/': {
      schema: workersSquidSchema,
      documents: ['packages/server/graphql/workers-squid.graphql'],
      ...sharedPreset,
    },
    'packages/server/src/generated/gateways-squid/': {
      schema: gatewaysSquidSchema,
      documents: ['packages/server/graphql/gateways-squid.graphql'],
      ...sharedPreset,
    },
    'packages/server/src/generated/token-squid/': {
      schema: tokenSquidSchema,
      documents: ['packages/server/graphql/token-squid.graphql'],
      ...sharedPreset,
    },
  },
} satisfies CodegenConfig;
