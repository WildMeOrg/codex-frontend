import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import CustomAlert from '../../../components/Alert';

import usePutSiteSetting from '../../../models/site/usePutSiteSetting';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../../components/ActionIcon';
import Text from '../../../components/Text';
import categoryTypes from '../../../constants/categoryTypes';
import { RegionEditor } from './defaultFieldComponents/Editors';
import RelationshipEditor from './defaultFieldComponents/RelationshipEditor';
import SocialGroupsEditor from './defaultFieldComponents/SocialGroupsEditor';
import SpeciesEditor from './defaultFieldComponents/SpeciesEditor';
import { cellRendererTypes } from '../../../components/dataDisplays/cellRenderers';

const configurableFields = [
  {
    id: 'species',
    backendPath: 'site.species',
    labelId: 'SPECIES',
    type: categoryTypes.sighting,
    Editor: SpeciesEditor,
  },
  {
    id: 'region',
    backendPath: 'site.custom.regions',
    labelId: 'REGION',
    type: categoryTypes.sighting,
    Editor: RegionEditor,
  },
  {
    id: 'relationship',
    backendPath: 'relationship_type_roles',
    labelId: 'RELATIONSHIP',
    type: categoryTypes.individual,
    Editor: RelationshipEditor,
  },
  {
    id: 'socialGroups',
    backendPath: 'social_group_roles',
    labelId: 'SOCIAL_GROUPS',
    type: categoryTypes.individual,
    Editor: SocialGroupsEditor,
  },
];

function getInitialFormState(siteSettings) {
  const regions = get(
    siteSettings,
    ['site.custom.regions', 'value'],
    [],
  );
  const species = get(siteSettings, ['site.species', 'value'], []);
  const relationships = get(
    siteSettings,
    ['relationship_type_roles', 'value'],
    [],
  );
  const socialGroups = get(
    siteSettings,
    ['social_group_roles', 'value'],
    [],
  );

  return { regions, species, relationships, socialGroups };
}

export default function DefaultFieldTable({ siteSettings }) {
  const intl = useIntl();
  const [formSettings, setFormSettings] = useState(null);
  const [editField, setEditField] = useState(null);
  const {
    mutate: putSiteSetting,
    error,
    clearError,
  } = usePutSiteSetting();

  useEffect(
    () => setFormSettings(getInitialFormState(siteSettings)),
    [siteSettings],
  );

  const tableColumns = [
    {
      name: 'labelId',
      label: intl.formatMessage({ id: 'LABEL' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} />
        ),
      },
    },
    {
      name: 'type',
      label: intl.formatMessage({ id: 'TYPE' }),
      options: { cellRenderer: cellRendererTypes.capitalizedString },
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, field) => (
          <ActionIcon
            variant="edit"
            onClick={() => {
              setEditField(field);
            }}
          />
        ),
      },
    },
  ];

  const onCloseEditor = () => {
    clearError();
    setEditField(null);
  };

  return (
    <Grid item>
      {editField && (
        <editField.Editor
          siteSettings={siteSettings}
          formSettings={formSettings}
          setFormSettings={setFormSettings}
          onClose={() => {
            setFormSettings(getInitialFormState(siteSettings));
            onCloseEditor();
          }}
          onSubmit={async () => {
            if (editField?.id === 'region') {
              const response = await putSiteSetting({
                property: editField.backendPath,
                data: formSettings.regions,
              });
              if (response?.status === 200) onCloseEditor();
            }
            if (editField?.id === 'species') {
              const response = await putSiteSetting({
                property: editField.backendPath,
                data: formSettings.species,
              });
              if (response?.status === 200) onCloseEditor();
            }
            if (editField?.id === 'relationship') {
              const response = await putSiteSetting({
                property: editField.backendPath,
                data: formSettings.relationships,
              });
              if (response?.status === 200) onCloseEditor();
            }
            if (editField?.id === 'socialGroups') {
              const response = await putSiteSetting({
                property: editField.backendPath,
                data: formSettings.socialGroups,
              });
              if (response?.status === 200) onCloseEditor();
            }
          }}
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <Text
          variant="h5"
          component="h5"
          id="CONFIGURABLE_DEFAULT_FIELDS"
        />
      </div>
      <Text
        variant="caption"
        style={{ marginBottom: 12 }}
        id="CONFIGURABLE_DEFAULT_FIELDS_DESCRIPTION"
      />
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={configurableFields}
        tableContainerStyles={{ maxHeight: 300 }}
      />
    </Grid>
  );
}
