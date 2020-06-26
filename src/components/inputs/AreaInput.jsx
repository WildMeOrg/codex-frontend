import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import AreaMap from './mapUtils/AreaMap';
import DeleteButton from '../DeleteButton';
import { defaultAreaBounds } from '../../constants/defaults';
import Button from '../Button';

export default function AreaInput({
  schema,
  value,
  onChange,
  minimalLabels = false,
  ...rest
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mapArea, setMapArea] = useState(value || defaultAreaBounds);

  const onClose = () => setModalOpen(false);

  return (
    <div style={{ marginTop: 16 }}>
      {!value && (
        <Button
          size="small"
          onClick={() => setModalOpen(true)}
          {...rest}
        >
          <FormattedMessage id="CHOOSE_ON_MAP" />
        </Button>
      )}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography>
            <FormattedMessage id="BOUNDING_BOX_SELECTED" />
          </Typography>
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
          <FormattedMessage id="SELECT_BOUNDING_BOX" />
          <IconButton
            style={{ position: 'absolute', top: 8, right: 16 }}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 24 }}>
          <AreaMap
            startBounds={value}
            onChange={clickedPoint => setMapArea(clickedPoint)}
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
              onChange(mapArea);
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
