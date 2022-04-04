import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Typography } from '@mui/material';
// utils
import axios from 'axios';
// components
import { FormProvider, RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { DEFAULT_ERROR, DEFAULT_ERROR_400 } from '../../../utils/defaultTexts';

// ----------------------------------------------------------------------

CategoryForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  setCurrentCategory: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  addCategory: PropTypes.func.isRequired,
  editCategory: PropTypes.func.isRequired,
};

const NewCategorySchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string(),
  is_global: Yup.bool(),
});

export default function CategoryForm({ isEdit, currentCategory, setCurrentCategory, onClose, addCategory, editCategory }) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
      description: currentCategory?.description || '',
      is_global: currentCategory?.is_global || false,
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  useEffect(() => {
    if (isEdit && currentCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCategory]);

  const onSubmit = async (data) => {
    const dataCategory = {
      name: data.name,
      description: data.description,
      is_global: data.is_global,
    };

    try {
      const response = isEdit
        ? await axios.patch(`/v1/categories/${currentCategory.id}`, dataCategory)
        : await axios.post('/v1/categories', dataCategory);

      if (response.status === 400 && response.data?.fields) {
        const fields = response.data?.fields;
        Object.keys(response.data?.fields).forEach((_field) =>
          setError(_field, { type: 'server', message: fields[_field] })
        );
        enqueueSnackbar(DEFAULT_ERROR_400, { variant: 'warning' });
        return;
      }

      if (response.status === 201 && response.data) {
        reset();
        enqueueSnackbar(`A categoria ${response.data.name} foi criada com sucesso!`, { variant: 'success' });
        setCurrentCategory(response.data);
        addCategory(response.data);
        return;
      }

      if (response.status === 200 && response.data) {
        reset();
        enqueueSnackbar(`A categoria ${response.data.name} foi atualizada com sucesso!`, { variant: 'success' });
        setCurrentCategory(response.data);
        editCategory(response.data);
        return;
      }

      enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
    } catch (error) {
      enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
      console.error('Erro no request onSubmit ~ ', error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{
        border: (theme) => `solid 1px ${theme.palette.divider}`,
        borderRadius: 2,
        p: 1.5,
        mx: 2,
        mb: 2,
      }}>
        <Typography variant='h5' sx={{mb: 1, pl: 1}} color="grey.700">
          { (isEdit && 'Editar') || 'Criar'}
        </Typography>
        <Box sx={{display:"flex"}}>
          <Box sx={{flexGrow:1}}>
            <RHFTextField name="name" label="Nome" />
          </Box>
          <Box sx={{pl:2, mb: (errors.name && 3.25) || 0, alignSelf: "center" }}>
            <RHFSwitch name="is_global" label="Global" />
          </Box>
        </Box>
        <Box sx={{display: {xs: "block", sm: "flex"}, pt: 2}}>
          <Box flexGrow={1}>
            <RHFTextField name="description" multiline minRows={1} maxRows={4} label="Descrição" />
          </Box>
          <Box sx={{pl:2, pt: {xs: 2, sm: 0}, alignSelf:"center"}}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button color="inherit" variant="contained" onClick={onClose}>
                Fechar
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Criar' : 'Alterar'}
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
