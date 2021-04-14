import React from 'react';
import { useIntl } from 'react-intl';
import DateFnsUtils from '@date-io/date-fns';
import {
  parseISO,
  getHours,
  setHours,
  getMinutes,
  setMinutes,
} from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import Text from '../../Text';
import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';

export default function DateEditor(props) {
  const {
    schema,
    value,
    onChange,
    width = 280,
    minimalLabels = false,
    ...rest
  } = props;
  const label = useLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const intl = useIntl();
  const dateValue =
    typeof value === 'string' ? parseISO(value) : value;

  /* Note: the wrapper div is there because MuiPicker creates two child elements,
   * which messes up display if this component is a flex child. */
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <KeyboardDatePicker
            disableToolbar
            disableFuture
            variant="inline"
            autoOk
            format="yyyy-MM-dd" // US: MM/dd/yyyy
            margin="normal"
            id={`${label}-date-input`}
            label={intl.formatMessage({ id: 'SELECT_DATE' })}
            value={dateValue}
            onChange={newDate => {
              // Default to 12:00pm, leave hours and minutes unchanged if they are already set.
              const hours = value ? getHours(dateValue) : 0;
              const minutes = value ? getMinutes(dateValue) : 0;
              newDate = setHours(newDate, hours);
              newDate = setMinutes(newDate, minutes);
              onChange(newDate);
            }}
            style={{ margin: 0, width }}
            KeyboardButtonProps={{
              'aria-label': intl.formatMessage({ id: 'CHANGE_DATE' }),
            }}
            {...rest}
          />
          <KeyboardTimePicker
            variant="inline"
            margin="normal"
            format="HH:mm" // default for US
            id={`${label}-time-input`}
            label={intl.formatMessage({ id: 'SELECT_TIME' })}
            value={dateValue}
            onChange={onChange}
            KeyboardButtonProps={{
              'aria-label': intl.formatMessage({ id: 'CHANGE_TIME' }),
            }}
            style={{ width }}
          />
          {showDescription ? (
            <Text
              variant="caption"
              color="textSecondary"
              style={{ marginTop: 4 }}
            >
              {description}
            </Text>
          ) : null}
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
}
