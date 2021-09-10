import React, { useState } from 'react';
import { set } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { parseISO } from 'date-fns';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import Text from '../Text';

function buildQuery(queryTerm, startDate, endDate) {
  const query = {
    range: {
      [queryTerm]: {},
    },
  };
  const formattedStartDate = startDate
    ? JSON.stringify(startDate)
    : null;
  const formattedEndDate = endDate ? JSON.stringify(endDate) : null;

  if (startDate)
    set(query, ['range', queryTerm, 'gte'], formattedStartDate);
  if (endDate)
    set(query, ['range', queryTerm, 'lte'], formattedEndDate);
  return query;
}

export default function DateRangeFilter({
  label,
  labelId,
  description,
  descriptionId,
  onChange,
  queryTerm,
  minimalLabels = false,
}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
            <Text
              variant="subtitle2"
              style={{ marginTop: 16 }}
              labelId={labelId}
            >
              {label}
            </Text>
            <Text
              variant="caption"
              color="textSecondary"
              descriptionId={descriptionId}
              style={{ marginTop: 4 }}
            >
              {description}
            </Text>
          </>
        )}
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd" // US: MM/dd/yyyy
          margin="normal"
          id={`${label}-start-date`}
          label={<FormattedMessage id="START_DATE" />}
          value={startDateValue}
          onChange={nextStartDate => {
            setStartDate(nextStartDate);
            onChange(buildQuery(queryTerm, nextStartDate, endDate));
          }}
          style={{ margin: 0 }}
          KeyboardButtonProps={{
            'aria-label': `Change ${label} start date`,
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd" // US: MM/dd/yyyy
          margin="normal"
          id={`${label}-end-date`}
          label={<FormattedMessage id="END_DATE" />}
          value={endDateValue}
          onChange={nextEndDate => {
            setEndDate(nextEndDate);
            onChange(buildQuery(queryTerm, startDate, nextEndDate));
          }}
          KeyboardButtonProps={{
            'aria-label': `Change ${label} end date`,
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
