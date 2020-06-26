import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import LatLngMap from './mapUtils/LatLngMap';
import TextInput from './TextInput';
import Button from '../Button';

export default function LatLongInput({
  schema,
  value,
  onChange,
  minimalLabels = false,
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
      <div style={{ display: 'flex' }}>
        <TextInput
          width={100}
          style={{ marginRight: 4 }}
          value={currentLatitudeString}
          onChange={newLat => {
            onChange([parseFloat(newLat), currentLongitude]);
          }}
          schema={{ labelId: 'LATITUDE', fieldType: 'float' }}
        />
        <TextInput
          width={100}
          value={currentLongitudeString}
          style={{ marginLeft: 4 }}
          onChange={newLng => {
            onChange([currentLatitude, parseFloat(newLng)]);
          }}
          schema={{ labelId: 'LONGITUDE', fieldType: 'float' }}
        />
      </div>
      <Button
        size="small"
        onClick={() => setModalOpen(true)}
        {...rest}
      >
        <FormattedMessage id="CHOOSE_ON_MAP" />
      </Button>
      {schema && !minimalLabels && schema.descriptionId && (
        <FormHelperText style={{ maxWidth: 220 }}>
          <FormattedMessage id={schema.descriptionId} />
        </FormHelperText>
      )}
      <Dialog open={modalOpen} onClose={onClose}>
        <DialogTitle onClose={onClose}>
          <FormattedMessage id="SELECT_LOCATION" />
          <IconButton
            style={{ position: 'absolute', top: 8, right: 16 }}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 24 }}>
          <LatLngMap
            onChange={clickedPoint => setMapLatLng(clickedPoint)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            display="basic"
            onClick={() => {
              onClose();
            }}
          >
            <FormattedMessage id="CANCEL" />
          </Button>
          <Button
            display="basic"
            onClick={() => {
              onChange(mapLatLng);
              onClose();
            }}
          >
            <FormattedMessage id="CONFIRM" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
