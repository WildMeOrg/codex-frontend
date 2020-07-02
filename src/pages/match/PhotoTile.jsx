import React from 'react';
import { FormattedMessage } from 'react-intl';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import Button from '../../components/Button';
import { openFullscreen } from '../../utils/fullscreen';

export default function Sighting({
  title,
  onPrev,
  onNext,
  imgSrc,
  imgId,
  filename,
  fileSubtitle,
  ...rest
}) {
  return (
    <GridListTile {...rest}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <Button size="small" onClick={onPrev}>
          <FormattedMessage id="PREVIOUS_SMALL_BUTTON" />
        </Button>
        <Typography variant="h6">{title}</Typography>
        <Button size="small" onClick={onNext}>
          <FormattedMessage id="NEXT_SMALL_BUTTON" />
        </Button>
      </div>
      <div style={{ position: 'relative' }}>
        <img
          id={imgId}
          src={imgSrc}
          alt={title}
          style={{ width: '100%', height: 'auto' }}
        />
        <GridListTileBar
          title={filename}
          subtitle={fileSubtitle}
          titlePosition="top"
          actionIcon={
            <IconButton
              onClick={() => {
                const image = document.getElementById(imgId);
                openFullscreen(image);
              }}
              style={{ color: 'white', marginRight: 0 }}
            >
              <FullscreenIcon style={{ fontSize: 28 }} />
            </IconButton>
          }
        />
      </div>
    </GridListTile>
  );
}
