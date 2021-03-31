import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import AreaMap from './mapUtils/AreaMap';
import DeleteButton from '../DeleteButton';
import { defaultAreaBounds } from '../../constants/defaults';
import Button from '../Button';
import Text from '../Text';
import StandardDialog from '../StandardDialog';

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
          <Text id="BOUNDING_BOX_SELECTED" />
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
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="SELECT_BOUNDING_BOX"
      >
        <DialogContent style={{ marginBottom: 24 }}>
          <AreaMap
            startBounds={value}
            onChange={clickedPoint => setMapArea(clickedPoint)}
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
              onChange(mapArea);
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
