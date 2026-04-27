import { AddNewWorkerDialog } from '@pages/WorkersPage/AddNewWorker';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AccountType } from '@api/subsquid-network-squid';

import { renderWithProviders } from '../render';

vi.mock('@api/contracts', () => ({
  useReadRouterWorkerRegistration: () => ({
    data: '0x0000000000000000000000000000000000000001',
    isLoading: false,
  }),
  useReadWorkerRegistryBondAmount: () => ({
    data: 100_000n * 10n ** 18n,
    isPending: false,
  }),
  workerRegistryAbi: [],
}));

vi.mock('@api/contracts/useWriteTransaction', () => ({
  useWriteSQDTransaction: () => ({
    isPending: false,
    error: null,
    isError: false,
    writeTransactionAsync: vi.fn(),
  }),
}));

function useWorkerByPeerIdMock(peerId?: string) {
  return {
    data: peerId ? { status: 'ACTIVE' } : undefined,
    isLoading: false,
  };
}

vi.mock('@api/subsquid-network-squid/workers-graphql', async importOriginal => ({
  ...(await importOriginal<typeof import('@api/subsquid-network-squid/workers-graphql')>()),
  useWorkerByPeerId: useWorkerByPeerIdMock,
}));

vi.mock('@api/subsquid-network-squid', async importOriginal => ({
  ...(await importOriginal<typeof import('@api/subsquid-network-squid')>()),
  useWorkerByPeerId: useWorkerByPeerIdMock,
}));

vi.mock('@components/ContractCallDialog', () => ({
  ContractCallDialog: ({
    children,
    disableConfirmButton,
  }: {
    children: React.ReactNode;
    disableConfirmButton?: boolean;
  }) => (
    <div>
      {children}
      <button type="button" disabled={disableConfirmButton}>
        CONFIRM
      </button>
    </div>
  ),
}));

vi.mock('@api/subsquid-network-squid/settings-graphql', () => ({
  useNetworkSettings: () => ({ isPending: false }),
}));

vi.mock('@hooks/network/useContracts', () => ({
  useContracts: () => ({
    ROUTER: '0x0000000000000000000000000000000000000002',
    SQD: '0x0000000000000000000000000000000000000003',
  }),
}));

vi.mock('@hooks/useSquidNetworkHeightHooks', () => ({
  useSquidHeight: () => ({ setWaitHeight: vi.fn() }),
}));

describe('AddNewWorkerDialog', () => {
  it('keeps async peer-id uniqueness errors outside Formik validation loops', async () => {
    renderWithProviders(
      <AddNewWorkerDialog
        open
        onResult={vi.fn()}
        sources={[
          {
            id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            type: AccountType.User,
            balance: (1_000_000n * 10n ** 18n).toString(),
          },
        ]}
      />,
    );

    const peerIdInput = document.querySelector<HTMLInputElement>('input#peerId');
    expect(peerIdInput).toBeInTheDocument();

    await userEvent.type(peerIdInput!, 'QmYwAPJzv5CZsnAzt8auVZRn8fMkw3RfX4sqxfz7a3aH6x');
    peerIdInput!.blur();

    await waitFor(() => {
      expect(document.querySelector('#peerId-helper-text')).toHaveTextContent(
        'Peer ID is already registered',
      );
    });
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
  });
});
