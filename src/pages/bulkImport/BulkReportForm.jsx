import React, { useState, useEffect } from 'react';
import { FlatfileButton } from '@flatfile/react';
import { get } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CustomAlert from '../../components/Alert';

import queryKeys from '../../constants/queryKeys';
import usePostAssetGroup from '../../models/assetGroup/usePostAssetGroup';
import useSiteSettings from '../../models/site/useSiteSettings';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import useEncounterFieldSchemas from '../../models/encounter/useEncounterFieldSchemas';
import { flatfileKey } from '../../constants/apiKeys';
import LoadingScreen from '../../components/LoadingScreen';
import InputRow from '../../components/fields/edit/InputRow';
import Button from '../../components/Button';
import Text from '../../components/Text';

import BulkFieldBreakdown from './BulkFieldBreakdown';
import prepareAssetGroup from './utils/prepareAssetGroup';
import useBulkImportFields from './utils/useBulkImportFields';
import {
  validateMinMax,
  validateIndividualNames,
  validateAssetStrings,
} from './utils/flatfileValidators';

async function onRecordChange(record, recordIndex, filenames) {
  let messages = validateMinMax(record);

  const firstName = record?.firstName;
  if (firstName) {
    try {
      const nameValidationResponse = await validateIndividualNames([
        [firstName, recordIndex],
      ]);
      const nameMessage = get(nameValidationResponse, [0, 0]);

      if (nameMessage) {
        messages = {
          ...messages,
          firstName: nameMessage,
        };
      }
    } catch (e) {
      console.error(
        `Error validating individual name "${firstName}" at ${recordIndex}`,
        e,
      );
    }
  }

  const assetString = record?.assetReferences;
  if (assetString) {
    const assetValidationResponse = validateAssetStrings(filenames, [
      [assetString, recordIndex],
    ]);
    const assetMessage = get(assetValidationResponse, [0, 0]);
    if (assetMessage) {
      messages = { ...messages, assetReferences: assetMessage };
    }
  }

  return messages;
}

function onRecordInit(record) {
  return validateMinMax(record);
}

export default function BulkReportForm({ assetReferences }) {
  const theme = useTheme();
  const history = useHistory();
  const {
    data: siteSettingsData,
    siteSettingsVersion,
  } = useSiteSettings();
  const [sightingData, setSightingData] = useState(null);
  const [detectionModel, setDetectionModel] = useState('');
  const queryClient = useQueryClient();
  const [
    everythingReadyForFlatfile,
    setEverythingReadyForFlatfile,
  ] = useState(false);

  const { postAssetGroup, loading, error } = usePostAssetGroup();

  const {
    numEncounterFieldsForFlatFile,
    numSightingFieldsForFlatFile,
    availableFields,
  } = useBulkImportFields();
  console.log('deleteMe availableFields are: ');
  console.log(availableFields);
  const sightingFieldSchemas = useSightingFieldSchemas();
  const encounterFieldSchemas = useEncounterFieldSchemas();

  const recaptchaPublicKey = get(siteSettingsData, [
    'recaptchaPublicKey',
    'value',
  ]);

  useEffect(
    () => {
      if (
        recaptchaPublicKey &&
        !document.getElementById('recaptcha-script')
      ) {
        const recaptchaApiUrl = `https://www.google.com/recaptcha/api.js?render=${recaptchaPublicKey}`;
        const recaptchaScript = document.createElement('script');
        recaptchaScript.src = recaptchaApiUrl;
        recaptchaScript.id = 'recaptcha-script';
        document.head.appendChild(recaptchaScript);
      }
    },
    [recaptchaPublicKey],
  );

  const detectionModelField = sightingFieldSchemas.find(
    schema => schema.name === 'speciesDetectionModel',
  );
  console.log('deleteMe detectionModelField is: ');
  console.log(detectionModelField);

  useEffect(
    () => {
      if (
        numEncounterFieldsForFlatFile > 0 &&
        numSightingFieldsForFlatFile > 0
      ) {
        // wait for these to become non-zero to be confident that availableFields is fully populated before sending off to FlatFile
        setEverythingReadyForFlatfile(true);
      }
    },
    [encounterFieldSchemas, sightingFieldSchemas],
  );

  if (!everythingReadyForFlatfile) return <LoadingScreen />;

  const safeAssetReferences = assetReferences || [];
  const filenames = safeAssetReferences.map(a => a?.path);

  return (
    <>
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
            licenseKey={flatfileKey}
            customer={{ userId: 'dev' }}
            settings={{
              devMode: __DEV__,
              managed: true,
              disableManualInput: true,
              title: 'Import sightings data',
              type: 'bulk_import',
              fields: availableFields,
              styleOverrides: {
                primaryButtonColor: theme.palette.primary.main,
              },
            }}
            onRecordInit={onRecordInit}
            onRecordChange={(record, recordIndex) =>
              onRecordChange(record, recordIndex, filenames)
            }
            onData={async results => {
              console.log(
                'deleteMe results in bulk report form are: ',
              );
              console.log(results);
              debugger;
              setSightingData(results.data);
            }}
            fieldHooks={{
              firstName: async values => {
                try {
                  return await validateIndividualNames(values);
                } catch (e) {
                  console.error(
                    'Error validating individual names: ',
                    e,
                  );
                  return [];
                }
              },
              assetReferences: assetStringInputs =>
                validateAssetStrings(filenames, assetStringInputs),
            }}
            render={(importer, launch) => (
              <Button
                style={{ width: 260 }}
                display="primary"
                onClick={launch}
                id="UPLOAD_SPREADSHEET"
              />
            )}
          />
          {sightingData ? (
            <Text
              id="ENCOUNTERS_IMPORTED_COUNT"
              values={{ encounterCount: sightingData.length }}
              variant="body2"
              style={{ margin: '8px 0 8px 4px' }}
            />
          ) : null}

          {detectionModelField && (
            <InputRow schema={detectionModelField}>
              <detectionModelField.editComponent
                schema={detectionModelField}
                value={detectionModel}
                onChange={value => {
                  setDetectionModel(value);
                }}
                minimalLabels
              />
            </InputRow>
          )}
        </Paper>
      </Grid>

      {error && (
        <Grid style={{ marginTop: 12 }} item>
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            {error}
          </CustomAlert>
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
            const sightings = prepareAssetGroup(
              sightingData,
              assetReferences,
            );
            console.log('deleteMe sightings are: ');
            console.log(sightings);

            const grecaptchaReady = new Promise(resolve => {
              window.grecaptcha.ready(() => {
                resolve();
              });
            });

            await grecaptchaReady;

            if (window.grecaptcha) {
              const token = await window.grecaptcha.execute(
                recaptchaPublicKey,
                { action: 'submit' },
              );

              const assetGroupData = await postAssetGroup({
                description: 'Bulk import from user',
                uploadType: 'bulk',
                token: token,
                speciesDetectionModel: [detectionModel || null],
                transactionId: get(assetReferences, [
                  0,
                  'transactionId',
                ]),
                sightings,
              });
              const assetGroupId = get(assetGroupData, 'guid');
              if (assetGroupId) {
                history.push(`/bulk-import/success/${assetGroupId}`);
                queryClient.invalidateQueries(queryKeys.me);
              }
            }
          }}
          style={{ width: 200 }}
          loading={loading}
          display="primary"
          disabled={!sightingData}
          id="REPORT_SIGHTINGS"
        />
      </Grid>
    </>
  );
}
