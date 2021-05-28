import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FlatfileButton } from '@flatfile/react';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import usePostAssetGroup from '../../models/assetGroup/usePostAssetGroup';
import { flatfileKey } from '../../constants/apiKeys';
import Button from '../../components/Button';
import Text from '../../components/Text';
import InlineButton from '../../components/InlineButton';
import prepareAssetGroup from './utils/prepareAssetGroup';
import useBulkImportFields from './utils/useBulkImportFields';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';

export default function BulkReport({ assetReferences }) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sightingData, setSightingData] = useState(null);

  const { postAssetGroup, loading } = usePostAssetGroup();

  const availableFields = useBulkImportFields();
  const [selectedFieldNames, setSelectedFieldNames] = useState(
    availableFields.map(f => f.key),
  );
  const selectedFields = availableFields.filter(f =>
    selectedFieldNames.includes(f.key),
  );

  console.log(assetReferences);
  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <div style={{ marginLeft: 12 }}>
        <Text variant="h6" style={{ marginTop: 20 }}>
          1. Select fields
        </Text>
      </div>
      <Paper
        elevation={2}
        style={{
          marginTop: 20,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
        }}
      >
        <Text
          variant="subtitle2"
          style={{ marginBottom: 12 }}
          id="CHOOSE_FIELDS_DESCRIPTION"
        />
        <FormControl component="fieldset">
          <FormGroup style={{ flexDirection: 'row' }}>
            {availableFields.map(field => {
              // if (field.required) return null; find flatfile analog?
              const selected = selectedFieldNames.includes(field.key);
              return (
                <FormControlLabel
                  key={field.name}
                  style={{ width: 200 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={selected}
                      onChange={() => {
                        if (selected) {
                          setSelectedFieldNames(
                            selectedFieldNames.filter(
                              name => name !== field.key,
                            ),
                          );
                        } else {
                          setSelectedFieldNames([
                            ...selectedFieldNames,
                            field.key,
                          ]);
                        }
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Text id={field.labelId}>{field.label}</Text>
                  }
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Paper>

      <Grid item style={{ marginTop: 20 }}>
        <div style={{ marginLeft: 12 }}>
          <Text variant="h6" style={{ marginTop: 20 }}>
            2. Upload data
          </Text>
        </div>
        <Paper
          elevation={2}
          style={{
            marginTop: 20,
            marginBottom: 32,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 12px',
          }}
        >
          <FlatfileButton
            devMode
            managed
            maxRecords={1000}
            licenseKey={flatfileKey}
            customer={{ userId: 'dev' }}
            settings={{
              disableManualInput: true,
              title: 'Import sightings data',
              type: 'bulk_import',
              fields: selectedFields,
              styleOverrides: {
                primaryButtonColor: theme.palette.primary.main,
              },
            }}
            onData={async results => {
              setSightingData(results.data);
            }}
            render={(importer, launch) => (
              <Button
                style={{ width: 260 }}
                display="primary"
                onClick={launch}
              >
                Import sightings data
              </Button>
            )}
          />
          {sightingData ? (
            <Text variant="body2" style={{ margin: '8px 0 8px 4px' }}>
              {`${sightingData.length} sightings imported.`}
            </Text>
          ) : null}
        </Paper>
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={() => {
                setAcceptedTerms(!acceptedTerms);
                if (!acceptedTerms && termsError)
                  setTermsError(false);
              }}
            />
          }
          label={
            <span>
              <FormattedMessage id="TERMS_CHECKBOX_1" />
              <InlineButton onClick={() => setDialogOpen(true)}>
                <FormattedMessage id="TERMS_CHECKBOX_2" />
              </InlineButton>
              <FormattedMessage id="END_OF_SENTENCE" />
            </span>
          }
        />
      </Grid>

      {termsError && (
        <Grid style={{ marginTop: 12 }} item>
          <Alert severity="error">
            <AlertTitle>
              <Text id="SUBMISSION_ERROR" />
            </AlertTitle>
            <Text variant="body2" id="TERMS_ERROR" />
          </Alert>
        </Grid>
      )}
      <Grid
        item
        style={{
          marginTop: 12,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={async () => {
            // check that terms and conditions were accepted
            if (acceptedTerms) {
              const sightings = prepareAssetGroup(
                sightingData,
                assetReferences,
              );
              const results = await postAssetGroup({
                description: 'horpdorp',
                bulkUpload: true,
                speciesDetectionModel: ['None'],
                transactionId: get(assetReferences, [
                  0,
                  'transactionId',
                ]),
                sightings,
              });
              console.log(results);
            } else {
              setTermsError(true);
            }
          }}
          style={{ width: 200 }}
          loading={loading}
          display="primary"
          disabled={!sightingData}
        >
          <FormattedMessage id="REPORT_SIGHTINGS" />
        </Button>
      </Grid>
    </>
  );
}
