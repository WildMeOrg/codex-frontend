import React, { useState } from 'react';
import { get, omit } from 'lodash-es';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useIntl } from 'react-intl';
import usePatchAnnotation from '../../models/annotation/usePatchAnnotation';
import useDeleteAnnotation from '../../models/annotation/useDeleteAnnotation';
import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import AnnotationEditor from '../../components/AnnotationEditor';
import Text from '../../components/Text';
import ConfirmDelete from '../../components/ConfirmDelete';
import MatchAnnotationDialog from './identification/MatchAnnotationDialog';
import AnnotationDetail from './AnnotationDetail';
import MoreAnnotationMenu from './MoreAnnotationMenu';
import Keywords from './Keywords';
import AnnotationCreator from '../../components/AnnotationCreator';
import { formatFilename } from '../../utils/formatters';

const useStyles = makeStyles({
  photoIcon: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
  },
});

export default function Annotations({
  assets,
  refreshSightingData,
  pending,
  sightingData,
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const intl = useIntl();

  const [detailId, setDetailId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [anchorInfo, setAnchorInfo] = useState(null);
  const [newAnnotationAsset, setNewAnnotationAsset] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const {
    deleteAnnotation,
    loading: deleteInProgress,
    error: deleteAnnotationError,
  } = useDeleteAnnotation();

  const {
    updateAnnotationProperty,
    loading: patchInProgress,
    error: patchError,
    setError: setAnnotationError,
  } = usePatchAnnotation();

  const annotations = assets.reduce((acc, asset) => {
    const assetAnnotations = get(asset, 'annotations', []);
    const amendedAssetAnnotations = assetAnnotations.map(a => ({
      ...a,
      asset,
      ...omit(asset, ['annotations', 'guid']),
    }));
    return [...acc, ...amendedAssetAnnotations];
  }, []);
  const noAnnotations = assets
    .filter(data => data.annotations.length === 0)
    .map(a => {
      a.asset = a;
      return a;
    });

  const clickedAnnotationId = get(anchorInfo, ['annotation', 'guid']);
  const hasNoAnnotation = get(anchorInfo, [
    'annotation',
    'annotations',
  ]);
  const detailAnnotation = annotations.find(a => a.guid === detailId);
  const detailNoAnnotation = noAnnotations.find(
    a => a.guid === detailId,
  );

  const editAnnotation = annotations.find(a => a.guid === editId);
  return (
    <>
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

      <div
        style={{
          display: 'grid',
          columnGap: 12,
          rowGap: 12,
          gridTemplateColumns: isSm ? '1fr' : '1fr 1fr 1fr',
          gridTemplateRows: 'auto',
          gridAutoRows: 'auto',
          // margin: '0 20px',
        }}
      >
        <MatchAnnotationDialog
          annotationGuid={matchId}
          open={Boolean(matchId)}
          onClose={() => setMatchId(null)}
        />

        {newAnnotationAsset && (
          <AnnotationCreator
            onClose={() => setNewAnnotationAsset(null)}
            asset={newAnnotationAsset}
            sightingData={sightingData}
            pending={pending}
          />
        )}
        <AnnotationDetail
          annotation={detailAnnotation || detailNoAnnotation}
          open={Boolean(detailId)}
          onClose={() => setDetailId(null)}
          refreshSightingData={refreshSightingData}
        />
        <MoreAnnotationMenu
          id="image-actions-menu"
          pending={pending}
          disable={!!hasNoAnnotation}
          anchorEl={get(anchorInfo, 'element')}
          open={Boolean(get(anchorInfo, 'element'))}
          onClose={() => setAnchorInfo(null)}
          onClickStartIdentification={() => {
            setMatchId(clickedAnnotationId);
            setAnchorInfo(null);
          }}
          onClickEditAnnotation={() => {
            setEditId(clickedAnnotationId);
            setAnchorInfo(null);
          }}
          onClickAddAnnotation={() => {
            setAnchorInfo(null);
            setNewAnnotationAsset(
              get(anchorInfo, ['annotation', 'asset']),
            );
          }}
          onClickDelete={() => {
            setDeleteId(clickedAnnotationId);
            setAnchorInfo(null);
          }}
        />
        {editId && (
          <AnnotationEditor
            onClose={() => {
              setEditId(null);
              setAnnotationError(null);
            }}
            onChange={async rect => {
              const coords = [
                get(rect, 'percentLeft'),
                get(rect, 'percentTop'),
                get(rect, 'percentWidth'),
                get(rect, 'percentHeight'),
              ];
              const updateSuccessful = await updateAnnotationProperty(
                editId,
                'bounds',
                { rect: coords, theta: get(rect, 'theta', 0) },
              );
              if (updateSuccessful) {
                setEditId(null);
                refreshSightingData();
              }
            }}
            disableDelete
            error={patchError}
            loading={patchInProgress}
            imgSrc={get(editAnnotation, 'src')}
            annotations={[editAnnotation]}
          />
        )}
        <ConfirmDelete
          open={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          onDelete={async () => {
            const deleteSuccessful = await deleteAnnotation(deleteId);
            if (deleteSuccessful) {
              setDeleteId(null);
              refreshSightingData();
            }
          }}
          deleteInProgress={deleteInProgress}
          error={deleteAnnotationError}
          onClearError={() => deleteAnnotationError(null)}
          messageId="CONFIRM_DELETE_ANNOTATION_DESCRIPTION"
        />
        {annotations.length === 0 ? (
          <Text id="NO_ANNOTATIONS_MESSAGE" />
        ) : null}

        {annotations.map(annotation => (
          <div key={annotation.guid} style={{ position: 'relative' }}>
            <AnnotatedPhotograph
              assetMetadata={annotation}
              annotations={showAnnotations ? [annotation] : []}
              onClick={() => {
                setDetailId(annotation.guid);
              }}
            />
            <IconButton
              onClick={e => {
                setAnchorInfo({
                  element: e.currentTarget,
                  annotation,
                });
              }}
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
            <Text variant="caption">
              {formatFilename(annotation.asset.filename, 35)}
            </Text>
            <Keywords annotation={annotation} />
          </div>
        ))}

        {noAnnotations.map(annotation => (
          <div key={annotation.guid} style={{ position: 'relative' }}>
            <AnnotatedPhotograph
              assetMetadata={annotation}
              annotations={[]}
              onClick={() => {
                setDetailId(annotation.guid);
              }}
            />
            <IconButton
              onClick={e => {
                setAnchorInfo({
                  element: e.currentTarget,
                  annotation,
                });
              }}
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
            <Text variant="caption">
              {formatFilename(annotation.filename, 35)}
            </Text>
            <Keywords annotation={annotation} />
          </div>
        ))}
      </div>
    </>
  );
}
