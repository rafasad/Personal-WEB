import PropTypes from 'prop-types';
import { Box, Typography, Button, Avatar } from '@mui/material';
import ModalBase from './ModalBase';
import Iconify from '../Iconify';

DialogDelete.defaultProps = {
  maxWidth: 'xs',
  onClose: () => {},
  onDelete: () => {},
  title: 'Confirma deleção',
  subtitle: 'Você tem certeza que deseja deletar?',
  icon: 'eva:trash-2-outline',
  buttonConfirmLabel: 'Deletar',
};

DialogDelete.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  maxWidth: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  buttonConfirmLabel: PropTypes.string,
};

export default function DialogDelete({ open, onClose, onDelete, maxWidth, title, subtitle, icon, buttonConfirmLabel }) {
  return (
    <ModalBase
      containerSX={{
        borderTop: ({ palette }) => `6px ${palette.error.main} solid`,
      }}
      circularProgressSX={{ color: 'error' }}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
    >
      <Avatar
        sx={{
          bgcolor: ({ palette }) => palette.error.main,
          width: 60,
          height: 60,
          marginTop: '-50px',
          mb: 2,
          mx: 'auto',
        }}
      >
        <Iconify icon={icon} sx={{ color: 'common.white', fontSize: 45 }} />
      </Avatar>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" component="div" color="text.secondary" gutterBottom>
        {subtitle}
      </Typography>
      <Box textAlign="end" mt={2}>
        <Button
          onClick={() => onClose()}
          sx={{
            '&:hover': { bgcolor: ({ palette }) => palette.grey[300] },
          }}
          variant="contained"
          color="inherit"
        >
          Fechar
        </Button>
        <Button onClick={() => onDelete()} sx={{ ml: 2 }} variant="contained" color="error">
          {buttonConfirmLabel}
        </Button>
      </Box>
    </ModalBase>
  );
}
