import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import LatLngMap from './mapUtils/LatLngMap';
import TextInput from './TextInput';
import Button from '../Button';
import StandardDialog from '../StandardDialog';

export default function LatLongInput({
  schema,
  value,
  onChange,
  minimalLabels = false,
  width = 208,
  ...rest
}) {
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

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextInput
          width={width}
          value={currentLatitudeString}
          onChange={newLat => {
            onChange([parseFloat(newLat), currentLongitude]);
          }}
          schema={{ labelId: 'DECIMAL_LATITUDE', fieldType: 'float' }}
        />
        <TextInput
          width={width}
          value={currentLongitudeString}
          onChange={newLng => {
            onChange([currentLatitude, parseFloat(newLng)]);
          }}
          schema={{ labelId: 'DECIMAL_LONGITUDE', fieldType: 'float' }}
        />
      </div>
      <Button
        size="small"
        onClick={() => setModalOpen(true)}
        style={{ marginTop: 4 }}
        {...rest}
      >
        <FormattedMessage id="CHOOSE_ON_MAP" />
      </Button>
      {schema && !minimalLabels && schema.descriptionId && (
        <FormHelperText style={{ maxWidth: width }}>
          <FormattedMessage id={schema.descriptionId} />
        </FormHelperText>
      )}
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
          <Button
            display="basic"
            onClick={() => {
              onClose();
            }}
          >
            <FormattedMessage id="CANCEL" />
          </Button>
          <Button
            display="primary"
            onClick={() => {
              onChange(mapLatLng);
              onClose();
            }}
          >
            <FormattedMessage id="CONFIRM" />
          </Button>
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
