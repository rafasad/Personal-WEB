import React from 'react';
import { CircularProgress } from '@mui/material';
import { useWebsitePage } from '../contexts/WebsitePageContext';
import Backdrop from './Backdrop';
import ModalBasic from './dialog/components/ModalBasic';

export default function Loading() {
  const { isModalLoading } = useWebsitePage();

  return (
    <ModalBasic
      open={isModalLoading}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
      BackdropComponent={Backdrop}
    >
      <CircularProgress
        sx={{
          outline: 'none',
        }}
        size={60}
      />
    </ModalBasic>
  );
}
