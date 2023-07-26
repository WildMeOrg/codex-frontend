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
import { useIntl, FormattedMessage } from 'react-intl';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import Button from '../../components/Button';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';
import ActionIcon from '../../components/ActionIcon';
import newSpeciesEditor from './settings/defaultFieldComponents/newSpeciesEditor';
import SpeciesEditor from './settings/defaultFieldComponents/SpeciesEditor';

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
  const [editField, setEditField] = useState(null);

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

  const tableColumns = [
    {
      name: 'labelId',
      label: intl.formatMessage({ id: 'SPECIES' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} />
        ),
      },
    },
    {
      name: 'prefix',
      label: intl.formatMessage({ id: 'PREFIX' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} />
        ),
      },
    },
    {
      name: 'count',
      label: intl.formatMessage({ id: 'COUNT' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} />
        ),
      },
    }
    // {
    //   name: 'prefix',
    //   label: intl.formatMessage({ id: 'PREFIX' }),
    //   options: { cellRenderer: cellRendererTypes.capitalizedString },
    // },
    // {
    //   name: 'count',
    //   label: intl.formatMessage({ id: 'COUNT' }),
    //   options: { cellRenderer: cellRendererTypes.capitalizedString },
    // },
    // {
    //   name: 'actions',
    //   label: intl.formatMessage({ id: 'ACTIONS' }),
    //   options: {
    //     customBodyRender: (_, field) => (
    //       <ActionIcon
    //         variant="edit"
    //         onClick={() => {              
    //             setEditField(field);             
              
    //         }}
    //       />
    //     ),
    //   },
    // },
  ];

  const configurableFields = [
    {
      id: 'zebra1',
      backendPath: 'site.species',
      labelId: 'ZEBRA1',
      // type: categoryTypes.sighting,
      prefix: 'ABC',
      count: 124,
      Editor: SpeciesEditor,
    },
    // {
    //   id: 'prefix',
    //   backendPath: 'site.custom.regions',
    //   labelId: 'REGION',
    //   type: categoryTypes.sighting,
    //   Editor: SpeciesEditor,
    // },
    // {
    //   id: 'count',
    //   backendPath: 'relationship_type_roles',
    //   labelId: 'RELATIONSHIP',
    //   type: categoryTypes.individual,
    //   Editor: SpeciesEditor,
    // },
    // {
    //   id: 'actions',
    //   backendPath: 'social_group_roles',
    //   labelId: 'SOCIAL_GROUPS',
    //   type: categoryTypes.individual,
    //   Editor: SpeciesEditor,
    // },
  ];

  const speciesTableData = get(siteSettings, ['site.species', 'value'], []);
  console.log(speciesTableData);
  const speciesTableRows = speciesTableData.map((species) => {
    return {
      id: species.id,
      labelId: species.id,
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
        {editField && (
        <editField.Editor
          // siteSettings={siteSettings}
          // formSettings={formSettings}
          // setFormSettings={setFormSettings}
          onClose={() => {
            setFormSettings(getInitialFormState(siteSettings));
            onCloseEditor();
          }}
          // onSubmit={async () => {
          //   if (editField?.id === 'region') {
          //     const response = await putSiteSetting({
          //       property: editField.backendPath,
          //       data: formSettings.regions,
          //     });
          //     if (response?.status === 200) onCloseEditor();
          //   }
          //   if (editField?.id === 'species') {
          //     const response = await putSiteSetting({
          //       property: editField.backendPath,
          //       data: formSettings.species,
          //     });
          //     if (response?.status === 200) onCloseEditor();
          //   }
          //   if (editField?.id === 'relationship') {
          //     const response = await putSiteSetting({
          //       property: editField.backendPath,
          //       data: formSettings.relationships,
          //     });
          //     if (response?.status === 200) onCloseEditor();
          //   }
          //   if (editField?.id === 'socialGroups') {
          //     const response = await putSiteSetting({
          //       property: editField.backendPath,
          //       data: formSettings.socialGroups,
          //     });
          //     if (response?.status === 200) onCloseEditor();
          //   }
          // }}
        >
          {error ? (
            <CustomAlert
              style={{ margin: '20px 0 12px 0', maxWidth: 600 }}
              severity="error"
              description={error}
            />
          ) : null}
        </editField.Editor>
      )}
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
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={configurableFields}
        tableContainerStyles={{ maxHeight: 300 }}
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
