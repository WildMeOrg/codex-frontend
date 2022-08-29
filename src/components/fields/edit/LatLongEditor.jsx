import React, { useState, useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import LatLngMap from './mapUtils/LatLngMap';
import Button from '../../Button';
import StandardDialog from '../../StandardDialog';
import useDescription from '../../../hooks/useDescription';

function getNumberString(n) {
  if (n === 0) return '0';
  return n ? n.toString() : '';
}

function calculateInitialState(coordinates) {
  return {
    latitude: getNumberString(get(coordinates, '0', '')),
    longitude: getNumberString(get(coordinates, '1', '')),
    mapCoordinates: null,
    setterType: 'external',
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'input-latitude':
      return {
        ...state,
        latitude: action.payload,
        setterType: 'internal',
      };
    case 'input-longitude':
      return {
        ...state,
        longitude: action.payload,
        setterType: 'internal',
      };
    case 'select-map-coordinates':
      return { ...state, mapCoordinates: action.payload };
    case 'confirm-map-coordinates':
      return {
        ...state,
        latitude: getNumberString(state.mapCoordinates?.[0]),
        longitude: getNumberString(state.mapCoordinates?.[1]),
        mapCoordinates: null,
        setterType: 'internal',
      };
    case 'update-coordinates-externally': {
      const latitudeString = getNumberString(
        get(action.payload, '0', ''),
      );
      const longitudeString = getNumberString(
        get(action.payload, '1', ''),
      );

      if (
        latitudeString === state.latitude &&
        longitudeString === state.longitude
      ) {
        // The external update was likely caused as a result of this
        // component's onChange, so bail out of the dispatch by
        // returning the same state.
        return state;
      }

      return {
        ...state,
        latitude: latitudeString,
        longitude: longitudeString,
        setterType: 'external',
      };
    }
    default:
      // eslint-disable-next-line no-console
      console.error(
        `unsupported action type, ${action.type}, provided to reducer`,
      );
      return state;
  }
}

export default function LatLongEditor({
  schema,
  value,
  onChange,
  minimalLabels = false,
  width = 280,
  ...rest
}) {
  const intl = useIntl();
  const description = useDescription(schema);

  const [modalOpen, setModalOpen] = useState(false);

  const [state, dispatch] = useReducer(
    reducer,
    value,
    calculateInitialState,
  );

  const {
    longitude: longitudeString,
    latitude: latitudeString,
    setterType,
  } = state;

  useEffect(() => {
    dispatch({
      type: 'update-coordinates-externally',
      payload: value,
    });
  }, [value]);

  useEffect(() => {
    if (setterType === 'internal') {
      const latitude =
        latitudeString === '' ? null : parseFloat(latitudeString);
      const longitude =
        longitudeString === '' ? null : parseFloat(longitudeString);
      onChange([latitude, longitude]);
    }
  }, [latitudeString, longitudeString, setterType]); // onChange is intentionally excluded.

  const onClose = () => {
    dispatch({ type: 'select-map-coordinates', payload: null });
    setModalOpen(false);
  };

  const showDescription = !minimalLabels && description;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          style={{ width }}
          id="gps-latitude"
          label={intl.formatMessage({ id: 'DECIMAL_LATITUDE' })}
          value={latitudeString}
          type="number"
          onChange={e => {
            dispatch({
              type: 'input-latitude',
              payload: e.target.value,
            });
          }}
        />
        <TextField
          style={{ width, margin: '8px 0' }}
          id="gps-longitude"
          label={intl.formatMessage({ id: 'DECIMAL_LONGITUDE' })}
          value={longitudeString}
          type="number"
          onChange={e => {
            dispatch({
              type: 'input-longitude',
              payload: e.target.value,
            });
          }}
        />
      </div>
      <Button
        size="small"
        onClick={() => setModalOpen(true)}
        style={{ marginTop: 4 }}
        id="CHOOSE_ON_MAP"
        {...rest}
      />
      {showDescription ? (
        <FormHelperText style={{ maxWidth: width }}>
          {description}
        </FormHelperText>
      ) : null}
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="SELECT_LOCATION"
      >
        <DialogContent style={{ marginBottom: 24 }}>
          <LatLngMap
            onChange={clickedPoint => {
              dispatch({
                type: 'select-map-coordinates',
                payload: clickedPoint,
              });
            }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button display="basic" onClick={onClose} id="CANCEL" />
          <Button
            display="primary"
            onClick={() => {
              dispatch({ type: 'confirm-map-coordinates' });
              onClose();
            }}
            id="CONFIRM"
          />
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
