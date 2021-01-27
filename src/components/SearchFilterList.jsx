import React from 'react';
import { useIntl } from 'react-intl';
import { get, isEqual } from 'lodash-es';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Text from './Text';

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
      <Text variant="subtitle1" id="ACTIVE_FILTERS" />
      {activeFilters.length === 0 && <Text id="NO_ACTIVE_FILTERS" />}
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
