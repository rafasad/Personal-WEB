
import { styled } from '@mui/material/styles';
import { ModalUnstyled } from '@mui/base';

const ModalBasic = styled(ModalUnstyled)(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.modal,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

export default ModalBasic;
