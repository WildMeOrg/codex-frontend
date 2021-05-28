import React, { useState } from 'react';
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
  const [mapLatLng, setMapLatLng] = useState(null);

  const currentLatitude = get(value, '0', null);
  const currentLongitude = get(value, '1', null);
  const currentLatitudeString = currentLatitude
    ? currentLatitude.toString()
    : '';
  const currentLongitudeString = currentLongitude
    ? currentLongitude.toString()
    : '';

  const onClose = () => setModalOpen(false);
  const showDescription = !minimalLabels && description;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          style={{ width }}
          id="gps-latitude"
          label={intl.formatMessage({ id: 'DECIMAL_LATITUDE' })}
          value={currentLatitudeString}
          onChange={e => {
            const inputValue = e.target.value;
            onChange([parseFloat(inputValue), currentLongitude]);
          }}
        />
        <TextField
          style={{ width, margin: '8px 0' }}
          id="gps-longitude"
          label={intl.formatMessage({ id: 'DECIMAL_LONGITUDE' })}
          value={currentLongitudeString}
          onChange={e => {
            const inputValue = e.target.value;
            onChange([currentLatitude, parseFloat(inputValue)]);
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
            onChange={clickedPoint => setMapLatLng(clickedPoint)}
          />
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button display="basic" onClick={onClose} id="CANCEL" />
          <Button
            display="primary"
            onClick={() => {
              onChange(mapLatLng);
              onClose();
            }}
            id="CONFIRM"
          />
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
