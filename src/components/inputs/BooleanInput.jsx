import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

function Core({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
}

export default function BooleanInput({
  schema,
  required,
  value,
  onChange,
  width,
  minimalLabels = false,
  ...rest
}) {
  const intl = useIntl();

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  return (
    <Core required={required} width={width}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!minimalLabels && (
          <Typography>{getLabel(schema)}</Typography>
        )}
        <Switch
          checked={value}
          onChange={e => {
            onChange(e.target.checked);
          }}
          {...rest}
        />
      </div>

      {!minimalLabels && (
        <FormHelperText style={{ marginTop: 0 }}>
          {getDescription(schema)}
        </FormHelperText>
      )}
    </Core>
  );
}
