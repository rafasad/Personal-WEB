import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Toolbar, InputAdornment } from '@mui/material';

import Iconify from '../../../../../components/Iconify';
import InputStyle from '../../../../../components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ filterName, onFilterName }) {

  return (
    <RootStyle>
        <InputStyle
          stretchStart={440}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="Nome ou email..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
    </RootStyle>
  );
}
