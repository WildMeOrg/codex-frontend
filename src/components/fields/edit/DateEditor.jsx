import React from 'react';
import { useIntl } from 'react-intl';
import DateFnsUtils from '@date-io/date-fns';
import { parseISO } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import Text from '../../Text';
import useEditLabel from '../../../hooks/useEditLabel';
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
  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const intl = useIntl();
  let dateValue =   
    typeof value === 'string' ? parseISO(value) : value;

    if(value) {
      const date = new Date(value);
      const timezoneOffset = date.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
      const offsetMinutes = Math.abs(timezoneOffset) % 60;
      const offsetSign = timezoneOffset < 0 ? "+" : "-";
      const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
      const adjustedTimestampWithoutZ = new Date(date.getTime() - timezoneOffset * 60 * 1000).toISOString().slice(0, -1);
      const adjustedTimestampWithOffset = `${adjustedTimestampWithoutZ}${offsetFormatted}`;
      // console.log('adjustedTimestampWithOffset',adjustedTimestampWithOffset);
      dateValue = adjustedTimestampWithOffset;
    }
  
  // console.log('dateValue', dateValue);
  /* Note: the wrapper div is there because MuiPicker creates two child elements,
   * which messes up display if this component is a flex child. */
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <KeyboardDateTimePicker
            disableToolbar
            disableFuture
            variant="inline"
            autoOk
            ampm={false}
            format="yyyy-MM-dd HH:mm"
            margin="normal"
            id={`${
              editLabel // US: true // US: MM/dd/yyyy hh:mm
            }-date-input`}
            label={intl.formatMessage({
              id: 'SELECT_DATE',
            })}
            value={dateValue}
            onChange={onChange}
            style={{ margin: 0, width }}
            KeyboardButtonProps={{
              'aria-label': intl.formatMessage({ id: 'CHANGE_DATE' }),
            }}
            {...rest}
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
