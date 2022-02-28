import React from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useSiteSettings from '../../models/site/useSiteSettings';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import categoryTypes from '../../constants/categoryTypes';
import CategoryTable from './settings/CategoryTable';
import CustomFieldTable from './settings/CustomFieldTable';
import DefaultFieldTable from './settings/DefaultFieldTable';

function getCustomFields(siteSettings, property) {
  return get(
    siteSettings,
    [`site.custom.customFields.${property}`, 'value', 'definitions'],
    [],
  );
}

export default function FieldManagement() {
  const {
    data: siteSettings,
    loading,
    error,
    siteSettingsVersion,
  } = useSiteSettings();

  useDocumentTitle('MANAGE_FIELDS');

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
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="MANAGE_FIELDS"
      />
      <SettingsBreadcrumbs currentPageTextId="MANAGE_FIELDS" />
      <Grid
        container
        direction="column"
        spacing={3}
        style={{ padding: 20 }}
      >
        <DefaultFieldTable
          siteSettings={siteSettings}
          siteSettingsVersion={siteSettingsVersion}
        />
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
    </MainColumn>
  );
}
