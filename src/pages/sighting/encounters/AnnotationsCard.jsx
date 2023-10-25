import React, { useState } from 'react';
import { get } from 'lodash-es';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import { FormattedMessage } from 'react-intl';
import Button from '../../../components/Button';
// import Skeleton from '@material-ui/lab/Skeleton';

import Text from '../../../components/Text';
import Card from '../../../components/cards/Card';
import AnnotatedPhotograph from '../../../components/AnnotatedPhotograph';
import ClusteredAnnotationMenu from './ClusteredAnnotationMenu';

const useStyles = makeStyles({
  photoIcon: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
  },
});

export default function AnnotationsCard({
  title,
  titleId = 'ANNOTATIONS',
  annotationReferences,
  assets,
  onAddAnnotations,
  pending,
  sightingData,
}) {
  const theme = useTheme();
  const classes = useStyles();

  const [anchorInfo, setAnchorInfo] = useState(null);
  const loading = !annotationReferences;
  return (
    <Card
      title={title}
      titleId={titleId}
      overflowX="hidden"
      maxHeight={400}
      renderActions={
        <Button onClick={onAddAnnotations} display="tertiary">
          <FormattedMessage id="ASSIGN" />
        </Button>
      }
    >
      <ClusteredAnnotationMenu
        id="clustered-annotation-actions-menu"
        anchorEl={anchorInfo?.element}
        open={Boolean(anchorInfo?.element)}
        onClose={() => setAnchorInfo(null)}
        annotation={anchorInfo?.annotation}
        pending={pending}
        sightingData={sightingData}
      />
      {annotationReferences.length > 0 ? (
        <Grid style={{ margin: '8px 0' }} container spacing={2}>
          {annotationReferences.map(annotationReference => {
            const matchingAsset = assets.find(
              asset =>
                asset?.guid === annotationReference?.asset_guid,
            );
            const matchingAssetAnnotations = get(
              matchingAsset,
              'annotations',
              [],
            );
            const matchingAnnotation = matchingAssetAnnotations.find(
              annotation =>
                annotation?.guid === annotationReference?.guid,
            );
            return (
              <Grid
                key={matchingAnnotation?.guid}
                item
                style={{ position: 'relative' }}
              >
                <AnnotatedPhotograph
                  assetMetadata={matchingAsset}
                  annotations={[matchingAnnotation]}
                  onClick={Function.prototype}
                  width={248}
                />
                <IconButton
                  onClick={e =>
                    setAnchorInfo({
                      element: e.currentTarget,
                      annotation: matchingAnnotation,
                    })
                  }
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    color: theme.palette.common.white,
                  }}
                  className={classes.photoIcon}
                >
                  <MoreIcon />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Text
          style={{ marginTop: 4 }}
          id="CLUSTER_NO_ANNOTATIONS"
          variant="body2"
        />
      )}
      {loading ? <Text>loading</Text> : null}
    </Card>
  );
}
