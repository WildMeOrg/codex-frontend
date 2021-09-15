import React, { useState } from 'react';
import { set } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import { parseISO, format } from 'date-fns';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import Text from '../Text';

function buildQuery(
  queryTerm,
  label,
  filterId,
  startDate,
  endDate,
  nested,
  clause,
) {
  const formattedStartDate = startDate
    ? format(startDate, 'yyyy-MM-dd')
    : null;
  const formattedEndDate = endDate
    ? format(endDate, 'yyyy-MM-dd')
    : null;

  let descriptor;
  if (startDate && endDate) {
    descriptor = `${label} between ${formattedStartDate} and ${formattedEndDate}`;
  } else if (startDate) {
    descriptor = `${label} after ${formattedStartDate}`;
  } else {
    descriptor = `${label} before ${formattedEndDate}`;
  }

  const query = {
    filterId,
    descriptor,
    nested,
    clause,
    query: {
      range: {
        [queryTerm]: {},
      },
    },
  };

  if (startDate)
    set(
      query,
      ['query', 'range', queryTerm, 'gte'],
      formattedStartDate,
    );
  if (endDate)
    set(
      query,
      ['query', 'range', queryTerm, 'lte'],
      formattedEndDate,
    );
  return query;
}

export default function DateRangeFilter({
  label,
  labelId,
  description,
  descriptionId,
  filterId,
  onChange,
  queryTerm,
  clause = 'filter',
  style = {},
  nested = false,
  minimalLabels = false,
}) {
  const intl = useIntl();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const startDateValue =
    typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endDateValue =
    typeof endDate === 'string' ? parseISO(endDate) : endDate;

  const translatedLabel = labelId
    ? intl.formatMessage({ id: labelId })
    : label;

  /* Note: the wrapper div is there because MuiPicker creates two child elements,
   * which messes up display if this component is a flex child. */

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {!minimalLabels && (
          <>
            <Text variant="subtitle2" style={{ marginTop: 16 }}>
              {translatedLabel}
            </Text>
            <Text
              variant="caption"
              color="textSecondary"
              id={descriptionId}
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
            if (Date.parse(nextStartDate)) {
              onChange(
                buildQuery(
                  queryTerm,
                  translatedLabel,
                  filterId,
                  nextStartDate,
                  endDate,
                  nested,
                  clause,
                ),
              );
            }
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
          style={{ marginTop: 0 }}
          label={<FormattedMessage id="END_DATE" />}
          value={endDateValue}
          onChange={nextEndDate => {
            setEndDate(nextEndDate);
            if (Date.parse(nextEndDate)) {
              onChange(
                buildQuery(
                  queryTerm,
                  translatedLabel,
                  filterId,
                  startDate,
                  nextEndDate,
                  nested,
                  clause,
                ),
              );
            }
          }}
          KeyboardButtonProps={{
            'aria-label': `Change ${label} end date`,
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
