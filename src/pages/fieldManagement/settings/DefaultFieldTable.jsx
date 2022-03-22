import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get, reduce } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import CustomAlert from '../../../components/Alert';

import usePutSiteSettings from '../../../models/site/usePutSiteSettings';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../../components/ActionIcon';
import Text from '../../../components/Text';
import categoryTypes from '../../../constants/categoryTypes';
import {
  RegionEditor,
  RelationshipEditorWrapper,
} from './defaultFieldComponents/Editors';
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
    Editor: RelationshipEditorWrapper,
  },
];

function getInitialFormState(siteSettings) {
  const regions = get(siteSettings, ['site.custom.regions', 'value']);
  const species = get(siteSettings, ['site.species', 'value'], []);
  const relationships = get(
    siteSettings,
    ['relationship_type_roles', 'value'],
    [],
  );

  return { regions, species, relationships };
}

export default function DefaultFieldTable({
  siteSettings,
  siteSettingsVersion,
}) {
  const intl = useIntl();
  const [formSettings, setFormSettings] = useState(null);
  const [editField, setEditField] = useState(null);
  const { putSiteSetting, error, setError } = usePutSiteSettings();

  useEffect(
    () => setFormSettings(getInitialFormState(siteSettings)),
    [siteSettingsVersion],
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
    setError(null);
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
              const success = await putSiteSetting(
                editField.backendPath,
                formSettings.regions,
              );
              if (success) onCloseEditor();
            }
            if (editField?.id === 'species') {
              const success = await putSiteSetting(
                editField.backendPath,
                formSettings.species,
              );
              if (success) onCloseEditor();
            }
            if (editField?.id === 'relationship') {
              const newSettings = reduce(
                formSettings.relationships,
                (memo, currentRelationships, key) => {
                  const dedupedRelationships = currentRelationships.filter(
                    (entry, index) => {
                      return (
                        currentRelationships.indexOf(entry) === index
                      );
                    },
                  );
                  if (
                    currentRelationships.length >
                    dedupedRelationships.length
                  ) {
                    alert(
                      intl.formatMessage({
                        id:
                          'DUPLICATE_RELATIONSHIPS_FOUND_AND_REMOVED',
                      }),
                    );
                  }
                  let newRelationshipChunk = {};
                  newRelationshipChunk[key] = dedupedRelationships;
                  return { ...memo, ...newRelationshipChunk };
                },
                {},
              );
              let newSiteSettings = {};
              newSiteSettings['relationships'] = { ...newSettings };
              formSettings.relationships = newSiteSettings; // I know that this is bad practice, but just passing newSiteSettings below did not seem to do the trick, and I don't know why
              const success = await putSiteSetting(
                editField.backendPath,
                formSettings.relationships,
              );
              if (success) onCloseEditor();
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
      />
    </Grid>
  );
}
