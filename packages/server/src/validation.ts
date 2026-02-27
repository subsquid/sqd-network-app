import { z } from 'zod';

const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export const evmAddressSchema = z
  .string()
  .trim()
  .regex(evmAddressRegex, 'Invalid EVM address')
  .transform(value => value.toLowerCase());

export const bigintStringSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Expected non-negative integer string');

export const paginationSchema = z.object({
  limit: z.number().int().positive().max(100),
  offset: z.number().int().nonnegative(),
});
