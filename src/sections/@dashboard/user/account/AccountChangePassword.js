import axios from 'axios';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    last_password: Yup.string().required('Senha é obrigatória'),
    new_password: Yup.string()
      .min(6, 'A nova senha deve conter no mínimo 6 caracteres')
      .required('A nova senha é obrigatória'),
    confirmed_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'As senhas devem coincidirem'),
  });

  const defaultValues = {
    last_password: '',
    new_password: '',
    confirmed_password: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const { last_password, new_password } = data;
    try {
      const response = await axios.patch('/v1/profile-password', {
        last_password,
        new_password,
      });

      if (response.status === 200) {
        reset();
        enqueueSnackbar('Senha atualizada com sucesso!');
      } else if (response.status === 406) {
        enqueueSnackbar('Senha a ser trocada está incorreta!', { variant: 'error' });
      } else {
        enqueueSnackbar(response.data.message, { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="last_password" type="password" label="Senha" />

          <RHFTextField name="new_password" type="password" label="Nova senha" />

          <RHFTextField name="confirmed_password" type="password" label="Confirme a nova senha" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Savar
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
