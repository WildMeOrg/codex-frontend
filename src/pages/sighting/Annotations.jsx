import React, { useState } from 'react';
import { get, omit } from 'lodash-es';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';

import useDeleteAnnotation from '../../models/annotation/useDeleteAnnotation';
import Text from '../../components/Text';
import MoreAnnotationMenu from './MoreAnnotationMenu';

const useStyles = makeStyles({
  photoIcon: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
  },
});

export default function Annotations({ assets, refreshSightingData }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const [anchorInfo, setAnchorInfo] = useState(null);
  const {
    deleteAnnotation,
    // loading, do something with these... modal? toast?
    // error, confirm delete!
  } = useDeleteAnnotation();

  const annotations = assets.reduce((acc, asset) => {
    const assetAnnotations = get(asset, 'annotations', []);
    const amendedAssetAnnotations = assetAnnotations.map(a => ({
      ...a,
      ...omit(asset, ['annotations', 'guid']),
    }));
    return [...acc, ...amendedAssetAnnotations];
  }, []);

  console.log(annotations);
  console.log(anchorInfo);

  return (
    <div
      style={{
        display: 'grid',
        columnGap: 12,
        rowGap: 12,
        gridTemplateColumns: isSm ? '1fr' : '1fr 1fr 1fr',
        gridTemplateRows: 'auto',
        gridAutoRows: 'auto',
        margin: '0 20px',
      }}
    >
      <MoreAnnotationMenu
        id="image-actions-menu"
        anchorEl={get(anchorInfo, 'element')}
        open={Boolean(get(anchorInfo, 'element'))}
        onClose={() => setAnchorInfo(null)}
        onClickEditAnnotation={() => {}}
        onClickDelete={async () => {
          const deleteSuccessful = await deleteAnnotation(
            get(anchorInfo, ['annotation', 'guid']),
          );
          if (deleteSuccessful) {
            setAnchorInfo(null);
            refreshSightingData();
          }
        }}
      />
      {annotations.map(annotation => (
        <div key={annotation.guid} style={{ position: 'relative' }}>
          <input
            type="image"
            style={{
              display: 'block',
              width: '100%',
            }}
            onClick={() => {}}
            alt={annotation.filename}
            src={annotation.src}
          />
          <IconButton
            onClick={e =>
              setAnchorInfo({ element: e.currentTarget, annotation })
            }
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              color: theme.palette.common.white,
            }}
            className={classes.photoIcon}
          >
            <MoreIcon />
          </IconButton>
          <Text variant="caption">{annotation.filename}</Text>
        </div>
      ))}
    </div>
  );
}
