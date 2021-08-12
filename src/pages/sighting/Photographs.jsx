import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import AnnotationCreator from '../../components/AnnotationCreator';
import Text from '../../components/Text';
import PhotographDetail from './PhotographDetail';
import MorePhotoMenu from './MorePhotoMenu';

const useStyles = makeStyles({
  photoIcon: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
  },
});

export default function Photographs({ assets, refreshSightingData }) {
  const theme = useTheme();
  const intl = useIntl();
  const isSm = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const [anchorInfo, setAnchorInfo] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [detailAssetIndex, setDetailAssetIndex] = useState(null);
  const [newAnnotationAsset, setNewAnnotationAsset] = useState(null);

  const effectRef = useRef(false);
  effectRef.current = {
    dialogOpen: detailAssetIndex !== null,
    assets,
    detailAssetIndex,
  };

  useEffect(() => {
    function keyUpHandler({ key }) {
      const openCurrent = get(effectRef, ['current', 'dialogOpen']);
      const assetsCurrent = get(effectRef, ['current', 'assets']);
      const indexCurrent = get(effectRef, [
        'current',
        'detailAssetIndex',
      ]);
      if (!openCurrent) return null;
      if (key === 'ArrowRight') {
        if (indexCurrent === assetsCurrent.length - 1) {
          setDetailAssetIndex(0);
        } else {
          setDetailAssetIndex(indexCurrent + 1);
        }
      }
      if (key === 'ArrowLeft') {
        if (indexCurrent === 0) {
          setDetailAssetIndex(assetsCurrent.length - 1);
        } else {
          setDetailAssetIndex(indexCurrent - 1);
        }
      }
      return null;
    }

    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);
  return (
    <div style={{ margin: '0 20px' }}>
      {assets.length === 0 ? (
        <Text id="NO_PHOTOGRAPHS_MESSAGE" />
      ) : (
        <FormControlLabel
          style={{ marginBottom: 8 }}
          control={
            <Switch
              color="primary"
              checked={showAnnotations}
              onChange={e => setShowAnnotations(e.target.checked)}
            />
          }
          label={intl.formatMessage({ id: 'SHOW_ANNOTATIONS' })}
        />
      )}
      <div
        style={{
          display: 'grid',
          columnGap: 12,
          rowGap: 12,
          gridTemplateColumns: isSm ? '1fr' : '1fr 1fr 1fr',
          gridTemplateRows: 'auto',
          gridAutoRows: 'auto',
        }}
      >
        {newAnnotationAsset && (
          <AnnotationCreator
            onClose={() => setNewAnnotationAsset(null)}
            asset={newAnnotationAsset}
            refreshSightingData={refreshSightingData}
          />
        )}
        <MorePhotoMenu
          id="image-actions-menu"
          anchorEl={get(anchorInfo, 'element')}
          open={Boolean(get(anchorInfo, 'element'))}
          onClose={() => setAnchorInfo(null)}
          onClickAddAnnotation={() => {
            setAnchorInfo(null);
            setNewAnnotationAsset(get(anchorInfo, 'asset'));
          }}
        />
        <PhotographDetail
          open={detailAssetIndex !== null}
          onClose={() => setDetailAssetIndex(null)}
          asset={get(assets, detailAssetIndex)}
          onNext={() => {
            if (detailAssetIndex === assets.length - 1) {
              setDetailAssetIndex(0);
            } else {
              setDetailAssetIndex(detailAssetIndex + 1);
            }
          }}
          onPrevious={() => {
            if (detailAssetIndex === 0) {
              setDetailAssetIndex(assets.length - 1);
            } else {
              setDetailAssetIndex(detailAssetIndex - 1);
            }
          }}
        />
        {assets.map((asset, i) => (
          <div key={asset.guid} style={{ position: 'relative' }}>
            <AnnotatedPhotograph
              assetMetadata={asset}
              annotations={
                showAnnotations ? get(asset, 'annotations', []) : []
              }
              onClick={() => setDetailAssetIndex(i)}
            />
            <IconButton
              onClick={e =>
                setAnchorInfo({ element: e.currentTarget, asset })
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
            <Text variant="caption">{asset.filename}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
