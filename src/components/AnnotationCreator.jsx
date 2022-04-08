import React, { useCallback, useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import BboxAnnotator from 'bboxjs';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { useTheme } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Info';

import viewpointChoices from '../constants/viewpoints';
import useIAClassOptions from '../hooks/useIAClassOptions';
import usePostAnnotation from '../models/annotation/usePostAnnotation';
import Button from './Button';
import Text from './Text';
import StandardDialog from './StandardDialog';
import CustomAlert from './Alert';

function percentageToPixels(percentValue, scalar) {
  const pixelValue = 0.01 * scalar * percentValue;
  return Math.round(Math.max(pixelValue, 0));
}

export default function AnnotationCreator({
  titleId = 'CREATE_ANNOTATION',
  asset,
  onClose,
  sightingData,
  refreshSightingData,
}) {
  const [viewpoint, setViewpoint] = useState('');
  const [IAClass, setIAClass] = useState('');
  const [rect, setRect] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  // const { postAnnotation, loading, error } = usePostAnnotation();
  const { postAnnotation, loading } = usePostAnnotation();
  const error = 'Ack!';
  const IAClassOptions = useIAClassOptions(sightingData);

  const handleViewpointInfoClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleViewpointInfoClose = () => {
    setAnchorEl(null);
  };

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
      fullScreen
      open
      onClose={onClose}
      titleId={titleId}
    >
      <DialogContent>
        <div
          style={{
            maxHeight: '80vh',
            width: '100%',
            padding: '0 40px',
          }}
        >
          <div
            id="editor-bbox-annotator-container"
            style={{ zIndex: 999 }}
            ref={divRef}
          />
        </div>
      </DialogContent>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          margin: '8px auto 4px auto',
          width: 'fit-content',
        }}
      >
        <FormControl required style={{ width: 240 }}>
          <InputLabel>
            <FormattedMessage id="VIEWPOINT" />
          </InputLabel>
          <Select
            labelId="viewpoint-selector-label"
            id="viewpoint-selector"
            value={viewpoint}
            onChange={e => setViewpoint(e.target.value)}
          >
            {viewpointChoices.map(viewpointChoice => (
              <MenuItem value={viewpointChoice.value}>
                <FormattedMessage id={viewpointChoice.labelId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <HelpIcon
          onClick={handleViewpointInfoClick}
          fontSize="small"
          style={{ marginLeft: 4, color: theme.palette.grey['700'] }}
        />
        <Popover
          open={Boolean(anchorEl)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{ style: { marginTop: 4 } }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={anchorEl}
          id="viewpoint-help-tooltip"
          onClose={handleViewpointInfoClose}
        >
          <Text style={{ padding: 12 }} id="VIEWPOINT_INFO" />
        </Popover>
      </div>

      <div style={{ margin: '4px auto 8px auto' }}>
        <FormControl required style={{ width: 240 }}>
          <InputLabel>
            <FormattedMessage id="ANNOTATION_CLASS" />
          </InputLabel>
          <Select
            labelId="annotation-class-selector-label"
            id="annotation-class-selector"
            value={IAClass}
            onChange={e => setIAClass(e.target.value)}
          >
            {IAClassOptions.map(IAClassChoice => (
              <MenuItem value={IAClassChoice.value}>
                {IAClassChoice.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          display="primary"
          loading={loading}
          disabled={!viewpoint || !IAClass}
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
              IAClass,
              coords,
              viewpoint,
              theta,
            );
            if (newAnnotationId) {
              refreshSightingData();
              onClose();
            }
          }}
          id="SAVE"
        />
        {error && (
          <CustomAlert
            titleId="SERVER_ERROR"
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
          >
            {error}
          </CustomAlert>
        )}
      </DialogActions>
    </StandardDialog>
  );
}
