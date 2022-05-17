import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { parseISO } from 'date-fns';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import useEditLabel from '../../../hooks/useEditLabel';
import useDescription from '../../../hooks/useDescription';
import Text from '../../Text';

export default function DateRangeEditor({
  schema,
  value,
  onChange,
  minimalLabels = false,
}) {
  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);

  const startDate = get(value, 0, null);
  const endDate = get(value, 1, null);
  const startDateValue =
    typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endDateValue =
    typeof endDate === 'string' ? parseISO(endDate) : endDate;

  /* Note: the wrapper div is there because MuiPicker creates two child elements,
   * which messes up display if this component is a flex child. */

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {!minimalLabels && (
          <>
            <Text variant="subtitle2" style={{ marginTop: 16 }}>
              {editLabel}
            </Text>
            <Text
              variant="caption"
              color="textSecondary"
              style={{ marginTop: 4 }}
            >
              {description}
            </Text>
          </>
        )}
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd"
          margin="normal"
          id={`${
            editLabel // US: MM/dd/yyyy
          }-start-date`}
          label={<FormattedMessage id="START_DATE" />}
          value={startDateValue}
          onChange={nextStartDate => {
            onChange([nextStartDate, get(value, 1)]);
          }}
          style={{ margin: 0 }}
          KeyboardButtonProps={{
            'aria-label': `Change ${editLabel} start date`,
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd"
          margin="normal"
          id={`${
            editLabel // US: MM/dd/yyyy
          }-end-date`}
          label={<FormattedMessage id="END_DATE" />}
          value={endDateValue}
          onChange={nextEndDate => {
            onChange([get(value, 0), nextEndDate]);
          }}
          KeyboardButtonProps={{
            'aria-label': `Change ${editLabel} end date`,
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
