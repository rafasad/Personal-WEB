import PropTypes from 'prop-types';
import {
  Box,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
} from '@mui/material';

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};

ListHead.defaultProps = {
  orderBy: null,
};

ListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

export default function ListHead ({
  order,
  orderBy,
  headLabel,
  onRequestSort
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
    <TableRow>
      {headLabel.map((headCell, index) => (
        <TableCell
          key={`table_header_${index}_${headCell.id ?? ''}`}
          align={headCell.headAlign || 'left'}
          sortDirection={orderBy === headCell.id ? order : false}
        >
          <TableSortLabel
            hideSortIcon
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={createSortHandler(headCell.id)}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'ordenado decrescente' : 'ordenado crescente'}</Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
  );
};