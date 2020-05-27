import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import DeleteButton from '../DeleteButton';
import Map from './mapUtils/Map';
import Marker from './mapUtils/Marker';

export default function LatLongInput({
  schema,
  value,
  onChange,
  minimalLabels = false,
  ...rest
}) {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLatLong, setLatlong] = useState(null);

  console.log(currentLatLong);

  const onClose = () => setModalOpen(false);

  return (
    <div>
      {!value && (
        <Button
          size="small"
          variant="outlined"
          style={{ marginTop: 16 }}
          onClick={() => setModalOpen(true)}
          {...rest}
        >
          <FormattedMessage id="SELECT_LOCATION" />
        </Button>
      )}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography>{value}</Typography>
          <DeleteButton
            onClick={() => {
              onChange(null);
            }}
          />
        </div>
      )}
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
          <Map markerLocation={currentLatLong} onChange={clickedPoint => setLatlong(clickedPoint)} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onChange([]);
              onClose();
            }}
          >
            <FormattedMessage id="CANCEL" />
          </Button>
          <Button
            onClick={() => {
              onChange([]);
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
