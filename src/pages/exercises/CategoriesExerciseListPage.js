import React, { useEffect, useState } from 'react';
// @mui
import { Card, Button, Container, Collapse } from '@mui/material';
// routes
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ActionGridMenu } from '../../sections/@dashboard/exercise';
import GridMain from '../../components/grid/GridMain';
import DialogDelete from '../../components/dialog/DialogDelete';
import { useWebsitePage } from '../../contexts/WebsitePageContext';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { DEFAULT_ERROR } from '../../utils/defaultTexts';
import ListToolbar from '../../components/ListToolbar';
import CategoryForm from '../../sections/@dashboard/exercise/CategoryForm';

// ----------------------------------------------------------------------

export default function CategoriesExerciseListPage() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { toggleModalLoading } = useWebsitePage();

  const isMountedRef = useIsMountedRef();

  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tryDelete, setTryDelete] = useState(null);
  const [form, setForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    axios
      .get('/v1/categories')
      .then(({ status, data }) => {
        if (status === 200) {
          if (isMountedRef.current) setCategoryList(data);
        } else {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        }
      })
      .catch(() => {
        enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        console.log(' erro ao requisitar dados em `/v1/categories` ');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const searchSettings = {
    fields: ['name'],
    orderByInitial: 'name',
  };

  const columnsSettings = [
    {
      id: 'name',
      label: 'Nome',
    },
    {
      id: 'is_global',
      label: 'Global',
      cellFunction: (value) => value && <Iconify icon="eva:checkmark-circle-fill" sx={{
        width: 20,
        height: 20,
        color: "success.main"
      }}  />,
    },
    {
      id: 'exercises_count',
      label: 'Exercícios vinculados',
    },
    {
      cellAlign: 'right',
      cellFunction: (value, row) => (
        <ActionGridMenu
          id={row.id}
          items={[
            {
              label: 'Alterar',
              icon: 'eva:edit-2-outline',
              onClick: () => {
                setCurrentCategory(row);
                setForm(true);
              }
            },
            {
              label: 'Deletar',
              icon: 'eva:trash-2-outline',
              color: 'error.main',
              disabled: (row.exercises_count > 0),
              onClick: () => {
                setTryDelete(row);
              }
            },
          ]}
        />
      ),
    },
  ];

  const handleDelete = () => {
    const deleteRow = tryDelete;
    toggleModalLoading(true);
    setTryDelete(null);
    axios
      .delete(`/v1/categories/${deleteRow?.id}`)
      .then(({ status, data }) => {
        if (status === 200) {
          handleDeleteCategory(data);
          enqueueSnackbar(`Categoria '${data.name}' foi deletada com sucesso`, { variant: 'success' });
        } else {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
        }
      })
      .catch(() => enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' }))
      .finally(() => toggleModalLoading(false));
  };

  const handleChangeCategory = (data) => {
    if (data && isMountedRef.current)
      setCategoryList((_rows) => _rows.map((_row) => (_row.id === data.id ? data : _row)));
  };
  const handleAddCategory = (newCategory) => {
    if (newCategory && isMountedRef.current)
      setCategoryList((_categories) => _categories.concat([newCategory]));
  };
  const handleDeleteCategory = (category) => {
    if (category && isMountedRef.current)
      setCategoryList((_categories) => _categories.filter(({id}) => id !== category.id));
  };

  const handleCloseForm = () => {
    setForm(false); 
    setTimeout(() => {if (isMountedRef.current) setCurrentCategory(null); }, 400) ;
  };

  return (
    <Page title="Lista de categorias de exercícios">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lista de categorias de exercícios"
          links={[{ name: 'Painel', href: PATH_DASHBOARD.root }, { name: 'Lista de categorias de exercícios' }]}
          action={
            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />} onClick={() => setForm(true)}>
              Criar categoria
            </Button>
          }
        />

        <Card>
          <ListToolbar placeholder="Nome..." filterName={filterName} onFilterName={setFilterName} />
          <Collapse in={form}>
            <CategoryForm 
              isEdit={!!currentCategory} 
              onClose={handleCloseForm}
              setCurrentCategory={setCurrentCategory}
              currentCategory={currentCategory}
              addCategory={handleAddCategory}
              editCategory={handleChangeCategory}
            />
          </Collapse>

          <Scrollbar>
            <GridMain
              data={categoryList}
              isLoading={isLoading}
              filterString={filterName}
              emptyDataMessage="Nenhuma categoria registrada."
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
        title="Confirma deleção"
        subtitle="Você tem certeza que deseja deletar esta categoria?"
        onDelete={handleDelete}
      />
    </Page>
  );
}
