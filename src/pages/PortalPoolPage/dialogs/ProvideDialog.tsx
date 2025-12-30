import { useState, useMemo, useCallback } from "react";
import {
  Alert,
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useQueryClient } from "@tanstack/react-query";

import { portalPoolAbi } from "@api/contracts";
import { useWriteSQDTransaction } from "@api/contracts/useWriteTransaction";
import { ContractCallDialog } from "@components/ContractCallDialog";
import { FormRow, FormikSelect, FormikTextInput } from "@components/Form";
import { HelpTooltip } from "@components/HelpTooltip";
import { tokenFormatter } from "@lib/formatters/formatters";
import { fromSqd, toSqd } from "@lib/network";
import { useContracts } from "@network/useContracts";

import { usePoolCapacity, usePoolData, usePoolUserData } from "../hooks";
import {
  calculateExpectedMonthlyPayout,
  invalidatePoolQueries,
} from "../utils/poolUtils";
import { useAccount } from "@network/useAccount";
import { AccountType, useMySources } from "@api/subsquid-network-squid";
import { SourceWalletOption } from "@components/SourceWallet";
import toast from "react-hot-toast";
import { errorMessage } from "@api/contracts/utils";

interface ProvideDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const createValidationSchema = (
  maxAmount: string,
  userRemainingCapacity: number,
  poolRemainingCapacity: number,
  maxDepositPerAddress: number,
  sqdToken: string,
) =>
  yup.object({
    amount: yup
      .string()
      .required("Amount is required")
      .test("positive", "Amount must be positive", (value) => {
        const num = parseFloat(value || "0");
        return num > 0;
      })
      .test("max", function (value) {
        const num = parseFloat(value || "0");
        const max = parseFloat(this.parent.max || "0");

        if (num <= max) return true;

        if (userRemainingCapacity < poolRemainingCapacity) {
          return this.createError({
            message: `You have reached the maximum deposit limit of ${maxDepositPerAddress.toLocaleString()} ${sqdToken}`,
          });
        } else {
          return this.createError({
            message: `Pool is at maximum capacity`,
          });
        }
      }),
    max: yup.string().required(),
  });

interface ProvideDialogContentProps {
  poolId: string;
  formik: ReturnType<typeof useFormik<{ amount: string; max: string }>>;
}

function ProvideDialogContent({ poolId, formik }: ProvideDialogContentProps) {
  const { SQD_TOKEN } = useContracts();
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);
  const capacity = usePoolCapacity(poolId);

  const { address } = useAccount();
  const { data: sources } = useMySources();

  const {
    maxDepositPerAddress,
    currentUserBalance,
    userRemainingCapacity,
    currentPoolTvl,
    poolRemainingCapacity,
  } = capacity || {};

  const isDepositPhase = pool?.phase === "collecting";
  const isPoolFull = poolRemainingCapacity === 0;
  const isUserAtLimit = userRemainingCapacity === 0;

  const typedAmount = parseFloat(formik.values.amount || "0");
  const maxAllowedDeposit = parseFloat(formik.values.max || "0");

  const expectedUserDelegation = useMemo(
    () => (currentUserBalance || 0) + typedAmount,
    [currentUserBalance, typedAmount],
  );
  const expectedTotalDelegation = useMemo(
    () => (currentPoolTvl || 0) + typedAmount,
    [currentPoolTvl, typedAmount],
  );

  const actualDepositAmount = Math.min(typedAmount, maxAllowedDeposit);
  const cappedUserDelegation = (currentUserBalance || 0) + actualDepositAmount;

  const userExpectedMonthlyPayout = useMemo(
    () =>
      pool ? calculateExpectedMonthlyPayout(pool, cappedUserDelegation) : 0,
    [pool, cappedUserDelegation],
  );

  const handleMaxClick = useCallback(() => {
    formik.setFieldValue("amount", formik.values.max);
  }, [formik]);

  if (!pool) return null;

  return (
    <Stack spacing={2.5}>
      {isDepositPhase && (
        <Alert severity="info">
          Pool is collecting deposits to activate. Your deposit is locked until
          the pool activates or the deposit window closes. If activation fails,
          you can withdraw your full deposit.
        </Alert>
      )}

      {pool.phase === "idle" && (
        <Alert severity="warning">
          Pool is paused due to low liquidity. Rewards are not being
          distributed.
        </Alert>
      )}

      {isPoolFull && (
        <Alert severity="warning">
          Pool is at maximum capacity. No more deposits accepted.
        </Alert>
      )}

      {!isPoolFull && isUserAtLimit && (
        <Alert severity="info">
          You have reached the maximum deposit limit of{" "}
          {tokenFormatter(fromSqd(pool.maxDepositPerAddress), SQD_TOKEN, 0)}.
        </Alert>
      )}

      <FormRow>
        <FormikSelect
          id={"source" as any}
          showErrorOnlyOfTouched
          options={sources?.map((s) => ({
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
          InputProps={{
            endAdornment: (
              <Chip
                clickable
                disabled={
                  isPoolFull ||
                  isUserAtLimit ||
                  formik.values.max === formik.values.amount
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
            {typedAmount > 0
              ? `${currentPoolTvl?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"} → ${expectedTotalDelegation.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${SQD_TOKEN}`
              : tokenFormatter(fromSqd(pool.tvl.current), SQD_TOKEN, 0)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Your Delegation</Typography>
          <Typography variant="body2">
            {typedAmount > 0
              ? `${currentUserBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} → ${expectedUserDelegation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${SQD_TOKEN}`
              : userData
                ? tokenFormatter(fromSqd(userData.userBalance), SQD_TOKEN, 2)
                : "0 SQD"}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">Expected Monthly Payout</Typography>
            <HelpTooltip title="Estimated monthly rewards based on your share of the pool at current APY." />
          </Stack>
          <Typography variant="body2">
            {userExpectedMonthlyPayout > 0
              ? `${userExpectedMonthlyPayout.toFixed(2)} USDC`
              : "0.00 USDC"}
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

  const {
    effectiveMax,
    userRemainingCapacity,
    poolRemainingCapacity,
    maxDepositPerAddress,
  } = capacity || {};

  const validationSchema = useMemo(() => {
    return createValidationSchema(
      effectiveMax?.toString() || "0",
      userRemainingCapacity || 0,
      poolRemainingCapacity || 0,
      maxDepositPerAddress || 0,
      SQD_TOKEN,
    );
  }, [
    effectiveMax,
    userRemainingCapacity,
    poolRemainingCapacity,
    maxDepositPerAddress,
    SQD_TOKEN,
  ]);

  const handleSubmit = useCallback(
    async (values: { amount: string; max: string }) => {
      if (!pool) return;

      try {
        const sqdAmount = BigInt(toSqd(values.amount));

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: "deposit",
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
      amount: "",
      max: effectiveMax?.toString() || "0",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
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
      title="Legal Agreement"
      open={open}
      onResult={handleResult}
      confirmButtonText="Accept"
      cancelButtonText="Reject"
      hideCancelButton={false}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum
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
    return pool.tvl.current >= pool.tvl.max;
  }, [pool]);

  return (
    <>
      <Tooltip title={isDisabled ? "Pool is at maximum capacity" : ""}>
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
      <ProvideDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        poolId={poolId}
      />
    </>
  );
}
