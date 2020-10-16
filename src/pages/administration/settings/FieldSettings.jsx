import React from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../../models/site/useSiteSettings';
import CategoryTable from './CategoryTable';
import CustomFieldTable from './CustomFieldTable';

function getCustomFields(siteSettings, property) {
  return get(
    siteSettings,
    [`site.custom.customFields.${property}`, 'value', 'definitions'],
    [],
  );
}

export default function FieldSettings() {
  const { data: siteSettings, loading, error } = useSiteSettings();

  const customFieldCategories = get(
    siteSettings,
    ['site.custom.customFieldCategories', 'value'],
    [],
  );
  const customEncounterFields = getCustomFields(
    siteSettings,
    'Encounter',
  );
  const customIndividualFields = getCustomFields(
    siteSettings,
    'MarkedIndividual',
  );
  const customSightingFields = getCustomFields(
    siteSettings,
    'Occurrence',
  );

  if (loading || error) return null;

  return (
    <Grid
      container
      direction="column"
      spacing={3}
      style={{ marginTop: 40 }}
    >
      <CategoryTable />
      <CustomFieldTable
        categories={customFieldCategories}
        fields={customIndividualFields}
        titleId="CUSTOM_INDIVIDUAL_FIELDS"
        settingName="site.custom.customFields.MarkedIndividual"
      />
      <CustomFieldTable
        categories={customFieldCategories}
        fields={customSightingFields}
        titleId="CUSTOM_SIGHTING_FIELDS"
        settingName="site.custom.customFields.Occurrence"
      />
      <CustomFieldTable
        categories={customFieldCategories}
        fields={customEncounterFields}
        titleId="CUSTOM_COMBINED_FIELDS"
        settingName="site.custom.customFields.Encounter"
      />
    </Grid>
  );
}
