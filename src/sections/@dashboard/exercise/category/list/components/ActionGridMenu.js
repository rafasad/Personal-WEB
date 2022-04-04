import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// components
import Iconify from '../../../../../../components/Iconify';
import MenuPopover from '../../../../../../components/MenuPopover';

// ----------------------------------------------------------------------
ActionGridMenu.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
      color: PropTypes.string,
      sx: PropTypes.object,
      icon: PropTypes.string,
      hidden: PropTypes.bool,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

export default function ActionGridMenu({ items, id }) {
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
        {items.map(({ onClick, label, to, color, sx, icon, hidden, disabled }, index) => (hidden || hidden === undefined) && (
          <MenuItem
            key={`menu_action_${id}_${index}`}
            {...(to && { component: RouterLink, to })}
            {...(onClick && {
              onClick: () => {
                onClick();
                setOpen(null);
              },
            })}
            sx={{
              ...sx,
              ...(color && {
                color,
              }),
            }}
            disabled={disabled}
          >
            {icon && <Iconify icon={icon} sx={{ ...ICON }} />}
            {label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
