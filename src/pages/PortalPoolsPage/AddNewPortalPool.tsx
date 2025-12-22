import { useState, useMemo } from 'react';
import { Add } from '@mui/icons-material';
import {
  Button,
  SxProps,
  Box,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as yup from '@schema';

import { SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormikTextInput, FormRow, FormDivider } from '@components/Form';
import { fromSqd, toSqd } from '@lib/network/utils';
import { useContracts } from '@network/useContracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import BigNumber from 'bignumber.js';
import {
  portalPoolFactoryAbi,
  useReadNetworkControllerMinStakeThreshold,
  useReadPortalPoolFactoryCollectionDeadlineSeconds,
  useReadRouterNetworkController,
} from '@api/contracts';
import { toHex } from 'viem';
import { errorMessage } from '@api/contracts/utils';
import { dateFormat } from '@i18n';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { Loader } from '@components/Loader';

export const addPortalSchema = ({ minCapacity }: { minCapacity: BigNumber }) => {
  return yup.object({
    name: yup.string().label('Name').trim().required('Name is required'),
    description: yup.string().label('Description').max(500).trim(),
    capacity: yup
      .decimal()
      .label('Capacity')
      .required()
      .min(minCapacity)
      .typeError('${path} is invalid'),
    earnings: yup
      .decimal()
      .label('Expected Provider Earnings')
      .required()
      .min('0')
      .typeError('${path} is invalid'),
    rateType: yup.string().oneOf(['day', 'month']).required(),
  });
};

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
  const { setWaitHeight } = useSquidHeight();

  const { PORTAL_POOL_FACTORY, ROUTER } = useContracts();
  const { data: NETWORK_CONTROLLER, isLoading: isNetworkControllerLoading } =
    useReadRouterNetworkController({
      address: ROUTER,
    });

  const { data: minCapacity, isLoading: isMinCapacityLoading } =
    useReadNetworkControllerMinStakeThreshold({
      address: NETWORK_CONTROLLER,
      query: { enabled: !!NETWORK_CONTROLLER },
    });

  const validationSchema = useMemo(() => {
    return addPortalSchema({
      minCapacity: fromSqd(minCapacity),
    });
  }, [minCapacity]);

  const { data: collectionDeadlineSeconds, isLoading: isCollectionDeadlineSecondsLoading } =
    useReadPortalPoolFactoryCollectionDeadlineSeconds({
      address: PORTAL_POOL_FACTORY,
    });

  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const isLoading = false;

  const initialSource = sources?.[0];

  const optimalCapacity = useMemo(() => {
    return fromSqd(minCapacity).multipliedBy(1.2);
  }, [minCapacity]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      capacity: undefined,
      earnings: '',
      rateType: 'day' as 'day' | 'month',
    } as any,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        const distributionRatePerSecond = BigInt(
          BigNumber(getRate(values.earnings, values.rateType))
            .div(86400)
            .multipliedBy(10 ** 6)
            .toFixed(0),
        );

        const receipt = await writeTransactionAsync({
          abi: portalPoolFactoryAbi,
          address: PORTAL_POOL_FACTORY,
          functionName: 'createPortalPool',
          args: [
            {
              distributionRatePerSecond,
              capacity: BigInt(toSqd(values.capacity)),
              tokenSuffix: collapseTokenName(values.name),
              operator: initialSource?.id as `0x${string}`,
              peerId: toHex(Date.now()),
              metadata: JSON.stringify({
                name: values.name,
                description: values.description,
              }),
            },
          ],
        });

        setWaitHeight(receipt.blockNumber, []);

        formik.resetForm();

        onResult(true);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    },
  });

  const estimatedCUs = useMemo(() => {
    return BigNumber(formik.values.capacity).multipliedBy(10);
  }, [formik.values.capacity]);

  const deadlineDate = useMemo(() => {
    const date = new Date(Date.now() + Number(collectionDeadlineSeconds) * 1000);
    return dateFormat(date, 'dateTime');
  }, [collectionDeadlineSeconds]);

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
      {isLoading ? (
        <Loader />
      ) : (
        <Form onSubmit={formik.handleSubmit}>
          <FormRow>
            <FormikTextInput id="name" label="Name" formik={formik} showErrorOnlyOfTouched />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="description"
              label="Description"
              formik={formik}
              showErrorOnlyOfTouched
              multiline
              minRows={3}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="capacity"
              label="Pool Capacity"
              formik={formik}
              placeholder={optimalCapacity.toString()}
              showErrorOnlyOfTouched
              InputProps={{
                endAdornment: (
                  <Chip
                    clickable
                    onClick={() => {
                      formik.setValues({
                        ...formik.values,
                        capacity: optimalCapacity,
                      });
                    }}
                    label="Auto"
                  />
                ),
              }}
            />
          </FormRow>
          {/* <Box sx={{ px: 1 }}>
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
        </Box> */}

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
                placeholder="0"
                formik={formik}
                showErrorOnlyOfTouched
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

          <FormDivider />
          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <Typography variant="body2">Estimated CUs</Typography>
              <Typography variant="body2">{estimatedCUs.toLocaleString()}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <Typography variant="body2">Collection Deadline</Typography>
              <Typography variant="body2">{deadlineDate}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <Typography variant="body2">Payment Rate</Typography>
              <Typography variant="body2">
                {getRate(formik.values.earnings, formik.values.rateType).toFixed(2)} USDC/d
              </Typography>
            </Stack>
          </Stack>
        </Form>
      )}
    </ContractCallDialog>
  );
}

function getRate(earnings: string, rateType: 'day' | 'month') {
  return rateType === 'month' ? Number(earnings) / 30 : Number(earnings);
}

function collapseTokenName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
}
