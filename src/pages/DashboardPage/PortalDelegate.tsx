import { useState, useMemo, useCallback } from 'react';
import { Box, Button, Tab, Tabs, Typography, Chip, Stack, LinearProgress } from '@mui/material';
import { MockPortal } from '@api/portal-pools';
import { Form, FormRow, FormikTextInput, FormDivider, FormikSelect } from '@components/Form';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { SourceWalletOption } from '@components/SourceWallet';
import { SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { fromSqd } from '@lib/network/utils';
import { useFormik } from 'formik';
import * as yup from '@schema';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';

interface PortalDelegateProps {
  portal: MockPortal;
  sources?: SourceWalletWithBalance[];
  onDeposit: (portalAddress: string, amount: bigint) => void;
  onWithdraw: (portalAddress: string, amount: bigint) => void;
  userStake?: bigint;
  disabled?: boolean;
  variant?: 'outlined' | 'contained';
}

const depositSchema = yup.object({
  source: yup.string().label('Source').trim().required().typeError('${path} is invalid'),
  amount: yup
    .decimal()
    .label('Amount')
    .required()
    .positive()
    .max(yup.ref('max'), 'Insufficient balance')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

const withdrawSchema = yup.object({
  amount: yup
    .decimal()
    .label('Amount')
    .required()
    .positive()
    .max(yup.ref('max'), 'Insufficient stake')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

export function PortalDelegate({
  portal,
  sources,
  onDeposit,
  onWithdraw,
  userStake = BigInt(0),
  disabled,
  variant = 'outlined',
}: PortalDelegateProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Button
        disabled={disabled || portal.state !== 0}
        onClick={() => setOpen(true)}
        variant={variant}
        color={variant === 'contained' ? 'info' : 'secondary'}
      >
        DELEGATE
      </Button>
      <PortalDelegateDialog
        open={open}
        onClose={() => setOpen(false)}
        portal={portal}
        sources={sources}
        onDeposit={onDeposit}
        onWithdraw={onWithdraw}
        userStake={userStake}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}

function PortalDelegateDialog({
  open,
  onClose,
  portal,
  sources,
  onDeposit,
  onWithdraw,
  userStake,
  activeTab,
  setActiveTab,
}: {
  open: boolean;
  onClose: () => void;
  portal: MockPortal;
  sources?: SourceWalletWithBalance[];
  onDeposit: (portalAddress: string, amount: bigint) => void;
  onWithdraw: (portalAddress: string, amount: bigint) => void;
  userStake: bigint;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const isSourceDisabled = useCallback(
    (source: SourceWalletWithBalance) => source.balance === '0',
    [],
  );

  const initialDepositValues = useMemo(() => {
    const source = sources?.find(c => !isSourceDisabled(c)) || sources?.[0];

    return {
      source: source?.id || '',
      amount: '',
      max: fromSqd(source?.balance).toString(),
    };
  }, [sources, isSourceDisabled]);

  const availableStake = useMemo(() => formatUnits(userStake, 18), [userStake]);

  const depositFormik = useFormik({
    initialValues: initialDepositValues,
    validationSchema: depositSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async values => {
      setIsPending(true);
      try {
        const source = sources?.find(w => w?.id === values.source);
        if (!source) return;

        const sqdAmount = BigInt(Math.floor(parseFloat(values.amount) * 10 ** 18));
        onDeposit(portal.address, sqdAmount);
        toast.success('Deposit successful');
        onClose();
        depositFormik.resetForm();
      } catch (e) {
        toast.error('Deposit failed');
      } finally {
        setIsPending(false);
      }
    },
  });

  const withdrawFormik = useFormik({
    initialValues: {
      amount: '',
      max: availableStake,
    },
    validationSchema: withdrawSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async values => {
      setIsPending(true);
      try {
        const amount = BigInt(Math.floor(parseFloat(values.amount) * 10 ** 18));
        onWithdraw(portal.address, amount);
        toast.success('Withdrawal request submitted');
        onClose();
        withdrawFormik.resetForm();
      } catch (e) {
        toast.error('Withdrawal request failed');
      } finally {
        setIsPending(false);
      }
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const currentFormik = activeTab === 0 ? depositFormik : withdrawFormik;

  const capacityPercent = (Number(portal.totalStaked) / Number(portal.maxCapacity)) * 100;

  return (
    <ContractCallDialog
      title="Delegate Portal Pool"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();
        currentFormik.handleSubmit();
      }}
      loading={isPending}
      disableConfirmButton={!currentFormik.isValid}
    >
      <Box mb={2}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Deposit" />
          <Tab label="Withdraw" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <Form onSubmit={depositFormik.handleSubmit}>
          <FormRow>
            <FormikSelect
              id="source"
              showErrorOnlyOfTouched
              options={
                sources?.map(s => {
                  return {
                    label: <SourceWalletOption source={s} />,
                    value: s.id,
                    disabled: isSourceDisabled(s),
                  };
                }) || []
              }
              formik={depositFormik}
              onChange={e => {
                const source = sources?.find(w => w?.id === e.target.value);
                if (!source) return;

                depositFormik.setFieldValue('source', source.id);
                depositFormik.setFieldValue('max', fromSqd(source.balance).toString());
              }}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="amount"
              label="Amount"
              formik={depositFormik}
              showErrorOnlyOfTouched
              autoComplete="off"
              placeholder="0"
              InputProps={{
                endAdornment: (
                  <Chip
                    clickable
                    disabled={depositFormik.values.max === depositFormik.values.amount}
                    onClick={() => {
                      depositFormik.setValues({
                        ...depositFormik.values,
                        amount: depositFormik.values.max,
                      });
                    }}
                    label="Max"
                  />
                ),
              }}
            />
          </FormRow>
          <FormDivider />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Total Staked</Typography>
              <Typography variant="body2">
                {formatUnits(portal.totalStaked, 18).slice(0, -14)} SQD
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Expected Rate</Typography>
              <Typography variant="body2">
                {formatUnits(portal.expectedRatePerDay, 6)} USDC/day
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Capacity</Typography>
              <Typography variant="body2">{capacityPercent.toFixed(1)}%</Typography>
            </Stack>
            <Box>
              <LinearProgress
                variant="determinate"
                value={capacityPercent}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      capacityPercent >= 80
                        ? 'error.main'
                        : capacityPercent >= 40
                          ? 'warning.main'
                          : 'primary.main',
                  },
                }}
              />
            </Box>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Your Stake</Typography>
              <Typography variant="body2">
                {userStake > 0 ? `${formatUnits(userStake, 18).slice(0, -14)} SQD` : '0 SQD'}
              </Typography>
            </Stack>
          </Stack>
        </Form>
      ) : (
        <Form onSubmit={withdrawFormik.handleSubmit}>
          <FormRow>
            <FormikSelect
              id="source"
              showErrorOnlyOfTouched
              options={
                sources?.map(s => {
                  return {
                    label: <SourceWalletOption source={s} />,
                    value: s.id,
                    disabled: isSourceDisabled(s),
                  };
                }) || []
              }
              formik={depositFormik}
              onChange={e => {
                const source = sources?.find(w => w?.id === e.target.value);
                if (!source) return;

                depositFormik.setFieldValue('source', source.id);
                depositFormik.setFieldValue('max', fromSqd(source.balance).toString());
              }}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="amount"
              label="Amount"
              formik={withdrawFormik}
              showErrorOnlyOfTouched
              autoComplete="off"
              placeholder="0"
              InputProps={{
                endAdornment: (
                  <Chip
                    clickable
                    disabled={withdrawFormik.values.max === withdrawFormik.values.amount}
                    onClick={() => {
                      withdrawFormik.setValues({
                        ...withdrawFormik.values,
                        amount: withdrawFormik.values.max,
                      });
                    }}
                    label="Max"
                  />
                ),
              }}
            />
          </FormRow>
          <FormDivider />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Total Staked</Typography>
              <Typography variant="body2">
                {formatUnits(portal.totalStaked, 18).slice(0, -14)} SQD
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Expected Rate</Typography>
              <Typography variant="body2">
                {formatUnits(portal.expectedRatePerDay, 6)} USDC/day
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Capacity</Typography>
              <Typography variant="body2">{capacityPercent.toFixed(1)}%</Typography>
            </Stack>
            <Box>
              <LinearProgress
                variant="determinate"
                value={capacityPercent}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      capacityPercent >= 80
                        ? 'error.main'
                        : capacityPercent >= 40
                          ? 'warning.main'
                          : 'primary.main',
                  },
                }}
              />
            </Box>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Your Stake</Typography>
              <Typography variant="body2">
                {userStake > 0 ? `${formatUnits(userStake, 18).slice(0, -14)} SQD` : '0 SQD'}
              </Typography>
            </Stack>
          </Stack>
        </Form>
      )}
    </ContractCallDialog>
  );
}
