import { Outlet } from 'react-router-dom';

import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { ConnectedWalletRequired } from '@network/ConnectedWalletRequired';

import { MyAssets } from './Assets';
import { MyVestings } from './Vestings';
import { MyTemporaryHoldings } from './TemporaryHoldings';

export function AssetsPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <MyAssets />
        <MyVestings />
        <MyTemporaryHoldings />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
