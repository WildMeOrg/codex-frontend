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
import SpeciesEditor from './settings/defaultFieldComponents/SpeciesEditor';
import AddIcon from '@material-ui/icons/Add';
import PrefixEditor from './settings/defaultFieldComponents/PrefixEditor';

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
  const [addSpecies, setAddSpecies] = useState(false);

  useDocumentTitle('MANAGE_FIELDS');

  console.log('siteSettings', siteSettings);

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
    },
    
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, species) => (
          <ActionIcon
            variant="edit"
            onClick={() => {              
              console.log('species~~~~~~~~~~',species);  
              setEditField(species);           
              
            }}
          />
        ),
      },
    },
  ];
  
  const speciesTableData = get(siteSettings, ['site.species', 'value'], []);
  // const withSpeciesId = (WrappedComponent, s) => {
  //   console.log('s==============>>>>>>>>>>>>>>>>>',s);
  //   return (props) => <WrappedComponent {...props} species1={s} />;
  // };
  // let EditorWithSpeciesId = null;
  const speciesTableRows = speciesTableData.map((s) => {
    // console.log('s',s);
    // EditorWithSpeciesId = withSpeciesId(PrefixEditor, s);
    return {
      id: s.id,      
      labelId: `${s.scientificName}(${s.commonNames[0]})`,
      prefix: 'ABC',
      count: '123',
      // Editor: EditorWithSpeciesId
      Editor: () => <PrefixEditor species1={s} {...props} />
    }
  })

  console.log('speciesTableData',speciesTableData);
  console.log('speciesTableRows',speciesTableRows);
    
  if(species) {
    return  (
      <MainColumn>     
        {addSpecies && (
          <SpeciesEditor 
            onClose={() => {
              setAddSpecies(false);            
          }}
            data={siteSettings}
            siteSettings={siteSettings}
            />
        )}   
        {editField && (
        <PrefixEditor          
          onClose={() => {
            setEditField(null);
          }}          
          siteSettings={siteSettings}
          species1={editField}         
        />
      )}
      {/* {error ? (
            <CustomAlert
              style={{ margin: '20px 0 12px 0', maxWidth: 600 }}
              severity="error"
              description={error}
            />
          ) : null} */}
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
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 12,
        }}>
          <Button  
                id = "ADD_SPECIES"            
                size="small"
                display="panel"
                startIcon={<AddIcon />}   
                onClick={() => {
                  setAddSpecies(true);
                }}
              />
        </div>
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={speciesTableRows}
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
