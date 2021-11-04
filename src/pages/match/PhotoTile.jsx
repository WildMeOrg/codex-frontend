import React from 'react';
import { FormattedMessage } from 'react-intl';

import IconButton from '@material-ui/core/IconButton';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { useTheme } from '@material-ui/core/styles';

import Button from '../../components/Button';
import Text from '../../components/Text';
import { openFullscreen } from '../../utils/fullscreen';

export default function PhotoTile({
  title,
  onPrev,
  onNext,
  imgSrc,
  imgId,
  filename,
  fileSubtitle,
  hideButtons,
  ...rest
}) {
  const theme = useTheme();
  return (
    <GridListTile {...rest}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: hideButtons ? 'center' : 'space-between',
          marginBottom: 4,
        }}
      >
        {!hideButtons && (
          <Button size="small" onClick={onPrev}>
            <FormattedMessage id="PREVIOUS_SMALL_BUTTON" />
          </Button>
        )}
        <Text variant="h6">{title}</Text>
        {!hideButtons && (
          <Button size="small" onClick={onNext}>
            <FormattedMessage id="NEXT_SMALL_BUTTON" />
          </Button>
        )}
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
              style={{
                color: theme.palette.common.white,
                marginRight: 0,
              }}
            >
              <FullscreenIcon style={{ fontSize: 28 }} />
            </IconButton>
          }
        />
      </div>
    </GridListTile>
  );
}
