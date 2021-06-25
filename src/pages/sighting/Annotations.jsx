import React, { useState } from 'react';
import { get, omit } from 'lodash-es';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';

import usePatchAnnotation from '../../models/annotation/usePatchAnnotation';
import useDeleteAnnotation from '../../models/annotation/useDeleteAnnotation';
import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import AnnotationEditor from '../../components/AnnotationEditor';
import ConfirmDelete from '../../components/ConfirmDelete';
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

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorInfo, setAnchorInfo] = useState(null);
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
      ...omit(asset, ['annotations', 'guid']),
    }));
    return [...acc, ...amendedAssetAnnotations];
  }, []);

  const clickedAnnotationId = get(anchorInfo, ['annotation', 'guid']);

  const editAnnotation = annotations.find(a => a.guid === editId);

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
        onClickEditAnnotation={() => {
          setEditId(clickedAnnotationId);
          setAnchorInfo(null);
        }}
        onClickDelete={async () => {
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
      {annotations.map(annotation => (
        <div key={annotation.guid} style={{ position: 'relative' }}>
          <AnnotatedPhotograph
            alt={annotation.filename}
            src={annotation.src}
            annotations={[annotation]}
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
