import React from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../../models/site/useSiteSettings';
import CategoryTable from './CategoryTable';
import CustomFieldTable from './CustomFieldTable';
import categoryTypes from '../../../constants/categoryTypes';

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

  const customIndividualCategories = customFieldCategories.filter(
    c => c.type === categoryTypes.individual,
  );

  const customSightingCategories = customFieldCategories.filter(
    c => c.type === categoryTypes.sighting,
  );

  const customEncounterCategories = customFieldCategories.filter(
    c => c.type === categoryTypes.encounter,
  );

  return (
    <Grid
      container
      direction="column"
      spacing={3}
      style={{ marginTop: 40 }}
    >
      <CategoryTable />
      <CustomFieldTable
        categories={customIndividualCategories}
        fields={customIndividualFields}
        titleId="CUSTOM_INDIVIDUAL_FIELDS"
        descriptionId="CUSTOM_INDIVIDUAL_FIELDS_DESCRIPTION"
        settingName="site.custom.customFields.MarkedIndividual"
      />
      <CustomFieldTable
        categories={customSightingCategories}
        fields={customSightingFields}
        titleId="CUSTOM_SIGHTING_FIELDS"
        descriptionId="CUSTOM_SIGHTING_FIELDS_DESCRIPTION"
        settingName="site.custom.customFields.Occurrence"
      />
      <CustomFieldTable
        categories={customEncounterCategories}
        fields={customEncounterFields}
        titleId="CUSTOM_ENCOUNTER_FIELDS"
        descriptionId="CUSTOM_ENCOUNTER_FIELDS_DESCRIPTION"
        settingName="site.custom.customFields.Encounter"
      />
    </Grid>
  );
}
