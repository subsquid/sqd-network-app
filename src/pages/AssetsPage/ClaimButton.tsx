import { useMemo, useState } from 'react';

import { TollOutlined } from '@mui/icons-material';
import { Box, Button, TableBody, TableCell, TableRow } from '@mui/material';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';
import * as yup from 'yup';

import { rewardTreasuryAbi, useReadRouterRewardTreasury } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, SourceWalletWithBalance, Worker } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormRow, FormikSelect } from '@components/Form';
import { Loader } from '@components/Loader';
import { SourceWalletOption } from '@components/SourceWallet';
import { TableList } from '@components/Table/TableList.tsx';
import { WorkerName } from '@components/Worker';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network/utils';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

export const claimSchema = yup.object({
  source: yup.string().label('Source').trim().required('Source is required'),
});

export type SourceWalletWithClaims = SourceWalletWithBalance & {
  claims: (Pick<Worker, 'id' | 'peerId' | 'name'> & {
    type: 'worker' | 'delegation';
    claimableReward: string;
  })[];
};

export function ClaimButton({
  sources,
  disabled,
}: {
  sources?: SourceWalletWithClaims[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        startIcon={<TollOutlined />}
        onClick={() => setOpen(true)}
        color="info"
        variant="contained"
        loading={open}
        disabled={disabled}
      >
        CLAIM
      </Button>
      <ClaimDialog sources={sources} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function ClaimDialog({
  sources,
  open,
  onClose,
}: {
  sources?: SourceWalletWithClaims[];
  open: boolean;
  onClose: () => void;
}) {
  const client = useClient();
  const account = useAccount();

  const { setWaitHeight } = useSquidHeight();

  const contracts = useContracts();
  const contractWriter = useWriteSQDTransaction({});

  const rewardTreasuryAddress = useReadRouterRewardTreasury({
    address: contracts.ROUTER,
  });

  const isLoading = rewardTreasuryAddress.isLoading;

  const initialValues = useMemo(() => {
    const option = sources?.find(c => c.balance !== '0') || sources?.[0];

    return {
      source: option?.id || '0x',
    };
  }, [sources]);

  const formik = useFormik({
    initialValues,
    validationSchema: claimSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!client) return;
      if (!account.address) return;
      if (!rewardTreasuryAddress.data) return;
      if (!sources) return;

      try {
        const { source } = claimSchema.cast(values);

        const wallet = sources.find(w => w?.id === source);
        if (!wallet) return;

        const receipt = await contractWriter.writeTransactionAsync({
          address: rewardTreasuryAddress.data,
          abi: rewardTreasuryAbi,
          functionName: 'claimFor',
          args: [contracts.REWARD_DISTRIBUTION, account.address],
          vesting: wallet.type === AccountType.User ? undefined : (wallet.id as `0x${string}`),
        });
        setWaitHeight(receipt.blockNumber, []);

        onClose();
      } catch (e: unknown) {
        toast.error(errorMessage(e));
      }
    },
  });

  const hasAvailableClaims = useMemo(() => !!sources?.some(s => s.balance !== '0'), [sources]);

  return (
    <ContractCallDialog
      title="Claim rewards"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        formik.handleSubmit();
      }}
      loading={contractWriter.isPending}
      confirmColor="info"
      disableConfirmButton={!formik.isValid || !hasAvailableClaims}
    >
      {isLoading || !sources ? (
        <Loader />
      ) : (
        <Form onSubmit={formik.handleSubmit}>
          <FormRow>
            <FormikSelect
              id="source"
              showErrorOnlyOfTouched
              options={sources?.map(s => ({
                label: <SourceWalletOption source={s} />,
                value: s.id,
                disabled: s.balance === '0',
              }))}
              formik={formik}
              onChange={e => {
                const source = sources.find(s => s.id === e.target.value);
                if (!source) return;

                formik.setFieldValue('source', source.id);
              }}
            />
          </FormRow>

          <Box
            sx={{
              maxHeight: '50vh',
              overflow: 'auto',
            }}
          >
            <TableList>
              <TableBody>
                {sources
                  .find(s => s.id === formik.values.source)
                  ?.claims.map(w => {
                    return (
                      <TableRow key={w.id}>
                        <TableCell>
                          <WorkerName worker={w} />
                        </TableCell>
                        <TableCell>
                          {w.type === 'worker' ? 'Worker reward' : 'Delegation reward'}
                        </TableCell>
                        <TableCell align="right">
                          {tokenFormatter(fromSqd(w.claimableReward), contracts.SQD_TOKEN)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </TableList>
          </Box>
        </Form>
      )}
    </ContractCallDialog>
  );
}
