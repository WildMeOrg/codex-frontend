import React, { useCallback, useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import BboxAnnotator from 'bboxjs';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import Button from './Button';

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
    <Dialog open onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage id={titleId} />
      </DialogTitle>
      <DialogContent>
        <div style={{ width: 400, padding: '0 40px' }}>
          <div
            id="editor-bbox-annotator-container"
            style={{ width: '100%', zIndex: 999 }}
            ref={divRef}
          />
          {!disableDelete && (
            <div style={{ margin: '8px 0' }}>
              {confirmDelete ? (
                <Typography>
                  <FormattedMessage id="DELETE_ANNOTATION_CONFIRMATION" />
                </Typography>
              ) : (
                <Button
                  onClick={() => setConfirmDelete(true)}
                  style={{ color: 'red' }}
                >
                  <FormattedMessage id="DELETE_THIS_ANNOTATION" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button display="primary" onClick={() => onChange(rect)}>
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
