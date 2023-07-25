import React from 'react';
import { useState } from 'react';
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
import { useIntl } from 'react-intl';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import Button from '../../components/Button';

function getCustomFields(siteSettings, property) {
  return get(
    siteSettings,
    [`site.custom.customFields.${property}`, 'value', 'definitions'],
    [],
  );
}

export default function FieldManagement() {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const [ species, setSpecies ] = useState(false);
  const intl = useIntl();

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
    'Individual',
  );
  const customSightingFields = getCustomFields(
    siteSettings,
    'Sighting',
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

  const speciesTableColumns = [
    {
      name: 'Species',
      label: intl.formatMessage({ id: 'SPECIES' }),      
    },
    {
      name: 'prefix',
      label: intl.formatMessage({ id: 'ID_PREFIX' }),
      align: 'left',
    },
    {
      name: 'Count',
      label: intl.formatMessage({ id: 'COUNT' }),      
    },
    {
      name: 'Actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),      
    },
  ];

  const speciesTableData = get(siteSettings, ['site.species', 'value'], []);
  console.log(speciesTableData);
  const speciesTableRows = speciesTableData.map((species) => {
    return {
      Species: `${species.scientificName} (${species.commonNames[0]})`,
      prefix: 'ABC',
      Count: 124,
      Actions: <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          console.log("action button clicked")
        }}
      >
        {intl.formatMessage({ id: 'EDIT' })}
      </Button>
    }
  })
  console.log(speciesTableRows);

  if(species) {
    return  (
      <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="MANAGE_SPECIES"
      />
      <SettingsBreadcrumbs currentPageTextId="MANAGE_SPECIES" />
      <Grid
        container
        direction="column"
        spacing={3}
        style={{ padding: 20 }}
      >
      <CustomFieldTable
        categories={customIndividualCategories}
        fields={customIndividualFields}
        titleId="CUSTOM_INDIVIDUAL_FIELDS"
        descriptionId="CUSTOM_INDIVIDUAL_FIELDS_DESCRIPTION"
        settingName="site.custom.customFields.Individual"
        noFieldsTextId="NO_CUSTOM_INDIVIDUAL_FIELDS_MESSAGE"
      />
      </Grid>
    </MainColumn>
    )
  }
  else return (
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
        <DefaultFieldTable siteSettings={siteSettings} setSpecies={setSpecies} />
        <CategoryTable />
        <CustomFieldTable
          categories={customIndividualCategories}
          fields={customIndividualFields}
          titleId="CUSTOM_INDIVIDUAL_FIELDS"
          descriptionId="CUSTOM_INDIVIDUAL_FIELDS_DESCRIPTION"
          settingName="site.custom.customFields.Individual"
          noFieldsTextId="NO_CUSTOM_INDIVIDUAL_FIELDS_MESSAGE"
        />
        <CustomFieldTable
          categories={customSightingCategories}
          fields={customSightingFields}
          titleId="CUSTOM_SIGHTING_FIELDS"
          descriptionId="CUSTOM_SIGHTING_FIELDS_DESCRIPTION"
          settingName="site.custom.customFields.Sighting"
          noFieldsTextId="NO_CUSTOM_SIGHTING_FIELDS_MESSAGE"
        />
        <CustomFieldTable
          categories={customEncounterCategories}
          fields={customEncounterFields}
          titleId="CUSTOM_ENCOUNTER_FIELDS"
          descriptionId="CUSTOM_ENCOUNTER_FIELDS_DESCRIPTION"
          settingName="site.custom.customFields.Encounter"
          noFieldsTextId="NO_CUSTOM_ENCOUNTER_FIELDS_MESSAGE"
        />
      </Grid>
    </MainColumn>
  );
}
