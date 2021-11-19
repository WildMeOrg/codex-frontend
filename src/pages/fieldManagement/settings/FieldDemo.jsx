import React, { useState, useEffect } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';

const Editor = function({ schema, value, onChange }) {
  const componentProps = schema.editComponentProps || {};

  return (
    <schema.editComponent
      schema={schema}
      value={value}
      onChange={onChange}
      {...componentProps}
    />
  );
};

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
            <Editor
              schema={fieldProps}
              value={demoFieldValue}
              onChange={newValue => setDemoFieldValue(newValue)}
            />
          )}
        </div>
      </DialogContent>
    </StandardDialog>
  );
}
