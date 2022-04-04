import React from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function ExerciseListPage() {
  const { themeStretch } = useSettings();
  return (
    <Page title="Lista de exercícios">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lista de exercícios"
          links={[{ name: 'Painel', href: PATH_DASHBOARD.root }, { name: 'Lista de exercícios' }]}
          // action={
          //   <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />} onClick={() => setForm(true)}>
          //     Criar exer
          //   </Button>
          // }
        />

          Em construção....
      </Container>
    </Page>
  );
}
