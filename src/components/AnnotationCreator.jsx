import React, { useCallback, useState } from 'react';
import { get, pick, map, filter } from 'lodash-es';
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
import useAddEncounter from '../models/encounter/useAddEncounter';
import useAddAnnotationsToSightingEncounter from '../models/encounter/useAddAnnotationsToSightingEncounter';

function percentageToPixels(percentValue, scalar) {
  const pixelValue = 0.01 * scalar * percentValue;
  return Math.round(Math.max(pixelValue, 0));
}

async function createEncounter(sightingData) {
  const copiedProperties = pick(sightingData, [
    'time',
    'timeSpecificity',
    'locationId',
  ]);
  const sightingId = get(sightingData, 'guid');
  const encounterGuidsBeforeCreation = map(
    get(sightingData, 'encounters'),
    encounter => encounter.guid,
    [],
  );
  const encounterCreationResponse = await addEncounterToSighting(
    sightingId,
    copiedProperties,
  );
  const encounterGuidsAfterCreation = map(
    get(
      encounterCreationResponse,
      ['response', 'data', 'encounters'],
      [],
    ),
    encounter => encounter.guid,
    [],
  );
  const newEncounterGuids = filter(
    encounterGuidsAfterCreation,
    enc => encounterGuidsBeforeCreation.indexOf(enc) === -1,
    [],
  );
  console.log('deleteMe newEncounterGuids are: ');
  console.log(newEncounterGuids);
  //TODO deleteMe send off an error if length !==1?
  return encounterCreationResponse?.success &&
    newEncounterGuids?.length === 1
    ? newEncounterGuids
    : [];
}

export default function AnnotationCreator({
  titleId = 'CREATE_ANNOTATION',
  asset,
  onClose,
  sightingData,
  refreshSightingData,
  pending,
}) {
  const [viewpoint, setViewpoint] = useState('');
  const [IAClass, setIAClass] = useState('');
  const [rect, setRect] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const {
    addEncounter: addEncounterToSighting,
    loading: addEncounterToSightingLoading,
    error: addEncounterToSightingError,
    setError: setAddEncounterError,
  } = useAddEncounter();

  const {
    addAnnotationsToSightingEncounter,
    error: addToSightingEncounterError,
    isLoading: addToSightingEncounterLoading,
    onClearError: onClearAddToSightingEncounterError,
  } = useAddAnnotationsToSightingEncounter();

  const { postAnnotation, loading, error } = usePostAnnotation();
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
      {error && (
        <CustomAlert
          titleId="SERVER_ERROR"
          style={{
            margin: '16px auto 8px auto',
            maxHeight: '80vh',
            width: 600,
            padding: '0 40px',
          }}
          severity="error"
        >
          {error}
        </CustomAlert>
      )}
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
            const newEncounterGuids = pending
              ? []
              : createEncounter(sightingData);
            const newEncounterGuid = get(newEncounterGuids, [0]);
            console.log('deleteMe newEncounterGuid is: ');
            console.log(newEncounterGuid);

            console.log(
              'deleteMe got here and encounter creation was successful and there is only one new encounter guid',
            );
            const newAnnotationId = await postAnnotation(
              assetId,
              IAClass,
              coords,
              viewpoint,
              theta,
              newEncounterGuid,
            );
            console.log(
              'deleteMe check that this worked and newAnnotationId is: ' +
                newAnnotationId,
            );

            if (newAnnotationId) {
              if (!pending && newEncounterGuid) {
                const result = await addAnnotationsToSightingEncounter(
                  newEncounterGuid,
                  [newAnnotationId],
                );
                console.log(
                  'deleteMe result from addAnnotationsToSightingEncounter is: ',
                );
                console.log(result);
              }
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
