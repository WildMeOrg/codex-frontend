import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DateInput(props) {
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
    return get(object, 'label', 'Missing label');
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id={`${getLabel(schema)}-date-input`}
        label={getLabel(schema)}
        value={value}
        onChange={onChange}
        style={{ margin: 0, width }}
        KeyboardButtonProps={{
          'aria-label': `${getLabel(schema)} input`,
        }}
        {...rest}
      />
      {!minimalLabels && (
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ marginTop: 4 }}
        >
          {getDescription(schema)}
        </Typography>
      )}
    </MuiPickersUtilsProvider>
  );
}
