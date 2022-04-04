import { useState } from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------
RHFTextField.defaultProps = {
  password: false,
  InputProps: {},
  fullWidth: true,
};

RHFTextField.propTypes = {
  name: PropTypes.string,
  password: PropTypes.bool,
	InputProps: PropTypes.object,
  fullWidth: PropTypes.bool,
};

export default function RHFTextField({ name, fullWidth, password, InputProps, ...other }) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  
  const InputPropsPassword = (password) ? {
    endAdornment:
      <InputAdornment position="end">
      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{mr: -0.5}} edge="end">
        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
      </IconButton>
    </InputAdornment>,
} : {};

const InputPropsNew = {...InputPropsPassword, ...InputProps};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField 
          {...field}
          fullWidth={fullWidth}
          error={!!error}
          helperText={error?.message}
          InputProps={InputPropsNew}
          {...(password && {
            type: showPassword ? 'text' : 'password',
          })}
          {...other} 
        />
      )}
    />
  );
}
