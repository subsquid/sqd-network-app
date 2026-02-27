import { ConfettiBigIcon } from '@icons/ConfettiBigIcon';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, styled, useMediaQuery, useTheme } from '@mui/material';

import { Card } from '@components/Card';

const Line = styled(Box, {
  name: 'Line',
})(({ theme }) => ({
  margin: theme.spacing(2, 0),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginLeft: -2,
    marginRight: 5,
  },
  '& a': {
    [theme.breakpoints.down('xs')]: {
      flex: 1,
      lineHeight: 1.2,
    },
  },
}));

export function MaintenancePage() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Box
      sx={
        mobile
          ? {
              mt: 3,
              px: 1,
            }
          : {
              height: 'calc(100vh - 300px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              p: 4,
            }
      }
    >
      <Box>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ mb: 2.5 }}>
            <ConfettiBigIcon size={40} />
          </Box>
          <Box sx={{ fontWeight: 500, fontSize: '1.5rem' }}>
            Testnet phase 1.0 is over! Great&nbsp;job!
          </Box>
          <Box sx={{ mt: 2 }}>Phase 2.0 starts on 15.01.2024</Box>
        </Box>
        <Card
          sx={{
            mt: mobile ? 4 : 7.5,
            fontSize: mobile ? '0.9rem' : '1rem',
            p: 4,
            minWidth: 300,
            maxWidth: 800,
          }}
        >
          <Box>Meanwhile you can complete the following quests and get rewarded:</Box>
          <Line>
            <ArrowForwardIcon />
            <a
              target="_blank"
              href="https://github.com/subsquid-quests/pooltogether-prize-migration"
              rel="noreferrer"
            >
              Migrate PoolTogether Subgraph
            </a>
            &nbsp;<b>2250 tSQD</b>
          </Line>

          <Line>
            <ArrowForwardIcon />
            <a
              target="_blank"
              href="https://github.com/subsquid-quests/friendtech-subgraph-migration"
              rel="noreferrer"
            >
              Migrate Friendtech Subgraph
            </a>
            &nbsp;<b>750 tSQD</b>
          </Line>
          <Line>
            <ArrowForwardIcon />
            <a
              target="_blank"
              href="https://github.com/subsquid-quests/pepe-migration"
              rel="noreferrer"
            >
              Migrate Pepe Subgraph
            </a>
            &nbsp;<b>750 tSQD</b>
          </Line>
          <Line>
            <ArrowForwardIcon />
            <a
              target="_blank"
              href="https://github.com/subsquid-quests/tornado-cash-migration"
              rel="noreferrer"
            >
              Migrate Tornado Cash Subgraph
            </a>
            &nbsp;<b>750 tSQD</b>
          </Line>
          <Line>
            <ArrowForwardIcon />
            <a
              target="_blank"
              href="https://github.com/subsquid-quests/lens-subgraph-migration"
              rel="noreferrer"
            >
              Migrate Lens Subgraph
            </a>
            &nbsp;<b>2250 tSQD</b>
          </Line>
          <Line sx={{ mb: 0 }}>
            <ArrowForwardIcon />
            <a
              target="_blank"
              href="https://github.com/subsquid-quests/farcaster-subgraph-migration"
              rel="noreferrer"
            >
              Migrate Farcaster Subgraph
            </a>
            &nbsp;<b>1250 tSQD</b>
          </Line>
        </Card>
      </Box>
    </Box>
  );
}
