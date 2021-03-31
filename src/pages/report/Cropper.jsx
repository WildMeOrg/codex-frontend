import React, { useCallback, useRef, useState } from 'react';
import { get } from 'lodash-es';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';
import BboxAnnotator from 'bboxjs';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';

export default function Cropper({ imgSrc, onClose, setCrop }) {
  const [rect, setRect] = useState({});
  const canvasRef = useRef(null);
  const theme = useTheme();

  const divRef = useCallback(() => {
    const bba = new BboxAnnotator(imgSrc, {
      // eslint-disable-line no-new
      prefix: 'cropper-',
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

  function saveCrop(canvas) {
    if (canvas) {
      const context = canvas.getContext('2d');
      const imageObject = new Image();
      imageObject.setAttribute('crossorigin', 'anonymous');
      imageObject.src = imgSrc;

      imageObject.onload = e => {
        const naturalHeight = get(e, 'path.0.naturalHeight', null);
        const naturalWidth = get(e, 'path.0.naturalWidth', null);

        const boxWidth = 0.01 * rect.percentWidth * naturalWidth;
        const boxHeight = 0.01 * rect.percentHeight * naturalHeight;
        const boxLeft = 0.01 * rect.percentLeft * naturalWidth;
        const boxTop = 0.01 * rect.percentTop * naturalHeight;
        const centerX = 0.5 * boxWidth + boxLeft;
        const centerY = 0.5 * boxHeight + boxTop;
        const transformX = 0.5 * boxWidth - centerX;
        const transformY = 0.5 * boxHeight - centerY;

        if (boxWidth && boxHeight) {
          canvas.width = boxWidth;
          canvas.height = boxHeight;

          context.translate(transformX, transformY);

          // https://riptutorial.com/html5-canvas/example/19532/rotate-an-image-or-path-around-it-s-centerpoint
          context.translate(0.5 * naturalWidth, 0.5 * naturalHeight);
          context.rotate(-rect.theta);
          context.translate(
            -0.5 * naturalWidth,
            -0.5 * naturalHeight,
          );

          context.drawImage(
            imageObject,
            0,
            0,
            naturalWidth,
            naturalHeight,
            0,
            0,
            naturalWidth,
            naturalHeight,
          );
        }

        setCrop(canvas.toDataURL());
        onClose();
      };
    }
  }

  return (
    <StandardDialog open onClose={onClose} titleId="CROP_PHOTO">
      <DialogContent>
        <div style={{ width: 400, padding: '0 40px' }}>
          <div
            id="cropper-bbox-annotator-container"
            style={{ width: '100%', zIndex: 999 }}
            ref={divRef}
          />
        </div>
        <canvas ref={canvasRef} width={100} height={100} />
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          Cancel
        </Button>
        <Button
          display="primary"
          onClick={() => saveCrop(canvasRef.current)}
        >
          Save
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
