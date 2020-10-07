import React from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DateRangeInput(props) {
  const { schema, value, onChange, minimalLabels = false } = props;

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

  /* Note: the wrapper div is there because MuiPicker creates two child elements,
   * which messes up display if this component is a flex child. */

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Typography variant="subtitle2" style={{ marginTop: 16 }}>
          {getLabel(schema)}
        </Typography>
        {!minimalLabels && (
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ marginTop: 4 }}
          >
            {getDescription(schema)}
          </Typography>
        )}
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id={`${getLabel(schema)}-start-date`}
          label={<FormattedMessage id="START_DATE" />}
          value={value[0]}
          onChange={nextStartDate => {
            onChange([nextStartDate, value[1]]);
          }}
          style={{ margin: 0 }}
          KeyboardButtonProps={{
            'aria-label': `Change ${getLabel(schema)} start date`,
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id={`${getLabel(schema)}-end-date`}
          label={<FormattedMessage id="END_DATE" />}
          value={value[1]}
          onChange={nextEndDate => {
            onChange([value[0], nextEndDate]);
          }}
          style={{ margin: 0 }}
          KeyboardButtonProps={{
            'aria-label': `Change ${getLabel(schema)} end date`,
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
