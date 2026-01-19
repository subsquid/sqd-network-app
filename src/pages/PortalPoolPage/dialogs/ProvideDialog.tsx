import { useCallback, useMemo, useState } from 'react';

import { Alert, Box, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
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
import { Loader } from '@components/Loader';
import { SourceWalletOption } from '@components/SourceWallet';
import { tokenFormatter } from '@lib/formatters/formatters';
import { toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { usePoolCapacity, usePoolData, usePoolUserData } from '../hooks';
import { PROVIDE_DIALOG_TEXTS } from '../texts';
import { calculateExpectedMonthlyPayout, invalidatePoolQueries } from '../utils/poolUtils';

const TERMS_ACCEPTANCE_KEY = 'sqd-terms-accepted';
const TERMS_VERSION = '2026-01-15';

const hasAcceptedTerms = (): boolean => {
  try {
    const accepted = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
    return accepted === TERMS_VERSION;
  } catch {
    return false;
  }
};

const setTermsAccepted = (): void => {
  try {
    localStorage.setItem(TERMS_ACCEPTANCE_KEY, TERMS_VERSION);
  } catch {
    // Ignore localStorage errors
  }
};

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
            message: 'You have reached the maximum deposit limit',
          });
        }

        if (amount.gt(poolRemainingCapacity)) {
          return this.createError({
            message: 'Pool is at maximum capacity',
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
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { data: userData, isLoading: userDataLoading } = usePoolUserData(poolId);
  const capacity = usePoolCapacity(poolId);
  const { data: sources } = useMySources();

  const typedAmount = useMemo(() => BigNumber(formik.values.amount || '0'), [formik.values.amount]);

  const handleMaxClick = useCallback(() => {
    if (capacity) formik.setFieldValue('amount', capacity.effectiveMax.toString());
  }, [formik, capacity]);

  if (poolLoading || userDataLoading) return <Loader />;
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
      {isDepositPhase && <Alert severity="info">{PROVIDE_DIALOG_TEXTS.alerts.collecting}</Alert>}

      {pool.phase === 'idle' && (
        <Alert severity="warning">{PROVIDE_DIALOG_TEXTS.alerts.idle}</Alert>
      )}

      {isPoolFull && <Alert severity="warning">{PROVIDE_DIALOG_TEXTS.alerts.poolFull}</Alert>}

      {!isPoolFull && isUserAtLimit && (
        <Alert severity="info">
          {PROVIDE_DIALOG_TEXTS.alerts.userAtLimit(
            tokenFormatter(pool.maxDepositPerAddress, SQD_TOKEN, 0),
          )}
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
          label={PROVIDE_DIALOG_TEXTS.amountLabel}
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
          <Typography variant="body2">{PROVIDE_DIALOG_TEXTS.fields.totalDelegation}</Typography>
          <Typography variant="body2">
            {typedAmount.gt(0)
              ? `${tokenFormatter(capacity.currentPoolTvl, '', 0).trim()} → ${tokenFormatter(expectedTotalDelegation, SQD_TOKEN, 0)}`
              : tokenFormatter(pool.tvl.current, SQD_TOKEN, 0)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">{PROVIDE_DIALOG_TEXTS.fields.yourDelegation}</Typography>
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
            <Typography variant="body2">
              {PROVIDE_DIALOG_TEXTS.fields.expectedMonthlyPayout.label}
            </Typography>
            <HelpTooltip title={PROVIDE_DIALOG_TEXTS.fields.expectedMonthlyPayout.tooltip} />
          </Stack>
          <Typography variant="body2">
            {tokenFormatter(userExpectedMonthlyPayout, pool.rewardToken.symbol, 2)}
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
      title={PROVIDE_DIALOG_TEXTS.title}
      open={open}
      onResult={handleResult}
      loading={isPending}
      disableConfirmButton={!formik.isValid || !formik.values.amount || !pool}
    >
      <ProvideDialogContent poolId={poolId} formik={formik} />
    </ContractCallDialog>
  );
}

function TermsContent() {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          1. The Interface
        </Typography>
        <Typography variant="body2" paragraph>
          The web-based interface made available under the name "SQD Revenue Pools" (the
          "Interface") provides a means of accessing and viewing certain information related to
          revenue pools and of facilitating user-initiated interactions with specific smart
          contracts deployed on distributed-ledger networks. The Interface is intended solely for
          informational and visualization purposes and enables SQD token holders to voluntarily lock
          SQD tokens in the smart contracts of the SQD revenue pools to contribute to the SQD
          network under the applicable pool parameters.
        </Typography>
        <Typography variant="body2" paragraph>
          The Interface does not constitute, and shall not be construed as, an offer, solicitation,
          recommendation, or invitation to participate in any revenue pool, to lock SQD tokens, or
          to engage in any transaction involving digital assets.
        </Typography>
        <Typography variant="body2" paragraph>
          Use of the Interface is optional and entirely at the user's own initiative and risk.
        </Typography>
        <Typography variant="body2" paragraph>
          The Interface is distinct from any underlying smart contracts, distributed-ledger
          networks, or revenue pool mechanisms. The Interface is one, but not the exclusive, means
          of interacting with such smart contracts. All smart contracts referenced or visualized
          through the Interface are self-executing software deployed on public distributed-ledger
          networks and operate independently of the Interface.
        </Typography>
        <Typography variant="body2" paragraph>
          Subsquid Labs GmbH (Zug, Switzerland, "Subsquid") does not control, operate, administer,
          execute, or modify any smart contract, distributed-ledger network, or transaction
          execution.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          2. Eligibility, Representations, Lawful Use
        </Typography>
        <Typography variant="body2" paragraph>
          You represent and warrant that you have the full right, power, and authority to access and
          use the Interface and to enter into these Terms of Use. You further represent and warrant
          that your access to and use of the Interface complies with all applicable laws, rules, and
          regulations in your jurisdiction and that you are not subject to any legal restriction or
          prohibition that would prevent such use.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          3. No Offer, No Solicitation, No Recommendation
        </Typography>
        <Typography variant="body2" paragraph>
          The Interface does not constitute, and shall not be construed as, an offer, solicitation,
          recommendation, or invitation to participate in any revenue pool, to lock SQD tokens, or
          to engage in any transaction involving digital assets. Any use of the Interface is
          undertaken solely at the user's own initiative and risk.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          4. Beta Phase and Experimental Nature
        </Typography>
        <Typography variant="body2" paragraph>
          The Interface and the revenue pool framework are provided on an experimental basis and
          remain in a limited beta phase. Functionality may be incomplete, inaccurate, unstable, or
          subject to change. Access to the Interface, as well as any features, data, or information
          made available through it, may be modified, restricted, suspended, or discontinued at any
          time without notice.
        </Typography>
        <Typography variant="body2" paragraph>
          No representation or warranty, whether express or implied, is made that the Interface will
          be available at any particular time or location, will operate without interruption or
          delay, or will be free from errors, defects, malware, or other harmful components. No
          representation or warranty is made that access to the Interface will be secure or that
          unauthorized access, data loss, or data corruption will not occur. Any data, information,
          content, or output displayed, made available, or generated through the Interface may be
          incomplete, inaccurate, outdated, or subject to change without notice, and should not be
          relied upon as complete, accurate, or current.
        </Typography>
        <Typography variant="body2" paragraph>
          The Interface, the revenue pool framework, and any related functionality may be subject to
          material changes, redeployments, resets, or discontinuation during or after the beta
          phase, including changes that may affect previously displayed data or user interactions.
        </Typography>
        <Typography variant="body2" paragraph>
          Any statistics, metrics, projections, estimates, charts, or other analytical information
          displayed through the Interface are provided for informational purposes only and may be
          approximate, incomplete, delayed, or inaccurate. Subsquid makes no representation or
          warranty as to the accuracy, completeness, or reliability of any such information.
        </Typography>
        <Typography variant="body2" paragraph>
          Subsquid reserves the right, at any time and without liability, to modify, suspend,
          disable, or discontinue any feature, functionality, or component of the Interface, whether
          temporarily or permanently.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          5. Revenue Pools and No Rights or Entitlements
        </Typography>
        <Typography variant="body2" paragraph>
          The revenue pools constitute an optional participation mechanism operated by independent
          portal operators. Participation in revenue pools does not constitute a partnership, joint
          venture, agency relationship, fiduciary relationship, or any other form of legal
          association between SQD holders, portal operators, Subsquid, or any affiliated entity.
        </Typography>
        <Typography variant="body2" paragraph>
          Participation in pools, the receipt of any pool-related distributions, and any automated
          or supply management mechanisms do not constitute any right, claim, or entitlement by SQD
          holders against Subsquid or any affiliated entity, nor do they create any obligation,
          liability, or commitment on their part.
        </Typography>
        <Typography variant="body2" paragraph>
          Each portal operator may, at its sole discretion, distribute revenues or other amounts to
          SQD pool participants. Portal operators are under no obligation to distribute any
          revenues, amounts, or benefits, and no minimum or expected level of distribution is
          guaranteed.
        </Typography>
        <Typography variant="body2" paragraph>
          If no revenues are distributed, or if a SQD holder is dissatisfied with the amount,
          timing, or frequency of any distribution, the SQD holder may, subject solely to the logic
          and conditions of the relevant smart contract, initiate an unlock of the locked SQD
          tokens. Upon unlocking, the portal operator will no longer be able to benefit from such
          SQD tokens in connection with the provision or sale of data services to data consumers.
          Subsquid does not monitor, enforce, verify, or guarantee the behaviour, performance, or
          commercial practices of any portal operator.
        </Typography>
        <Typography variant="body2" paragraph>
          In addition, the Interface may provide optional, non-binding functionality allowing users
          to submit ratings, feedback, or similar signals regarding portal operators based on their
          individual experience. Any such ratings or feedback are informational only, may be
          incomplete or subjective, and are not verified, endorsed, or monitored by Subsquid.
          Subsquid assumes no responsibility for the accuracy, fairness, or consequences of any such
          ratings or feedback, which may affect the willingness of other SQD holders to participate
          in a given portal.
        </Typography>
        <Typography variant="body2" paragraph>
          Any reference to distributions, incentives, revenue sharing, or supply management is
          purely descriptive, non-binding, and subject to change, suspension, or termination at any
          time. Such references do not constitute a promise, offer, or assurance of performance,
          yield, income, or economic benefit.
        </Typography>
        <Typography variant="body2" paragraph>
          Portal operators, data consumers, distributed-ledger networks, wallet providers, and any
          third-party services referenced through the Interface are independent third parties.
          Subsquid does not endorse, control, verify, or assume responsibility for any third-party
          services, content, data, conduct, or commercial practices. Any interaction with third
          parties occurs solely at the user's own risk.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          6. Smart Contracts, Asset Control, and Irreversibility
        </Typography>
        <Typography variant="body2" paragraph>
          All smart contracts referenced, displayed, or accessible through the Interface are
          autonomous, self-executing software deployed on public distributed-ledger networks. Once
          deployed, such smart contracts operate independently of the Interface and independently of
          Subsquid. Subsquid does not own, operate, control, administer, pause, modify, or intervene
          in the execution of any smart contract or distributed-ledger transaction.
        </Typography>
        <Typography variant="body2" paragraph>
          Subsquid does not have access to, custody of, or control over any digital assets,
          including SQD tokens, deposited into or locked within any smart contract. Only the
          individual who initiated the relevant transaction and controls the corresponding private
          keys of the associated wallet has the ability to interact with such smart contracts,
          including initiating any lock-up or unlock action, subject solely to the logic of the
          smart contract itself.
        </Typography>
        <Typography variant="body2" paragraph>
          If a user loses access to, misplaces, or compromises the private keys or recovery
          credentials associated with a wallet that has deposited SQD tokens into a smart contract,
          the digital assets associated with that wallet may be permanently inaccessible. In such
          circumstances, the affected SQD tokens cannot be recovered, restored, unlocked, or
          otherwise accessed by Subsquid or by any third party. Subsquid has no technical means,
          authority, or ability to reverse transactions, recover private keys, restore access, or
          otherwise assist in regaining control over such digital assets.
        </Typography>
        <Typography variant="body2" paragraph>
          You are solely responsible for maintaining the confidentiality, security, and control of
          any wallets, private keys, recovery phrases, passwords, or credentials used in connection
          with the Interface. Subsquid assumes no responsibility for any unauthorized access, loss,
          or compromise resulting from user actions or omissions.
        </Typography>
        <Typography variant="body2" paragraph>
          By using the Interface, you expressly acknowledge and accept the irreversible nature of
          distributed-ledger transactions and assume full responsibility for safeguarding your
          private keys, wallets, and access credentials.
        </Typography>
        <Typography variant="body2" paragraph>
          Users acknowledge that interactions with smart contracts may be irreversible, may result
          in permanent loss of digital assets, and may be affected by bugs, design limitations,
          upgrades, forks, or changes in the underlying distributed-ledger networks.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          7. No Advice
        </Typography>
        <Typography variant="body2" paragraph>
          Nothing made available through the Interface or under these Terms of Use constitutes, or
          shall be construed as, investment advice, financial advice, legal advice, tax advice, or
          any other form of professional advice. Subsquid does not provide personalized
          recommendations or advice of any kind. All information, content, data, materials, and
          outputs made available through the Interface are provided solely for general informational
          purposes and may not be complete, accurate, or up to date.
        </Typography>
        <Typography variant="body2" paragraph>
          Nothing in the Interface or these Terms of Use shall be construed as an inducement,
          encouragement, or endorsement of any particular economic behaviour, token usage, or
          participation in any pool.
        </Typography>
        <Typography variant="body2" paragraph>
          Users remain solely responsible for evaluating the merits and risks associated with any
          use of the Interface and for obtaining independent professional advice from qualified
          advisors as appropriate. No information provided by Subsquid, whether through the
          Interface or otherwise, should be relied upon as a basis for making investment, financial,
          economic, legal, tax, or other decisions.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          8. Limitation of Liability
        </Typography>
        <Typography variant="body2" paragraph>
          To the maximum extent permitted by applicable law, neither Subsquid nor any of its
          affiliates, direct or indirect shareholders, directors, officers, employees, agents,
          contractors, service providers, or licensors shall be liable for any direct, indirect,
          incidental, consequential, special, punitive, or exemplary damages, losses, or expenses
          arising out of or in connection with the use of, reliance on, or inability to use the
          Interface, whether arising in contract, tort (including negligence), strict liability, or
          otherwise. This exclusion applies irrespective of whether any of the foregoing parties has
          been advised of the possibility of such damages and includes, without limitation, any loss
          of digital assets, tokens, cryptocurrencies, or other funds, loss of profits, revenue,
          business, or anticipated savings, loss, corruption, or unavailability of data, failed,
          delayed, or incorrectly executed transactions, smart contract errors, vulnerabilities, or
          exploits, protocol failures, hacks, cyberattacks, forks, network congestion or outages,
          validator or miner behaviour, third-party acts or omissions, or any user error or misuse
          of the Interface.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          9. Indemnification
        </Typography>
        <Typography variant="body2" paragraph>
          You agree to indemnify, defend, and hold harmless Subsquid and its affiliates,
          shareholders, directors, officers, employees, agents, contractors, and service providers
          from and against any claims, demands, damages, losses, liabilities, costs, or expenses,
          including reasonable legal fees, arising out of or related to your access to or use of the
          Interface, your violation of these Terms of Use, or your violation of any applicable law
          or regulation.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          10. Taxes
        </Typography>
        <Typography variant="body2" paragraph>
          Each user bears sole and exclusive responsibility for identifying, calculating, reporting,
          and paying any and all taxes, duties, levies, withholdings, assessments, or other
          governmental charges of any kind that may arise in connection with the use of the
          Interface, participation in any revenue pool, the locking or unlocking of SQD tokens, or
          the receipt, holding, transfer, or disposition of any distributions or other amounts.
          Subsquid Labs GmbH does not determine, collect, withhold, report, or remit any taxes on
          behalf of any user and shall have no obligation, liability, or responsibility whatsoever
          in respect of any tax-related matters arising from or connected to the Interface or any
          revenue pool.
        </Typography>
        <Typography variant="body2" paragraph>
          Users are solely responsible for compliance with all applicable tax laws, regulations,
          filing requirements, and payment obligations in their respective jurisdictions, regardless
          of whether any distribution is made, received, or realized in monetary or non-monetary
          form.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          11. Miscellaneous
        </Typography>
        <Typography variant="body2" paragraph>
          Subsquid reserves the right to amend, modify, or replace these Terms of Use, in whole or
          in part, at any time in its sole discretion. Any amended Terms of Use will become
          effective upon being made available through the Interface or otherwise communicated to
          users, unless a later effective date is expressly stated.
        </Typography>
        <Typography variant="body2" paragraph>
          By continuing to access or use the Interface after the effective date of any amendment,
          the user acknowledges and agrees to be bound by the amended Terms of Use. If the user does
          not agree to any amendment, the user must discontinue all access to and use of the
          Interface.
        </Typography>
        <Typography variant="body2" paragraph>
          By accessing or using the Interface, you acknowledge and agree that a legally binding
          contractual relationship is formed between you and Subsquid governed exclusively by these
          Terms of Use.
        </Typography>
        <Typography variant="body2" paragraph>
          No failure or delay by Subsquid in exercising any right or remedy under these Terms of Use
          shall operate as a waiver of such right or remedy.
        </Typography>
        <Typography variant="body2" paragraph>
          All disputes, if any, must be brought against Subsquid in your individual capacity and not
          as a plaintiff in or member of any purported class action, collective action, private
          attorney general action, or other representative proceeding. You and we both agree to
          waive the right to demand a trial by jury.
        </Typography>
        <Typography variant="body2" paragraph>
          If any provision of these Terms of Use is held to be invalid, unlawful, or unenforceable,
          such provision shall be severed and the remaining provisions shall remain in full force
          and effect.
        </Typography>
        <Typography variant="body2" paragraph>
          These Terms of Use, and any contractual or non-contractual obligations arising out of or
          in connection with the use of the Interface, shall be governed by and construed in
          accordance with the substantive laws of Switzerland, excluding its conflict of law rules.
          The exclusive place of jurisdiction for all disputes arising out of or in connection with
          these Terms of Use or the use of the Interface shall be Zug, Switzerland.
        </Typography>
      </Box>
    </Stack>
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
      title="Terms of Use"
      open={open}
      onResult={handleResult}
      confirmButtonText="ACCEPT"
      cancelButtonText="REJECT"
      hideCancelButton={false}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            maxHeight: '40vh',
            overflow: 'auto',
          }}
        >
          <TermsContent />
        </Box>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          By clicking <strong>ACCEPT</strong>, you confirm that you have read and agree to these
          terms.
        </Typography>
      </Stack>
    </ContractCallDialog>
  );
}

interface ProvideButtonProps {
  poolId: string;
}

type DialogState = 'closed' | 'legal' | 'provide';

export function ProvideButton({ poolId }: ProvideButtonProps) {
  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);

  const { isDisabled, disabledReason } = useMemo(() => {
    if (!pool) return { isDisabled: true, disabledReason: '' };

    const isNotWhitelisted = userData?.whitelistEnabled && !userData?.isWhitelisted;
    if (isNotWhitelisted) {
      return { isDisabled: true, disabledReason: PROVIDE_DIALOG_TEXTS.tooltips.notWhitelisted };
    }

    const isPoolFull = pool.tvl.current.gte(pool.tvl.max);
    if (isPoolFull) {
      return { isDisabled: true, disabledReason: PROVIDE_DIALOG_TEXTS.tooltips.poolAtCapacity };
    }

    return { isDisabled: false, disabledReason: '' };
  }, [pool, userData]);

  const handleButtonClick = useCallback(() => {
    if (hasAcceptedTerms()) {
      setDialogState('provide');
    } else {
      setDialogState('legal');
    }
  }, []);

  const handleAcceptTerms = useCallback(() => {
    setTermsAccepted();
    setDialogState('provide');
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogState('closed');
  }, []);

  return (
    <>
      <Tooltip title={disabledReason}>
        <span>
          <Button
            variant="contained"
            color="info"
            fullWidth
            onClick={handleButtonClick}
            loading={dialogState !== 'closed'}
            disabled={isDisabled}
          >
            LOCK-UP TOKENS
          </Button>
        </span>
      </Tooltip>

      <LegalDialog
        open={dialogState === 'legal'}
        onAccept={handleAcceptTerms}
        onReject={handleCloseDialog}
      />
      <ProvideDialog
        open={dialogState === 'provide'}
        onClose={handleCloseDialog}
        poolId={poolId}
      />
    </>
  );
}
