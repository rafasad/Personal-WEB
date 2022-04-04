import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutoComplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default function RHFAutoComplete({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error }}) => (
        <Autocomplete
          {...field}
          onChange={(event, item) => {
            field.onChange(item);
          }}
          multiple
          renderInput={params => (
            <TextField
              label={label}
              {...params}
              error={!!error}
              helperText={error?.message}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
