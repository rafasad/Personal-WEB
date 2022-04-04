import { useEffect, useState } from 'react';
import { capitalCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Box, CircularProgress, Collapse, Container } from '@mui/material';
// routes
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// sections
import UserForm from '../../sections/@dashboard/user/UserForm';

//
import { DEFAULT_ERROR } from '../../utils/defaultTexts';

// ----------------------------------------------------------------------

export default function UserFormPage() {

  const { enqueueSnackbar } = useSnackbar();
  
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  
  const [currentUser, setCurrentUser] = useState(null);

  const isEdit = pathname.includes('edit');

  const [isLoading, setIsLoading] = useState(isEdit);

  const handleGoBack = () => {
    enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
    navigate(-1);
  };


  useEffect(() => {

    let isMounted = true;
    if (id) {
      if (isMounted) setIsLoading(true);
      axios
        .get(`/v1/users/${id}`)
        .then(({ status, data }) => {
          if (status === 200) {
            if (isMounted) setCurrentUser(data);
          } else {
            handleGoBack();
          }
        })
        .catch(() => handleGoBack())
        .finally(() => {if (isMounted) setIsLoading(false);});
    }

    return () => {
      setCurrentUser(null);
      isMounted = false;
    };

  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  

  const full_name = currentUser?.full_name ? capitalCase(currentUser?.full_name) : 'Carregando...';

  return (
    <Page title={!isEdit ? 'Criar usuário' : `Editando ${full_name}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Criar usuário' : 'Editar Usuário'}
          links={[
            { name: 'Painel', href: PATH_DASHBOARD.root },
            { name: 'Lista de usuários', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'Criar usuário' : full_name  },
          ]}
        />
        <Collapse in={isLoading}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            my: 6,
          }}>
            <CircularProgress size={60} />
          </Box>
        </Collapse>
        <Collapse in={!isLoading}>
          <UserForm isEdit={isEdit} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Collapse>
      </Container>
    </Page>
  );
}
