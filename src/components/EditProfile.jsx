import React, { useState } from 'react';
import { capitalize } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function({
  visible,
  onClose,
  fieldValues,
  fieldSchema,
}) {
  const intl = useIntl();

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage
          id="EDIT_PROFILE"
          defaultMessage="Edit Profile"
        />
      </DialogTitle>
      <DialogContent>
        <div style={{ marginLeft: 4 }}>
          {fieldValues.map(fieldData => (
            <div
              key={fieldData.name}
              style={{ display: 'flex', marginTop: 4 }}
            >
              <Typography>{`${intl.formatMessage({
                id: fieldData.name.toUpperCase(),
                defaultMessage: capitalize(fieldData.name),
              })}:`}</Typography>
              <Typography style={{ marginLeft: 4 }}>
                {fieldData.value}
              </Typography>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage id="CANCEL" defaultMessage="Cancel" />
        </Button>
        <Button onClick={onClose} color="primary" autoFocus>
          <FormattedMessage id="CONFIRM" defaultMessage="Confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
