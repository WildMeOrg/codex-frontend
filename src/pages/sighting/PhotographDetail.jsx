import React, { useState } from 'react';
import { get } from 'lodash-es';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
// import MoreIcon from '@material-ui/icons/MoreVert';

import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import StandardDialog from '../../components/StandardDialog';
import Text from '../../components/Text';
// import Button from '../../components/Button';
import MorePhotoMenu from './MorePhotoMenu';

const useStyles = makeStyles({
  photoIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  },
});

export default function PhotographDetail({
  asset,
  open,
  onPrevious,
  onNext,
  onClose,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const classes = useStyles();

  // const handleClick = event => {
  //   setAnchorEl(event.currentTarget);
  // };

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
        <div
          style={{
            position: 'relative',
            alignSelf: 'start',
            width: '100%',
            maxHeight: '80vh',
          }}
        >
          <AnnotatedPhotograph
            assetMetadata={asset}
            width="100%"
            annotations={get(asset, 'annotations')}
          />
          <IconButton
            className={classes.photoIcon}
            style={{
              position: 'absolute',
              top: '50%',
              left: 8,
              color: theme.palette.common.white,
            }}
            onClick={onPrevious}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            className={classes.photoIcon}
            style={{
              position: 'absolute',
              top: '50%',
              right: 8,
              color: theme.palette.common.white,
            }}
            onClick={onNext}
          >
            <ChevronRight />
          </IconButton>
          {/* <IconButton
            onClick={handleClick}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: theme.palette.common.white,
              backgroundColor: theme.palette.action.active,
            }}
          >
            <MoreIcon />
          </IconButton> */}
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>{get(asset, 'filename')}</Text>
          <Button display="primary" size="small">Add annotation</Button>
        </div> */}
        <Text>{get(asset, 'filename')}</Text>
      </div>
    </StandardDialog>
  );
}
