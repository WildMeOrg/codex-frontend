import React, { useCallback, useState } from 'react';
import { get } from 'lodash-es';
import BboxAnnotator from 'bboxjs';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';

import Button from './Button';
import Text from './Text';
import StandardDialog from './StandardDialog';

export default function AnnotationEditor({
  titleId = 'EDIT_ANNOTATION',
  disableDelete = false,
  imgSrc,
  onClose,
  onChange,
  annotations = [],
}) {
  const [rect, setRect] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const theme = useTheme();

  const divRef = useCallback(() => {
    const bba = new BboxAnnotator(imgSrc, {
      // eslint-disable-line no-new
      prefix: 'editor-',
      mode: 'rectangle',
      modes: 'rectangle',
      colors: {
        default: theme.palette.secondary.main,
        hover: '#5815b0',
        focus: theme.palette.secondary.dark,
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
          const theta = get(e, '0.angles.theta');
          const percentLeft = get(e, '0.percent.left');
          const percentTop = get(e, '0.percent.top');
          const percentWidth = get(e, '0.percent.width');
          const percentHeight = get(e, '0.percent.height');
          setRect({
            theta,
            percentLeft,
            percentTop,
            percentWidth,
            percentHeight,
          });
        },
      },
    });

    if (annotations.length === 0) {
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
    } else {
      annotations.forEach(annotation => {
        bba.add_entry({
          label: annotation.id,
          percent: {
            left: annotation.parameters.left,
            top: annotation.parameters.top,
            width: annotation.parameters.width,
            height: annotation.parameters.height,
          },
          angles: {
            theta: annotation.parameters.theta,
          },
          highlighted: true,
        });
      });
    }
  }, []);

  return (
    <StandardDialog
      maxWidth="xl"
      open
      onClose={onClose}
      titleId={titleId}
    >
      <DialogContent>
        <div style={{ width: 900, padding: '0 40px' }}>
          <div
            id="editor-bbox-annotator-container"
            style={{ zIndex: 999 }}
            ref={divRef}
          />
          {!disableDelete && (
            <div style={{ margin: '8px 0' }}>
              {confirmDelete ? (
                <Text id="DELETE_ANNOTATION_CONFIRMATION" />
              ) : (
                <Button
                  onClick={() => setConfirmDelete(true)}
                  style={{ color: 'red' }}
                  id="DELETE_THIS_ANNOTATION"
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          display="primary"
          onClick={() => onChange(rect)}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
