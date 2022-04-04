import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// components
import Iconify from '../../../../../components/Iconify';
import MenuPopover from '../../../../../components/MenuPopover';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onRecover: PropTypes.func.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    deleted_at: PropTypes.string,
  }),
};

export default function UserMoreMenu({ onDelete, onRecover, row }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        {row.deleted_at && (
          <MenuItem
            onClick={() => {
              onRecover();
              setOpen(null);
            }}
            sx={{ color: 'warning.dark' }}
          >
            <Iconify icon={'mdi:account-reactivate'} sx={{ ...ICON }} />
            Reativar
          </MenuItem>
        )}

        <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.user.root}/${row.id}/edit`}>
          <Iconify icon={'mdi:account-edit'} sx={{ ...ICON }} />
          Editar
        </MenuItem>

        {!row.deleted_at && (
          <MenuItem
            onClick={() => {
              onDelete();
              setOpen(null);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon={'mdi:account-cancel'} sx={{ ...ICON }} />
            Desativar
          </MenuItem>
        )}
      </MenuPopover>
    </>
  );
}
