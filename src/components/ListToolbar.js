import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Toolbar, InputAdornment } from '@mui/material';
import InputStyle from './InputStyle';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------
ListToolbar.defaultProps = {
  placeholder: 'Pesquisar',
};

ListToolbar.propTypes = {
  filterName: PropTypes.string.isRequired,
  onFilterName: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default function ListToolbar({ filterName, placeholder, onFilterName }) {

  return (
    <RootStyle>
        <InputStyle
          stretchStart={440}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder={placeholder}
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
