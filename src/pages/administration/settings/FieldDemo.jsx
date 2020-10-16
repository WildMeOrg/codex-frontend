import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { omit } from 'lodash-es';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

import LabeledInput from '../../../components/LabeledInput';

export default function FieldDemo({
  open,
  onClose,
  initialValue,
  fieldProps,
}) {
  const [demoFieldValue, setDemoFieldValue] = useState(initialValue);
  useEffect(
    () => {
      if (demoFieldValue !== initialValue)
        setDemoFieldValue(initialValue);
    },
    [initialValue],
  );

  const newFieldProps = fieldProps
    ? omit(fieldProps, ['timeCreated'])
    : fieldProps;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage id="CUSTOM_FIELD_DEMO" />
        <IconButton
          style={{ position: 'absolute', top: 8, right: 16 }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ minWidth: 200 }}>
        <Typography>
          <FormattedMessage id="DEMO_FIELD_DESCRIPTION" />
        </Typography>
        <div
          style={{
            padding: 30,
            border: '1px dashed black',
            margin: '30px 0',
          }}
        >
          {open && fieldProps && (
            <LabeledInput
              value={demoFieldValue}
              onChange={newValue => setDemoFieldValue(newValue)}
              {...newFieldProps}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
