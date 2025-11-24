import { Report, Warning } from '@mui/icons-material';
import { Box, Stack, styled, Tooltip } from '@mui/material';
import { satisfies } from 'semver';

import { Worker, useNetworkSettings } from '@api/subsquid-network-squid';

export const WorkerVersionName = styled(Box, {
  name: 'WorkerVersionName',
})(() => ({
  display: 'flex',
  whiteSpace: 'nowrap',
}));

export const WorkerVersion = ({ worker }: { worker: Pick<Worker, 'version'> }) => {
  const { minimalWorkerVersion, recommendedWorkerVersion } = useNetworkSettings();

  return (
    <>
      {worker.version ? (
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <WorkerVersionName>{worker.version}</WorkerVersionName>
          <Box display="flex">
            {!satisfies(worker.version, recommendedWorkerVersion, { includePrerelease: true }) ? (
              !satisfies(worker.version, minimalWorkerVersion, { includePrerelease: true }) ? (
                <Tooltip title="Unsupported" placement="top">
                  <Report color="error" />
                </Tooltip>
              ) : (
                <Tooltip title="Outdated" placement="top">
                  <Warning color="warning" />
                </Tooltip>
              )
            ) : null}
          </Box>
        </Stack>
      ) : (
        <Box>-</Box>
      )}
    </>
  );
};
