import { Navigate, Route, Routes } from 'react-router-dom';

import { NetworkLayout } from '@layouts/NetworkLayout';
import { AssetsPage } from '@pages/AssetsPage/AssetsPage.tsx';
import { MyVestings } from '@pages/AssetsPage/Vestings.tsx';
import { MyTemporaryHoldings } from '@pages/AssetsPage/TemporaryHoldings.tsx';
import { Vesting } from '@pages/AssetsPage/Vesting.tsx';
import { BuyBacksPage } from '@pages/BuyBackPage/BuyBackPage.tsx';
import { DashboardPage } from '@pages/DashboardPage/DashboardPage.tsx';
import { Workers } from '@pages/DashboardPage/Workers.tsx';
import { Analytics } from '@pages/DashboardPage/Analytics.tsx';
import { MockPortals } from '@pages/DashboardPage/MockPortals.tsx';
import { DelegationsPage } from '@pages/DelegationsPage/DelegationsPage.tsx';
import { Worker } from '@pages/WorkerPage/Worker.tsx';
import { WorkersPage } from '@pages/WorkersPage/WorkersPage.tsx';
import { PortalsPage } from '@pages/PortalsPage/PortalsPage.tsx';
import { Portal } from '@pages/PortalPage/Portal.tsx';

import { hideLoader } from './index.tsx';
import { WorkerGeneral } from '@pages/WorkerPage/General.tsx';
import { WorkerAnalytics } from '@pages/WorkerPage/Analytics.tsx';
import { PortalGeneral } from '@pages/PortalPage/PortalGeneral.tsx';
import { PoolPage } from '@pages/PoolsPage/PoolPage.tsx';

export const AppRoutes = () => {
  hideLoader(0);

  return (
    <Routes>
      <Route element={<NetworkLayout />} path="/">
        <Route element={<Navigate to="/dashboard" replace={true} />} index />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="workers" replace={true} />} />
          <Route path="workers" element={<Workers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="portals" element={<MockPortals />} />
        </Route>

        <Route path="/assets" element={<AssetsPage />}>
          <Route index element={<Navigate to="vestings" replace={true} />} />
          <Route path="vestings" element={<MyVestings />} />
          <Route path="temporary-holdings" element={<MyTemporaryHoldings />} />
        </Route>

        <Route path="vesting/:address">
          <Route element={<Vesting backPath="/assets" />} index />
        </Route>

        <Route path="/workers">
          <Route element={<WorkersPage />} index />
          {/* <Route element={<AddNewWorker />} path="add" /> */}
        </Route>

        <Route path="worker/:peerId" element={<Worker backPath="/dashboard" />}>
          <Route index element={<Navigate to="general" replace={true} />} />
          <Route element={<WorkerGeneral />} path="general" />
          <Route element={<WorkerAnalytics />} path="analytics" />
        </Route>
        <Route path="/delegations">
          <Route element={<DelegationsPage />} index />
        </Route>
        <Route path="/pools">
          <Route index element={<Navigate to="portal-pool" replace={true} />} />
          <Route path=":poolId" element={<PoolPage />} />
        </Route>
        <Route path="/portals">
          <Route element={<PortalsPage />} index />
        </Route>
        <Route path="portal/:address" element={<Portal backPath="/portals" />}>
          <Route index element={<PortalGeneral />} />
        </Route>
        <Route path="/gateways" element={<Navigate to="/portals" replace={true} />} />
        <Route path="/buyback">
          <Route element={<BuyBacksPage />} index />
        </Route>
        <Route element={<Navigate to="/dashboard" replace={true} />} path="*" />
      </Route>
    </Routes>
  );
};
