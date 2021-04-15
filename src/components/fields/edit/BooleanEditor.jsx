import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

import Text from '../../Text';
import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';

export default function BooleanInput({
  schema,
  value,
  onChange,
  width,
  minimalLabels = false,
  ...rest
}) {
  const label = useLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  return (
    <FormCore schema={schema} width={width}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!minimalLabels && <Text>{label}</Text>}
        <Switch
          checked={value}
          onChange={e => {
            onChange(e.target.checked);
          }}
          {...rest}
        />
      </div>

      {showDescription ? (
        <FormHelperText style={{ marginTop: 0 }}>
          {description}
        </FormHelperText>
      ) : null}
    </FormCore>
  );
}
