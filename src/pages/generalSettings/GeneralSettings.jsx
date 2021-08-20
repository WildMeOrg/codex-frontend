import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';
import usePostSettingsAsset from '../../models/site/usePostSettingsAsset';

import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import LabeledInput from '../../components/LabeledInput';
import Text from '../../components/Text';
import SettingsFileUpload from '../../components/SettingsFileUpload';

const customFields = {
  sighting: 'site.custom.customFields.Occurrence',
  encounter: 'site.custom.customFields.Encounter',
  individual: 'site.custom.customFields.MarkedIndividual',
};

const generalSettingsFields = [
  'site.name',
  'site.private',
  'site.look.themeColor',
  'site.general.photoGuidelinesUrl',
  'site.links.facebookLink',
  'site.links.instagramLink',
  'site.links.twitterLink',
];

export default function GeneralSettings() {
  const siteSettings = useSiteSettings();
  const {
    putSiteSettings,
    error,
    setError,
    success,
    setSuccess,
  } = usePutSiteSettings();

  const {
    postSettingsAsset,
    error: settingsAssetPostError,
  } = usePostSettingsAsset();

  const intl = useIntl();

  const documentTitle = intl.formatMessage({
    id: 'GENERAL_SETTINGS',
  });
  useDocumentTitle(documentTitle);

  const [currentValues, setCurrentValues] = useState(null);
  const [logoPostData, setLogoPostData] = useState(null);

  const edmValues = generalSettingsFields.map(fieldKey =>
    get(siteSettings, ['data', fieldKey, 'value']),
  );
  useEffect(() => {
    setCurrentValues(zipObject(generalSettingsFields, edmValues));
  }, edmValues);

  return (
    <MainColumn>
      <Text
        variant="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="GENERAL_SETTINGS"
      />
      <ButtonLink
        href="/admin"
        style={{ marginTop: 8, width: 'fit-content' }}
        display="back"
        id="BACK"
      />
      <Grid
        container
        direction="column"
        style={{ marginTop: 20, padding: 20 }}
      >
        {generalSettingsFields.map(settingKey => {
          const matchingSetting = get(siteSettings, [
            'data',
            settingKey,
          ]);
          const valueIsDefined =
            get(currentValues, settingKey, undefined) !== undefined;

          return (
            <Grid
              key={settingKey}
              item
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  minWidth: '35%',
                }}
              >
                {matchingSetting && valueIsDefined ? (
                  <>
                    <Text
                      style={{
                        marginTop: 20,
                      }}
                      variant="subtitle1"
                    >
                      <FormattedMessage
                        id={matchingSetting.labelId}
                      />
                      {matchingSetting.required && ' *'}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                      }}
                      variant="body2"
                      id={matchingSetting.descriptionId}
                    />
                  </>
                ) : (
                  <>
                    <Skeleton
                      variant="rect"
                      width="40%"
                      height={30}
                      style={{ marginTop: 20 }}
                    />
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height={48}
                      style={{ marginTop: 4 }}
                    />
                  </>
                )}
              </div>
              <div
                style={{
                  marginTop: 24,
                  marginLeft: 80,
                  width: 400,
                  minWidth: 400,
                }}
              >
                {matchingSetting && valueIsDefined ? (
                  <LabeledInput
                    schema={{
                      labelId: matchingSetting.labelId,
                      descriptionId: matchingSetting.descriptionId,
                      fieldType: matchingSetting.displayType,
                    }}
                    disabled={!matchingSetting.settable}
                    minimalLabels
                    value={currentValues[settingKey]}
                    onChange={value => {
                      setCurrentValues({
                        ...currentValues,
                        [settingKey]: value,
                      });
                    }}
                  />
                ) : (
                  <Skeleton variant="rect" width={280} height={30} />
                )}
              </div>
            </Grid>
          );
        })}
        <SettingsFileUpload
          labelId="LOGO"
          descriptionId="LOGO_DESCRIPTION"
          changeId="CHANGE_LOGO"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="logo"
          onSetPostData={setLogoPostData}
        />
        <Grid
          item
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 28,
          }}
        >
          {Boolean(error) && (
            <CustomAlert
              onClose={() => setError(null)}
              severity="error"
              titleId="SUBMISSION_ERROR"
            >
              {error}
            </CustomAlert>
          )}
          {success && (
            <CustomAlert
              onClose={() => setSuccess(false)}
              severity="success"
              titleId="SUCCESS"
              descriptionId="CHANGES_SAVED"
            />
          )}
          <Button
            onClick={() => {
              /* Prepare custom fields objects to send to backend */
              Object.values(customFields).forEach(customFieldKey => {
                const fields = currentValues[customFieldKey];
                if (!fields) {
                  currentValues[customFieldKey] = { definitions: [] };
                } else {
                  const newFields = get(
                    fields,
                    'definitions',
                    [],
                  ).map(field => {
                    const choices = get(field, ['schema', 'choices']);
                    if (!choices) return field;
                    return {
                      ...field,
                      options: choices.map(choice => choice.label),
                    };
                  });

                  currentValues[customFieldKey] = {
                    definitions: newFields,
                  };
                }
              });
              putSiteSettings(currentValues);
              if (logoPostData) postSettingsAsset(logoPostData);
            }}
            style={{ marginTop: 12 }}
            display="primary"
          >
            <FormattedMessage id="SAVE_CHANGES" />
          </Button>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
