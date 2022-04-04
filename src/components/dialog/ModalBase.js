import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Slide, Container } from '@mui/material';
import ModalBasic from './components/ModalBasic';
import Backdrop from '../Backdrop';

ModalBase.defaultProps = {
  maxWidth: 'xs',
  onClose: () => {},
  containerSX: {},
};

ModalBase.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  containerSX: PropTypes.objectOf(PropTypes.any),
  maxWidth: PropTypes.string,
};

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ModalBase({ open, onClose, maxWidth, containerSX, children }) {
  return (
    <ModalBasic open={open} onClose={onClose} BackdropComponent={Backdrop}>
      <Transition in={open} mountOnEnter unmountOnExit>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            bgcolor: 'background.paper',
            boxShadow: 6,
            borderRadius: 4,
            p: 2,
            m: 3,
            outline: 'none',
            backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(204,0,0,0) 14px, transparent 15px)',
            ...containerSX,
          }}
          maxWidth={maxWidth}
        >
          {children}
        </Container>
      </Transition>
    </ModalBasic>
  );
}
