import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Não encontrado
      </Typography>
      <Typography variant="body2" align="center">
        Nenhum resultado encontrado para &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Tente verificar se há erros de digitação ou usar utlizar outras palavras.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2"> Por favor, entre com a palavra a ser pesquisada. </Typography>
  );
}
