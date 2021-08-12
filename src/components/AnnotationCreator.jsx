import React, { useCallback, useState } from 'react';
import { get } from 'lodash-es';
import BboxAnnotator from 'bboxjs';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';
import CustomAlert from './Alert';

import usePostAnnotation from '../models/annotation/usePostAnnotation';
import Button from './Button';
import StandardDialog from './StandardDialog';

function percentageToPixels(percentValue, scalar) {
  const pixelValue = 0.01 * scalar * percentValue;
  return Math.round(Math.max(pixelValue, 0));
}

export default function AnnotationCreator({
  titleId = 'CREATE_ANNOTATION',
  asset,
  onClose,
  refreshSightingData,
}) {
  const [rect, setRect] = useState({});
  const theme = useTheme();

  const { postAnnotation, loading, error } = usePostAnnotation();

  const imgSrc = get(asset, 'src');
  const imageWidth = get(asset, ['dimensions', 'width']);
  const imageHeight = get(asset, ['dimensions', 'height']);

  const divRef = useCallback(() => {
    const bba = new BboxAnnotator(imgSrc, {
      // eslint-disable-line no-new
      prefix: 'editor-', // bboxjs needs this prefix!
      mode: 'rectangle',
      modes: 'rectangle',
      colors: {
        default: theme.palette.primary.main,
        hover: theme.palette.common.white,
        focus: theme.palette.primary.main,
        anchor: theme.palette.primary.main,
      },
      actions: {
        entry: {
          addition: false,
          parts: false,
          deletion: false,
        },
      },
      callbacks: {
        onchange: e => {
          const coords = get(e, '0');
          setRect({
            theta: get(coords, 'angles.theta'),
            percentLeft: get(coords, 'percent.left'),
            percentTop: get(coords, 'percent.top'),
            percentWidth: get(coords, 'percent.width'),
            percentHeight: get(coords, 'percent.height'),
          });
        },
      },
    });

    bba.options.hotkeys.enabled = false;

    bba.add_entry({
      label: '1',
      percent: {
        left: 10,
        top: 10,
        width: 80,
        height: 80,
      },
      angles: {
        theta: 0,
      },
      highlighted: true,
    });
  }, []);

  return (
    <StandardDialog
      maxWidth="xl"
      open
      onClose={onClose}
      titleId={titleId}
    >
      <DialogContent>
        <div style={{ width: '80vw', padding: '0 40px' }}>
          <div
            id="editor-bbox-annotator-container"
            style={{ zIndex: 999 }}
            ref={divRef}
          />
        </div>
        {error && (
          <CustomAlert
            titleId="SERVER_ERROR"
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
          >
            {error}
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          display="primary"
          loading={loading}
          onClick={async () => {
            const assetId = get(asset, 'guid');
            const coords = [
              percentageToPixels(
                get(rect, 'percentLeft'),
                imageWidth,
              ),
              percentageToPixels(
                get(rect, 'percentTop'),
                imageHeight,
              ),
              percentageToPixels(
                get(rect, 'percentWidth'),
                imageWidth,
              ),
              percentageToPixels(
                get(rect, 'percentHeight'),
                imageHeight,
              ),
            ];
            const theta = get(rect, 'theta', 0);
            const newAnnotationId = await postAnnotation(
              assetId,
              'test-ia-class',
              coords,
              theta,
            );
            if (newAnnotationId) {
              refreshSightingData();
              onClose();
            }
          }}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
