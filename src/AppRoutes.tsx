import { Navigate, Route, Routes } from 'react-router-dom';

import { NetworkLayout } from '@layouts/NetworkLayout';
import { AssetsPage } from '@pages/AssetsPage/AssetsPage.tsx';
import { Vesting } from '@pages/AssetsPage/Vesting.tsx';
import { BuyBacksPage } from '@pages/BuyBackPage/BuyBackPage.tsx';
import { DashboardPage } from '@pages/DashboardPage/DashboardPage.tsx';
import { DelegationsPage } from '@pages/DelegationsPage/DelegationsPage.tsx';
import { Gateway } from '@pages/GatewaysPage/Gateway.tsx';
import { GatewaysPage } from '@pages/GatewaysPage/GatewaysPage.tsx';
import { Worker } from '@pages/WorkersPage/Worker.tsx';
import { WorkersPage } from '@pages/WorkersPage/WorkersPage.tsx';
import { Analytics } from '@pages/DashboardPage/Analytics.tsx';

import { hideLoader } from './index.tsx';

export const AppRoutes = () => {
  hideLoader(0);

  return (
    <Routes>
      <Route element={<NetworkLayout />} path="/">
        <Route element={<Navigate to="/dashboard" replace={true} />} index />
        <Route path="/dashboard">
          <Route element={<DashboardPage />} index />
          <Route element={<Analytics />} path="analytics" />
        </Route>

        <Route path="/assets">
          <Route element={<AssetsPage />} index />
        </Route>

        <Route element={<Vesting backPath="/assets" />} path="vesting/:address" />

        <Route path="/workers">
          <Route element={<WorkersPage />} index />
          {/* <Route element={<AddNewWorker />} path="add" /> */}
        </Route>

        <Route path="worker">
          <Route element={<Worker backPath="/dashboard" />} path=":peerId" />
        </Route>
        <Route path="/delegations">
          <Route element={<DelegationsPage />} index />
        </Route>
        <Route path="/portals">
          <Route element={<GatewaysPage />} index />
          <Route element={<Gateway backPath="/portals" />} path=":peerId" />
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
