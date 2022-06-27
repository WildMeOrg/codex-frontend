import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Text from './Text';

export default function SearchFilterList({
  formFilters,
  setFormFilters,
}) {
  return (
    <div style={{ margin: '16px 0 0 16px' }}>
      <Text variant="subtitle1" id="ACTIVE_FILTERS" />
      {formFilters?.length === 0 && (
        <Text variant="body2" id="NO_ACTIVE_FILTERS" />
      )}
      <Grid container spacing={1} style={{ marginTop: 4 }}>
        {formFilters?.map(filter => (
          <Grid item key={filter.filterId}>
            <Chip
              label={filter.descriptor}
              onDelete={() => {
                const newFormFilters = formFilters.filter(
                  f => f.filterId !== filter.filterId,
                );
                setFormFilters(newFormFilters);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
