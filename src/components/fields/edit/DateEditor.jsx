import React from 'react';
import { useIntl } from 'react-intl';
import DateFnsUtils from '@date-io/date-fns';
import { formatISO, parseISO } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
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
  console.log('deleteMe value coming in is: ');
  console.log(value);
  const handleFormatIso = val => {
    console.log('deleteMe val in handleFormatIso is: ');
    console.log(val);
    try {
      const dateObj = parseISO(val);
      console.log('deleteMe got here b1');
      const tmpReturnObj = formatISO(dateObj, {
        representation: 'complete',
      });
      console.log('deleteMe got here b2 and tmpReturnObj is: ');
      console.log(tmpReturnObj);
      return formatISO(dateObj, { representation: 'complete' });
    } catch (error) {
      console.log('deleteMe formatting error: ');
      console.log(error);
      return parseISO(val);
    }
  };
  const dateValue =
    typeof value === 'string' ? handleFormatIso(value) : value;
  console.log('deleteMe dateValue is: ');
  console.log(dateValue);
  console.log('deleteMe typeof dateValue is: ' + typeof dateValue);
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
            ampm={false} // US: true
            format="yyyy-MM-dd HH:mm" // US: MM/dd/yyyy hh:mm
            margin="normal"
            id={`${label}-date-input`}
            label={intl.formatMessage({ id: 'SELECT_DATE' })}
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
