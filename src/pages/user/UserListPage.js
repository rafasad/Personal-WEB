import React, { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Card, Avatar, Button, Container, Typography, useTheme } from '@mui/material';
// routes
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';
import GridMain from '../../components/grid/GridMain';
import { fDateTime } from '../../utils/formatTime';
import DialogDelete from '../../components/dialog/DialogDelete';
import { useWebsitePage } from '../../contexts/WebsitePageContext';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { DEFAULT_ERROR } from '../../utils/defaultTexts';

// ----------------------------------------------------------------------

export default function UserListPage() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { toggleModalLoading } = useWebsitePage();

  const isMountedRef = useIsMountedRef();

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tryDelete, setTryDelete] = useState(null);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    axios
      .get('/v1/users')
      .then(({ status, data }) => {
        if (status === 200) {
          if (isMountedRef.current) setUserList(data);
        } else {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        }
      })
      .catch(() => {
        enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        console.log(' erro ao requisitar dados em `/v1/users` ');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const searchSettings = {
    fields: ['full_name', 'email'],
    orderByInitial: 'full_name',
  };

  const columnsSettings = [
    {
      id: 'full_name',
      label: 'Name',
      cellSx: { display: 'flex', alignItems: 'center' },
      cellFunction: (value, { avatar }) => (
        <>
          <Avatar
            alt={value}
            src={avatar ? `${process.env.REACT_APP_HOST_API_KEY}/avatar/${avatar}` : null}
            sx={{ mr: 2 }}
          />
          <Typography variant="subtitle2" noWrap>
            {value}
          </Typography>
        </>
      ),
    },
    { id: 'email', label: 'Email' },
    { id: 'roles', label: 'Roles', cellFunction: (value) => value.map((role) => sentenceCase(role)).join(', ') },
    {
      id: 'deleted_at',
      label: 'Ativo',
      cellFunction: (value) => (
        <>
            <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={(!value && 'success') || 'error'}>
            {(!value && 'Ativo') || fDateTime(value)}
            </Label>
        </>
      ),
    },
    {
      cellAlign: 'right',
      cellFunction: (value, row) => (
        <UserMoreMenu
          row={row}
          onRecover={() => handleRecover(row.id)}
          onDelete={() => setTryDelete(row)}
        />
      ),
    },
  ];

  const handleDelete = () => {
    const deleteRow = tryDelete;
    toggleModalLoading(true);
    setTryDelete(null);
    axios
      .delete(`/v1/users/${deleteRow?.id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          handleChangeUser(data);
          enqueueSnackbar(`Usuário '${data.full_name}' foi deletado com sucesso`, { variant: 'success' });
        } else {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        }
      })
      .catch(() => enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' }))
      .finally(() => toggleModalLoading(false));
  };

  const handleRecover = (id) => {
    toggleModalLoading(true);
    axios
      .get(`/v1/users/recover/${id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          handleChangeUser(data);
          enqueueSnackbar(`Usuário '${data.full_name}' foi restaurado com sucesso`, { variant: 'success' });
        } else {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        }
      })
      .catch(() => enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' }))
      .finally(() => toggleModalLoading(false));
  };

  const handleChangeUser = (data) => {
    if (data && isMountedRef.current) setUserList((_rows) => _rows.map((_row) => (_row.id === data.id ? data : _row)));
  };

  return (
    <Page title="Lista de usuários">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lista de usuários"
          links={[{ name: 'Painel', href: PATH_DASHBOARD.root }, { name: 'Lista de usuários' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.newUser}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Criar usuário
            </Button>
          }
        />

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={setFilterName} />

          <Scrollbar>
            <GridMain
              data={userList}
              isLoading={isLoading}
              filterString={filterName}
              emptyDataMessage="Nenhum usuário registrado."
              settings={{
                columns: columnsSettings,
                search: searchSettings,
              }}
            />
          </Scrollbar>
        </Card>
      </Container>
      <DialogDelete
        open={tryDelete !== null}
        onClose={() => setTryDelete(null)}
        title="Confirma desativação"
        subtitle="Você tem certeza que deseja desativar este usuário?"
        onDelete={handleDelete}
        icon="mdi:account-cancel"
        buttonConfirmLabel="Desativar"
      />
    </Page>
  );
}
