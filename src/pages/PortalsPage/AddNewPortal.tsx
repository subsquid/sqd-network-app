import { useState, useMemo } from 'react';
import { Add } from '@mui/icons-material';
import {
  Button,
  SxProps,
  Box,
  Typography,
  Slider,
  Stack,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as yup from '@schema';

import { useMockPortals } from '@api/portal-pools';
import { SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormikTextInput, FormRow, FormDivider } from '@components/Form';
import { FormikSelect } from '@components/Form/FormikSelect';
import { SourceWalletOption } from '@components/SourceWallet';
import { fromSqd } from '@lib/network/utils';

export const addPortalSchema = yup.object({
  source: yup.string().label('Source address').trim().required('Source address is required'),
  description: yup
    .string()
    .label('Description')
    .max(500)
    .trim()
    .required('Description is required'),
  capacity: yup
    .number()
    .label('Capacity')
    .required()
    .min(100000)
    .max(1200000)
    .typeError('${path} is invalid'),
  earnings: yup
    .decimal()
    .label('Expected Provider Earnings')
    .required()
    .positive()
    .typeError('${path} is invalid'),
  rateType: yup.string().oneOf(['day', 'month']).required(),
  collectionPeriod: yup
    .number()
    .label('Collection Period')
    .required()
    .min(1)
    .max(365)
    .typeError('${path} is invalid'),
  preDeposit: yup.boolean(),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

export function AddPortalButton({
  sx,
  disabled,
  sources,
}: {
  sx?: SxProps;
  disabled?: boolean;
  sources?: SourceWalletWithBalance[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        disabled={disabled}
        sx={sx}
        loading={open}
        color="info"
        startIcon={<Add />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        ADD PORTAL
      </Button>
      <AddNewPortalDialog
        open={open}
        onResult={confirmed => {
          setOpen(false);
        }}
        sources={sources}
      />
    </>
  );
}

function AddNewPortalDialog({
  open,
  onResult,
  sources,
}: {
  open: boolean;
  onResult: (confirmed: boolean) => void;
  sources?: SourceWalletWithBalance[];
}) {
  const { addMockPortal } = useMockPortals();
  const [isPending, setIsPending] = useState(false);

  const initialSource = sources?.[0];

  const formik = useFormik({
    initialValues: {
      source: initialSource?.id || '',
      description: '',
      capacity: 1000000,
      earnings: '',
      rateType: 'day' as 'day' | 'month',
      collectionPeriod: 30,
      preDeposit: false,
      max: fromSqd(initialSource?.balance).toString(),
    },
    validationSchema: addPortalSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async values => {
      setIsPending(true);
      try {
        const earningsPerDay =
          values.rateType === 'month'
            ? (parseFloat(values.earnings) / 30) * 1000000
            : parseFloat(values.earnings) * 1000000;

        const deadlineMs = Date.now() + values.collectionPeriod * 24 * 60 * 60 * 1000;

        addMockPortal({
          name: 'New Portal',
          operator: '0xd409943eD69aDe02d0B25D0cbc47dc43b7391c34' as `0x${string}`,
          description: values.description,
          maxCapacity: BigInt(values.capacity) * BigInt('1000000000000000000'), // Convert to wei
          totalStaked: BigInt(0),
          state: 2, // Inactive initially (needs minimum threshold)
          depositDeadline: BigInt(deadlineMs),
          activationTime: BigInt(0),
          paused: false,
          paymentTokens: ['0xA911Abb691d1F09DF1063cE28D78Ba5f9E1E66A2' as `0x${string}`],
          expectedRatePerDay: BigInt(Math.floor(earningsPerDay)),
          rateType: 'day',
          createdAt: new Date(),
          gradualBalance: BigInt(0),
          gradualRatePerSecond: BigInt(Math.floor(earningsPerDay / 86400)),
          gradualLastUpdate: Date.now(),
        });

        toast.success('Portal created successfully');
        onResult(true);
        formik.resetForm();
      } catch (e) {
        toast.error('Failed to create portal');
      } finally {
        setIsPending(false);
      }
    },
  });

  const MIN_CAPACITY = 100000;
  const MAX_CAPACITY = 1200000;
  const OPTIMAL_CAPACITY = 1000000;

  const estimatedCUs = useMemo(() => {
    return Math.floor(formik.values.capacity / 10);
  }, [formik.values.capacity]);

  const deadlineDate = useMemo(() => {
    const date = new Date(Date.now() + formik.values.collectionPeriod * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, [formik.values.collectionPeriod]);

  const getCapacityMultiplier = (capacity: number) => {
    return `${capacity / 100000}x`;
  };

  return (
    <ContractCallDialog
      title="Create Portal Pool"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onResult(false);
        formik.handleSubmit();
      }}
      loading={isPending}
      disableConfirmButton={!formik.isValid}
    >
      <Form onSubmit={formik.handleSubmit}>
        <FormRow>
          <FormikSelect
            id="source"
            showErrorOnlyOfTouched
            options={
              sources?.map(s => {
                return {
                  label: <SourceWalletOption source={s} />,
                  value: s.id,
                  disabled: false,
                };
              }) || []
            }
            formik={formik}
            onChange={e => {
              const source = sources?.find(w => w?.id === e.target.value);
              if (!source) return;

              formik.setFieldValue('source', source.id);
              formik.setFieldValue('max', fromSqd(source.balance).toString());
            }}
          />
        </FormRow>
        <FormRow>
          <FormikTextInput
            id="description"
            label="Description"
            formik={formik}
            showErrorOnlyOfTouched
            multiline
            minRows={3}
            placeholder="This portal is hosted and maintained by..."
          />
        </FormRow>

        <FormRow>
          <FormikTextInput
            id="capacity"
            label="Portal Capacity"
            formik={formik}
            showErrorOnlyOfTouched
            InputProps={{
              endAdornment: <Typography variant="body2">SQD</Typography>,
            }}
          />
        </FormRow>

        <Box sx={{ px: 1 }}>
          <Slider
            value={formik.values.capacity}
            min={MIN_CAPACITY}
            max={MAX_CAPACITY}
            step={10000}
            onChange={(_, value) => formik.setFieldValue('capacity', value)}
            marks={[
              { value: MIN_CAPACITY, label: getCapacityMultiplier(MIN_CAPACITY) },
              { value: OPTIMAL_CAPACITY, label: getCapacityMultiplier(OPTIMAL_CAPACITY) },
              { value: MAX_CAPACITY, label: getCapacityMultiplier(MAX_CAPACITY) },
            ]}
            sx={{
              '& .MuiSlider-track': {
                background:
                  'linear-gradient(90deg, #ef4444 0%, #f97316 20%, #eab308 40%, #84cc16 60%, #22c55e 80%, #06b6d4 100%)',
              },
              '& .MuiSlider-rail': {
                background:
                  'linear-gradient(90deg, #ef4444 0%, #f97316 20%, #eab308 40%, #84cc16 60%, #22c55e 80%, #06b6d4 100%)',
              },
            }}
          />
        </Box>

        <FormRow>
          <Box>
            <Typography variant="body2" mb={1}>
              Payment Tokens (for fee distribution)
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small" disabled={false}>
                USDC
              </Button>
              <Button variant="outlined" size="small" disabled>
                DAI (Coming soon)
              </Button>
              <Button variant="outlined" size="small" disabled>
                USDT (Coming soon)
              </Button>
            </Stack>
          </Box>
        </FormRow>
        <FormRow>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <FormikTextInput
              id="earnings"
              label="Expected Provider Earnings (USDC)"
              formik={formik}
              showErrorOnlyOfTouched
              placeholder="100"
              helperText="This is your expected payment to liquidity providers. Displayed to help providers estimate returns."
            />
            <ToggleButtonGroup
              value={formik.values.rateType}
              exclusive
              onChange={(_, value) => {
                if (value) formik.setFieldValue('rateType', value);
              }}
              size="small"
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </FormRow>

        <FormRow>
          <FormikTextInput
            id="collectionPeriod"
            label="Collection Period (Days)"
            formik={formik}
            showErrorOnlyOfTouched
            helperText={`Deadline: ${deadlineDate}`}
          />
        </FormRow>

        <FormDivider />
        <Stack direction="row" justifyContent="space-between" alignContent="center">
          <Typography variant="body2">Estimated CUs</Typography>
          <Typography variant="body2">{estimatedCUs.toLocaleString()}</Typography>
        </Stack>
      </Form>
    </ContractCallDialog>
  );
}
