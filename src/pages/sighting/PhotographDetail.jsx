import React, { useEffect, useState, useRef } from 'react';
import { get } from 'lodash-es';

import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import MoreIcon from '@material-ui/icons/MoreVert';

import StandardDialog from '../../components/StandardDialog';
import Text from '../../components/Text';
import MorePhotoMenu from './MorePhotoMenu';

export default function PhotographDetail({ asset, open, onPrevious, onNext, onClose }) {
  // const openRef = useRef(open);
  // openRef.current = open;
  
  // useEffect(() => {
  //   function keyUpHandler({ key }) {
  //     console.log(key, open, openRef.current);
  //     if (!openRef.current) return null;
  //     if (key === 'ArrowLeft') {
  //       console.log('calling', onPrevious);
  //       onPrevious();
  //     }
  //     if (key === 'ArrowRight') onNext();
  //     return null;
  //   }

  //   window.addEventListener('keyup', keyUpHandler);
  //   return () => {
  //     window.removeEventListener('keyup', keyUpHandler);
  //   };
  // }, []);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StandardDialog fullScreen open={open} onClose={onClose}>
      <MorePhotoMenu
        id="detail-image-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      />
      <div
        style={{
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
            src={get(asset, 'src')}
            alt={get(asset, 'filename')}
          />
          <IconButton
            style={{
              position: 'absolute',
              top: '50%',
              left: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
            onClick={onPrevious}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            style={{
              position: 'absolute',
              top: '50%',
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
            onClick={onNext}
          >
            <ChevronRight />
          </IconButton>
          <IconButton
            onClick={handleClick}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            <MoreIcon />
          </IconButton>
        </div>
        <Text>{get(asset, 'filename')}</Text>
      </div>
    </StandardDialog>
  );
}
