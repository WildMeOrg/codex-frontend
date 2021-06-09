import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FlatfileButton } from '@flatfile/react';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import TermsAndConditionsDialog from '../../components/report/TermsAndConditionsDialog';
import Button from '../../components/Button';
import Text from '../../components/Text';
import usePostAssetGroup from '../../models/assetGroup/usePostAssetGroup';
import { flatfileKey } from '../../constants/apiKeys';
import InlineButton from '../../components/InlineButton';
import prepareAssetGroup from './utils/prepareAssetGroup';
import useBulkImportFields from './utils/useBulkImportFields';
import BulkFieldBreakdown from './BulkFieldBreakdown';

export default function ReportForm({ assetReferences }) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sightingData, setSightingData] = useState(null);

  const { postAssetGroup, loading } = usePostAssetGroup();

  const availableFields = useBulkImportFields();

  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <div style={{ marginLeft: 12 }}>
        <Text variant="h6" style={{ marginTop: 20 }}>
          Review available fields
        </Text>
      </div>
      <BulkFieldBreakdown availableFields={availableFields} />

      <Grid item style={{ marginTop: 12 }}>
        <div style={{ marginLeft: 12 }}>
          <Text variant="h6" style={{ marginTop: 20 }}>
            Import data
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
              fields: availableFields,
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
                Upload spreadsheet
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
