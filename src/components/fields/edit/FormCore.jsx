import React from 'react';
import { get } from 'lodash-es';
import FormControl from '@material-ui/core/FormControl';

export default function FormCore({
  children,
  schema,
  width,
  style = {},
}) {
  return (
    <FormControl
      required={get(schema, 'required', false)}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
}
