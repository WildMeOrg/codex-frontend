import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';

import usePutSiteSettings from '../../../models/site/usePutSiteSettings';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import categoryTypes from '../../../constants/categoryTypes';
import {
  RegionEditor,
  SpeciesEditor,
  RelationshipEditor,
} from './defaultFieldComponents/Editors';

const configurableFields = [
  {
    id: 'species',
    backendPath: 'site.general.species',
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
    backendPath: 'site.general.relationships',
    labelId: 'RELATIONSHIP',
    type: categoryTypes.individual,
    Editor: RelationshipEditor,
  },
];

export default function DefaultFieldTable({ siteSettings }) {
  const intl = useIntl();
  const [formSettings, setFormSettings] = useState(null);
  const [editField, setEditField] = useState(null);
  const { putSiteSetting, error, setError } = usePutSiteSettings();

  useEffect(
    () => {
      const regions = get(siteSettings, [
        'site.custom.regions',
        'value',
      ]);
      const species = get(
        siteSettings,
        ['site.general.species', 'value'],
        [],
      );
      const relationships = get(
        siteSettings,
        ['site.general.relationships', 'value'],
        [],
      );
      setFormSettings({ regions, species, relationships });
    },
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
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, field) => (
          <Tooltip title={intl.formatMessage({ id: 'EDIT' })}>
            <IconButton
              onClick={() => {
                setEditField(field);
              }}
              aria-label={intl.formatMessage({ id: 'EDIT' })}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
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
          formSettings={formSettings}
          setFormSettings={setFormSettings}
          onClose={onCloseEditor}
          onSubmit={() => {
            if (editField.id === 'region') {
              putSiteSetting(
                editField.backendPath,
                formSettings.regions,
              ).then(success => {
                if (success) onCloseEditor();
              });
            }
          }}
        >
          {error ? (
            <Alert
              style={{ margin: '20px 0 12px 0', maxWidth: 600 }}
              severity="error"
            >
              {error}
            </Alert>
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
        <Typography variant="h5" component="h5">
          <FormattedMessage id="CONFIGURABLE_DEFAULT_FIELDS" />
        </Typography>
      </div>
      <Typography variant="caption" style={{ marginBottom: 12 }}>
        <FormattedMessage id="CONFIGURABLE_DEFAULT_FIELDS_DESCRIPTION" />
      </Typography>
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
