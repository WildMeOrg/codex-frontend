import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import DateFnsUtils from '@date-io/date-fns';
import { parseISO } from 'date-fns';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

import timeSpecificityChoices from '../../../constants/timeSpecificityChoices';
import Text from '../../Text';
import FormCore from './FormCore';

const precisionMap = {
  year: {
    views: ['year'],
    intlFormat: 'yyyy',
    usFormat: 'yyyy',
  },
  month: {
    views: ['year', 'month'],
    intlFormat: 'yyyy-MM',
    usFormat: 'MM/yyyy',
  },
  day: {
    views: ['year', 'month', 'date'],
    intlFormat: 'yyyy-MM-dd',
    usFormat: 'MM/dd/yyyy',
  },
  time: {
    views: undefined,
    intlFormat: 'yyyy-MM-dd HH:mm',
    usFormat: 'MM/dd/yyyy hh:mm',
  },
};

export default function SpecifiedTimeEditor(props) {
  const { schema, value, onChange, width = 280, ...rest } = props;
  const intl = useIntl();

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  const timeSpecificity = get(value, 'timeSpecificity', '');
  const time = get(value, 'time', null);
  const dateInputViews = get(
    precisionMap,
    [timeSpecificity, 'views'],
    undefined,
  );
  const dateInputFormat = get(
    precisionMap,
    [timeSpecificity, 'intlFormat'],
    undefined,
  );

  const safeTimeValue =
    typeof time === 'string' ? parseISO(time) : time;

  /* Note: the wrapper div is there because MuiPicker creates two child elements,
   * which messes up display if this component is a flex child. */
  return (
    <div>
      <FormCore schema={{ ...schema, required: false }} width={width}>
        <InputLabel>
          {intl.formatMessage({ id: 'SIGHTING_TIME_SPECIFICITY' })}
        </InputLabel>
        <Select
          labelId="time-specificity-selector-label"
          id="time-specificity-selector"
          onChange={e => {
            onChange({ ...value, timeSpecificity: e.target.value });
          }}
          value={timeSpecificity}
          renderValue={currentValue => {
            const selectedChoice = timeSpecificityChoices.find(
              c => c.value === currentValue,
            );
            return getLabel(selectedChoice);
          }}
          {...rest}
        >
          {timeSpecificityChoices.map(option => (
            <MenuItem
              value={option.value}
              key={option.value}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Text component="span">{getLabel(option)}</Text>
              {option.description ? (
                <Text component="span" variant="caption">
                  {option.description}
                </Text>
              ) : (
                undefined
              )}
            </MenuItem>
          ))}
        </Select>
      </FormCore>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '8px 0',
          }}
        >
          <KeyboardDateTimePicker
            disableToolbar
            disableFuture
            variant="inline"
            autoOk
            ampm={false} // US: true
            format={dateInputFormat}
            margin="normal"
            id="sighting-full-time-input"
            label={intl.formatMessage({ id: 'SELECT_DATE' })}
            value={safeTimeValue}
            onChange={nextTime => {
              onChange({ ...value, time: nextTime });
            }}
            style={{ margin: 0, width }}
            KeyboardButtonProps={{
              'aria-label': intl.formatMessage({ id: 'CHANGE_DATE' }),
            }}
            views={dateInputViews}
            {...rest}
          />
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
}
