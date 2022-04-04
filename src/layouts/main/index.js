import { useLocation, Outlet } from 'react-router-dom';
// @mui
import { Box, Container, Typography, Stack } from '@mui/material';
// components//
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader />

      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      {!isHome ? (
        <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default',
          }}
        >
          <Container>
            <Typography variant="caption" component="p">
              © All rights reserved
            </Typography>
          </Container>
        </Box>
      )}
    </Stack>
  );
}
