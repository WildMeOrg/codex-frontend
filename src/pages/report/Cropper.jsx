import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useTheme } from '@material-ui/core/styles';
import BboxAnnotator from 'bboxjs';

export default function Cropper({ imgSrc, onClose }) {
  const div = useRef(null);
  const theme = useTheme();

  useEffect(
    () => {
      console.log('here????', div);
      if (div && div.current) {
        console.log('heeeree');
        const bba = new BboxAnnotator(imgSrc, {
          // eslint-disable-line no-new
          prefix: `cropper-`,
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
              console.log(e);
            },
          },
        });

        bba.add_entry({
          label: '1',
          percent: {
            left: 10,
            top: 10,
            width: 90,
            height: 90,
          },
          angles: {
            theta: 0,
          },
          highlighted: true,
        });
      }
    },
    [div],
  );

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage id="CROP_PHOTO" />
      </DialogTitle>
      <DialogContent>
        <div
          id={`cropper-bbox-annotator-container`}
          style={{ width: '100%', zIndex: 999999 }}
          ref={div}
        />
      </DialogContent>
    </Dialog>
  );
}
