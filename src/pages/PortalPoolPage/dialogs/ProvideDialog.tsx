import { useCallback, useMemo, useState } from 'react';

import { Alert, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, useMySources } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikSelect, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { SourceWalletOption } from '@components/SourceWallet';
import { tokenFormatter } from '@lib/formatters/formatters';
import { toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { useRewardToken } from '@hooks/useRewardToken';

import { usePoolCapacity, usePoolData, usePoolUserData } from '../hooks';
import { calculateExpectedMonthlyPayout, invalidatePoolQueries } from '../utils/poolUtils';

interface ProvideDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const createValidationSchema = (
  userRemainingCapacity: BigNumber,
  poolRemainingCapacity: BigNumber,
  sqdToken: string,
) =>
  yup.object({
    amount: yup
      .string()
      .required('Amount is required')
      .test('positive', 'Amount must be positive', value => {
        return BigNumber(value || '0').gt(0);
      })
      .test('max', function (value) {
        const amount = BigNumber(value || '0');

        if (amount.gt(userRemainingCapacity)) {
          return this.createError({
            message: `You have reached the maximum deposit limit`,
          });
        }

        if (amount.gt(poolRemainingCapacity)) {
          return this.createError({
            message: `Pool is at maximum capacity`,
          });
        }

        return true;
      }),
  });

interface ProvideDialogContentProps {
  poolId: string;
  formik: ReturnType<typeof useFormik<{ amount: string }>>;
}

function ProvideDialogContent({ poolId, formik }: ProvideDialogContentProps) {
  const { SQD_TOKEN } = useContracts();
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);
  const capacity = usePoolCapacity(poolId);
  const { data: sources } = useMySources();
  const { data: rewardToken } = useRewardToken();

  const typedAmount = useMemo(() => BigNumber(formik.values.amount || '0'), [formik.values.amount]);

  const handleMaxClick = useCallback(() => {
    if (capacity) formik.setFieldValue('amount', capacity.effectiveMax.toString());
  }, [formik, capacity]);

  if (!pool || !capacity) return null;

  const isDepositPhase = pool.phase === 'collecting';
  const isPoolFull = capacity.poolRemainingCapacity.isZero();
  const isUserAtLimit = capacity.userRemainingCapacity.isZero();

  const expectedUserDelegation = capacity.currentUserBalance.plus(typedAmount);
  const expectedTotalDelegation = capacity.currentPoolTvl.plus(typedAmount);
  const cappedUserDelegation = capacity.currentUserBalance.plus(
    BigNumber.min(typedAmount, capacity.effectiveMax),
  );
  const userExpectedMonthlyPayout = calculateExpectedMonthlyPayout(pool, cappedUserDelegation);

  return (
    <Stack spacing={2.5}>
      {isDepositPhase && (
        <Alert severity="info">
          Pool is collecting deposits to activate. Your deposit is locked until the pool activates
          or the deposit window closes. If activation fails, you can withdraw your full deposit.
        </Alert>
      )}

      {pool.phase === 'idle' && (
        <Alert severity="warning">
          Pool is paused due to low liquidity. Rewards are not being distributed.
        </Alert>
      )}

      {isPoolFull && (
        <Alert severity="warning">Pool is at maximum capacity. No more deposits accepted.</Alert>
      )}

      {!isPoolFull && isUserAtLimit && (
        <Alert severity="info">
          You have reached the maximum deposit limit of{' '}
          {tokenFormatter(pool.maxDepositPerAddress, SQD_TOKEN, 0)}.
        </Alert>
      )}

      <FormRow>
        <FormikSelect
          id={'source' as any}
          showErrorOnlyOfTouched
          options={sources?.map(s => ({
            label: <SourceWalletOption source={s} />,
            value: s.id,
            disabled: s.type !== AccountType.User,
          }))}
          formik={formik}
        />
      </FormRow>

      <FormRow>
        <FormikTextInput
          id="amount"
          label="Amount"
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder="0"
          disabled={isPoolFull || isUserAtLimit}
          helperText={`Maximum deposit limit: ${tokenFormatter(capacity.effectiveMax, SQD_TOKEN, 0)}`}
          InputProps={{
            endAdornment: (
              <Chip
                clickable
                disabled={
                  isPoolFull || isUserAtLimit || capacity.effectiveMax.eq(formik.values.amount)
                }
                onClick={handleMaxClick}
                label="Max"
              />
            ),
          }}
        />
      </FormRow>

      <Divider />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Total Delegation</Typography>
          <Typography variant="body2">
            {typedAmount.gt(0)
              ? `${tokenFormatter(capacity.currentPoolTvl, '', 0).trim()} → ${tokenFormatter(expectedTotalDelegation, SQD_TOKEN, 0)}`
              : tokenFormatter(pool.tvl.current, SQD_TOKEN, 0)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Your Delegation</Typography>
          <Typography variant="body2">
            {typedAmount.gt(0)
              ? `${tokenFormatter(capacity.currentUserBalance, '', 2).trim()} → ${tokenFormatter(expectedUserDelegation, SQD_TOKEN, 2)}`
              : userData
                ? tokenFormatter(userData.userBalance, SQD_TOKEN, 2)
                : '0 SQD'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">Expected Monthly Payout</Typography>
            <HelpTooltip title="Estimated monthly rewards based on your share of the pool at current APY." />
          </Stack>
          <Typography variant="body2">
            {tokenFormatter(userExpectedMonthlyPayout, rewardToken?.symbol ?? 'USDC', 2)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function ProvideDialog({ open, onClose, poolId }: ProvideDialogProps) {
  const { SQD_TOKEN } = useContracts();
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool } = usePoolData(poolId);
  const capacity = usePoolCapacity(poolId);

  const { userRemainingCapacity, poolRemainingCapacity, maxDepositPerAddress } = capacity || {};

  const validationSchema = useMemo(() => {
    return createValidationSchema(
      userRemainingCapacity ?? BigNumber(0),
      poolRemainingCapacity ?? BigNumber(0),
      SQD_TOKEN,
    );
  }, [userRemainingCapacity, poolRemainingCapacity, SQD_TOKEN]);

  const handleSubmit = useCallback(
    async (values: { amount: string }) => {
      if (!pool) return;

      try {
        const sqdAmount = BigInt(toSqd(values.amount));

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'deposit',
          args: [sqdAmount],
          approve: sqdAmount,
        });

        await invalidatePoolQueries(queryClient, poolId);
        onClose();
      } catch (error) {
        toast.error(errorMessage(error));
      }
    },
    [pool, poolId, writeTransactionAsync, queryClient, onClose],
  );

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  const handleResult = useCallback(
    (confirmed: boolean) => {
      if (!confirmed) return onClose();
      formik.handleSubmit();
    },
    [onClose, formik],
  );

  return (
    <ContractCallDialog
      title="Deposit to Pool"
      open={open}
      onResult={handleResult}
      loading={isPending}
      disableConfirmButton={!formik.isValid || !formik.values.amount || !pool}
    >
      <ProvideDialogContent poolId={poolId} formik={formik} />
    </ContractCallDialog>
  );
}

function LegalDialog({
  open,
  onAccept,
  onReject,
}: {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const handleResult = useCallback(
    (confirmed: boolean) => {
      if (!confirmed) return onReject();
      onAccept();
    },
    [onAccept, onReject],
  );

  return (
    <ContractCallDialog
      title="Terms & Conditions"
      open={open}
      onResult={handleResult}
      confirmButtonText="ACCEPT"
      cancelButtonText="REJECT"
      hideCancelButton={false}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </ContractCallDialog>
  );
}

interface ProvideButtonProps {
  poolId: string;
}

export function ProvideButton({ poolId }: ProvideButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const { data: pool } = usePoolData(poolId);

  const isDisabled = useMemo(() => {
    if (!pool) return true;
    return pool.tvl.current.gte(pool.tvl.max);
  }, [pool]);

  return (
    <>
      <Tooltip title={isDisabled ? 'Pool is at maximum capacity' : ''}>
        <span>
          <Button
            variant="contained"
            color="info"
            fullWidth
            onClick={() => setLegalOpen(true)}
            loading={dialogOpen || legalOpen}
            disabled={isDisabled}
          >
            DEPOSIT
          </Button>
        </span>
      </Tooltip>

      <LegalDialog
        open={legalOpen}
        onAccept={() => {
          setLegalOpen(false);
          setDialogOpen(true);
        }}
        onReject={() => setLegalOpen(false)}
      />
      <ProvideDialog open={dialogOpen} onClose={() => setDialogOpen(false)} poolId={poolId} />
    </>
  );
}
