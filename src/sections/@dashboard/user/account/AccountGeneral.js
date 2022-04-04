import * as Yup from 'yup';
import axios from 'axios';

import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { DEFAULT_ERROR } from '../../../../utils/defaultTexts';
import { MAX_SIZE_UPLOAD } from '../../../../utils/defaultNumbers';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, updateUser } = useAuth(``);

  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
  });

  const defaultValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    avatarUrl:  user?.avatar?.name ? `${process.env.REACT_APP_HOST_API_KEY}/avatar/${user.avatar.name}` : '',
    bio: user?.bio || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const { first_name, last_name, bio } = data;

    try {
      const response = await axios.patch('/v1/profile', {
        first_name,
        last_name,
        bio,
      });

      if (response.status === 200) {
        await updateUser(response.data);
        enqueueSnackbar('Perfil atualizado!');
      } else {
        enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);

          const response = await axios({
            url: '/v1/users/profile-image',
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: formData,
          });

          if (response.status === 201) {
            setValue(
              'avatarUrl',
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            );

            updateUser({
              ...user,
              avatar: {
                name: response.data.avatar.name,
              },
            });

            enqueueSnackbar('Avatar atualizado!');
          } else {
            enqueueSnackbar(DEFAULT_ERROR, { variant: 'error' });
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
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
                  Permitido *.jpeg, *.jpg, *.png, *.gif
                  <br /> Tamanho máximo de {fData(MAX_SIZE_UPLOAD)}
                </Typography>
              }
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="first_name" label="Nome" />
              <RHFTextField name="last_name" label="Sobrenome" />
              {/* <RHFTextField name="email" label="Email Address" disabled /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="bio" multiline rows={4} label="Sobre mim" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Salvar mudanças
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
