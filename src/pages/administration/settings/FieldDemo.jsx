import React, { useState, useEffect } from 'react';
import { omit } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';

import StandardDialog from '../../../components/StandardDialog';
import LabeledInput from '../../../components/LabeledInput';
import Text from '../../../components/Text';

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
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="CUSTOM_FIELD_DEMO"
    >
      <DialogContent style={{ minWidth: 200 }}>
        <Text id="DEMO_FIELD_DESCRIPTION" />
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
    </StandardDialog>
  );
}
