import React, { memo } from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const colors = [
  {
      hex: '#487A63',
    labelId: 'FOREST',
  },
  {
    hex: '#2E818A',
    labelId: 'AQUA',
  },  
  {
    hex: '#8176B1',
    labelId: 'LAVENDER',
  },
  {
    hex: '#C24E14',
    labelId: 'PRAIRIE',
  },
  {
    hex: '#B35196',
    labelId: 'ROSE',
  }
  ];

const Core = function ({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
};

const ColorInput = function (props) {
  const {
    schema,
    required,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

  const intl = useIntl();

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', undefined);
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  return (
    <Core schema={schema} required={required} width={width}>
      <InputLabel>{getLabel(schema)}</InputLabel>
      <Select
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
        SelectDisplayProps={{ style: { display: 'flex' } }}
        {...rest}
      >
        {colors.map(color => (
          <MenuItem
            style={{ display: 'flex' }}
            value={color.hex}
            key={color.hex}
          >
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: color.hex,
                margin: '0 8px 0 4px',
                borderRadius: 100000,
              }}
            />
            <FormattedMessage id={color.labelId} />
          </MenuItem>
        ))}
      </Select>
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </Core>
  );
};

export default memo(ColorInput);
