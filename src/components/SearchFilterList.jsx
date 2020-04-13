import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get, isEqual } from 'lodash-es';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function SearchFilterList({
  formValues,
  setFormValues,
  schema,
}) {
  const intl = useIntl();

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  const activeFilters = schema.filter(
    field => !isEqual(formValues[field.name], field.defaultValue),
  );

  return (
    <div style={{ margin: '16px 0 0 16px' }}>
      <Typography variant="subtitle1">
        <FormattedMessage id="ACTIVE_FILTERS" />
      </Typography>
      {activeFilters.length === 0 && (
        <Typography>
          <FormattedMessage id="NO_ACTIVE_FILTERS" />
        </Typography>
      )}
      <Grid container spacing={1}>
        {activeFilters.map(field => (
          <Grid item key={field.name}>
            <Chip
              label={getLabel(field)}
              style={{ marginTop: 4 }}
              onDelete={() =>
                setFormValues({
                  ...formValues,
                  [field.name]: field.defaultValue,
                })
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
