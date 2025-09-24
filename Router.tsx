
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './features/dashboard/DashboardPage';

const SettingsPage = React.lazy(
  () => import('./features/settings/SettingsPage'),
);
const RefuelHistoryPage = React.lazy(
  () => import('./features/refuelHistory/RefuelHistoryPage'),
);

const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <p className="text-brand-primary">Loading Module...</p>
  </div>
);

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="history"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <RefuelHistoryPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRouter;
