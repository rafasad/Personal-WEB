import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
// utils
import axios from 'axios';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFAutoComplete, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { ALLOWED_IMAGE, DEFAULT_ERROR, DEFAULT_ERROR_400 } from '../../../utils/defaultTexts';
import { fDate } from '../../../utils/formatTime';
import { MAX_SIZE_UPLOAD } from '../../../utils/defaultNumbers';
import { ROLES_LIST } from '../../../utils/defaultArrays';

// ----------------------------------------------------------------------

UserForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func,
};

export default function UserForm({ isEdit, currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Nome é obrigatório'),
    last_name: Yup.string().required('Sobrenome é obrigatório'),
    email: Yup.string().required('Email é obrigatório').email('Email deve ser um email válido'),
    password: Yup.string()
      .when('isNotEdit', () => {
        if (!isEdit) return Yup.string().required('A senha é obrigatória').min(6, 'Mínimo de 6 caracteres');
        return undefined;
      })
      .test('empty-or-6-characters-check', 'Mínimo de 6 caracteres', (password) => !password || password.length >= 6),
    is_activated: Yup.bool(),
    deleted_at: Yup.date().nullable(),
    bio: Yup.string(),
    roles: Yup.mixed(),
    avatar: Yup.mixed(),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      deleted_at: currentUser?.deleted_at || null,
      bio: currentUser?.bio || '',
      roles: !currentUser?.roles 
        ? [ROLES_LIST[0]] 
        : currentUser?.roles
            .map((_role) => 
              ROLES_LIST.find((_role_list) => _role_list.value === _role)
            ),

      avatarUrl: currentUser?.avatar ? `${process.env.REACT_APP_HOST_API_KEY}/avatar/${currentUser.avatar}` : '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    // control,
    // formState: { errors },
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {

    const dataUser = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      bio: data.bio,
      roles: data.roles.map(({value}) => value),
    };

    try {
      const response = isEdit
        ? await axios.patch(`/v1/users/${currentUser.id}`, dataUser) 
        : await axios.post('/v1/users', dataUser)  ;

      if (response.status === 400 && response.data?.fields) {
        const fields = response.data?.fields;
        Object.keys(response.data?.fields)
        .forEach((_field) => setError(_field, {type: "server", message: fields[_field]}));
        enqueueSnackbar(DEFAULT_ERROR_400, {variant: 'warning'});
        return;
      }

      if (response.status === 201 && response.data) {
        reset();
        enqueueSnackbar(`O usuário ${response.data.full_name} foi criado com sucesso!`, {variant: 'success'});
        navigate(`${PATH_DASHBOARD.user.root}/${response.data.id}/edit`);
        return;
      }

      if (response.status === 200 && response.data) {
        reset();
        enqueueSnackbar(`O usuário ${response.data.full_name} foi atualizado com sucesso!`, {variant: 'success'});
        setCurrentUser(response.data);
        return;
      }
      
      enqueueSnackbar(DEFAULT_ERROR, {variant: 'error'});
    } catch (error) {
      enqueueSnackbar(DEFAULT_ERROR, {variant: 'error'});
      console.error('Erro no request onSubmit ~ ', error);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      enqueueSnackbar('Caregando novo avatar...', {variant: 'info'});

      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);

          const response = await axios.post(`/v1/users/avatar/${currentUser.id}`,formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });

          if (response.status === 201) {
            setValue(
              'avatarUrl', `${process.env.REACT_APP_HOST_API_KEY}/avatar/${response.data.avatar}`
            );
            enqueueSnackbar('Avatar atualizado com successo', { variant: 'success' });
          }

        } catch (error) {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
          console.error('Erro no request handleDrop ~ ', error);
        }
      }
    },
    [setValue, currentUser, enqueueSnackbar]
  );
  const onDeleteAvatar = useCallback(
    async () => {
      enqueueSnackbar('Deletando avatar...', {variant: 'info'});

        try {
          const response = await axios.delete(`/v1/users/avatar/${currentUser.id}`);

          if (response.status === 200) {
            setValue('avatarUrl', '');
            enqueueSnackbar('Avatar deletado com successo', { variant: 'success' });
          }

        } catch (error) {
          enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
          console.error('Erro no request onDeleteAvatar ~ ', error);
        }
    },
    [setValue, currentUser, enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* <pre>{JSON.stringify({values, errors}, null, 2)}</pre> */}
      <Grid container spacing={3}>
        {isEdit && (
        <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Label
                color={currentUser?.deleted_at ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {(currentUser?.deleted_at && `Deletado em ${fDate(currentUser?.deleted_at)}`) || 'Ativo'}
              </Label>

              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar
                  name="avatarUrl"
                  accept="image/*"
                  maxSize={MAX_SIZE_UPLOAD}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Permitido {ALLOWED_IMAGE}
                      <br /> tamanho máximo de {fData(MAX_SIZE_UPLOAD)}
                    </Typography>
                  }
                  onDelete={onDeleteAvatar}
                />
              </Box>
            </Card>
        </Grid>
        )}

        <Grid item xs={12} md={(isEdit && 8) || 12}>
          <Card sx={{ p: 3 }}>

            <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="first_name" label="Nome" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="last_name" label="Sobrenome" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="email" label="Email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="password"
                  label="Password"
                  password
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="bio" multiline minRows={4} maxRows={8} label="Sobre mim" />
              </Grid>
              <Grid item xs={12}>
                <RHFAutoComplete
                  name="roles"
                  label="Permissão"
                  options={ROLES_LIST}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  disableCloseOnSelect
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button color="inherit" variant="contained" component={RouterLink} to={`${PATH_DASHBOARD.user.list}`}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Criar usuário' : 'Salvar'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
