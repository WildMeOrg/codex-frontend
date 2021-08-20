import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import usePostSettingsAsset from '../../models/site/usePostSettingsAsset';
import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';
import LabeledInput from '../../components/LabeledInput';
import SettingsFileUpload from '../../components/SettingsFileUpload';

const customFields = {
  sighting: 'site.custom.customFields.Occurrence',
  encounter: 'site.custom.customFields.Encounter',
  individual: 'site.custom.customFields.MarkedIndividual',
};

const newSettingFields = [
  'site.general.customCardLine1',
  'site.general.customCardLine2',
  'site.general.customCardButtonText',
  'site.general.tagline',
  'site.general.taglineSubtitle',
  'site.general.description',
  'site.general.helpDescription',
  'site.general.donationButtonUrl',
];

function SettingInput({ customFieldCategories, schema, ...rest }) {
  return <LabeledInput schema={schema} {...rest} />;
}

export default function SiteSettings() {
  const siteSettings = useSiteSettings();
  const {
    putSiteSettings,
    error: putSiteSettingsError,
    setError,
    success,
    setSuccess,
  } = usePutSiteSettings();

  const {
    postSettingsAsset,
    error: settingsAssetPostError,
  } = usePostSettingsAsset();

  const intl = useIntl();

  const documentTitle = intl.formatMessage({ id: 'SPLASH_PAGE' });
  useDocumentTitle(documentTitle);

  const [currentValues, setCurrentValues] = useState(null);
  const [splashVideoPostData, setSplashVideoPostData] = useState(
    null,
  );
  const [splashImagePostData, setSplashImagePostData] = useState(
    null,
  );
  const [
    customCardImagePostData,
    setCustomCardImagePostData,
  ] = useState(null);

  const edmValues = newSettingFields.map(fieldKey =>
    get(siteSettings, ['data', fieldKey, 'value']),
  );
  useEffect(() => {
    setCurrentValues(zipObject(newSettingFields, edmValues));
  }, edmValues);

  const customFieldCategories = get(
    siteSettings,
    ['data', 'site.custom.customFieldCategories', 'value'],
    [],
  );

  const error = putSiteSettingsError || settingsAssetPostError;

  return (
    <MainColumn>
      <Text
        variant="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="SPLASH_PAGE"
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
        <SettingsFileUpload
          labelId="SPLASH_IMAGE"
          descriptionId="SPLASH_IMAGE_DESCRIPTION"
          changeId="CHANGE_IMAGE"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="splashImage"
          onSetPostData={setSplashImagePostData}
        />
        <SettingsFileUpload
          labelId="SPLASH_VIDEO"
          descriptionId="SPLASH_VIDEO_DESCRIPTION"
          changeId="CHANGE_VIDEO"
          allowedFileTypes={['.webm', '.mp4']}
          settingName="splashVideo"
          onSetPostData={setSplashVideoPostData}
          variant="video"
        />
        <SettingsFileUpload
          labelId="CUSTOM_CARD_IMAGE"
          descriptionId="CUSTOM_CARD_IMAGE_DESCRIPTION"
          changeId="CHANGE_IMAGE"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="customCardImage"
          onSetPostData={setCustomCardImagePostData}
        />
        {newSettingFields.map(settingKey => {
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
                  <SettingInput
                    customFieldCategories={customFieldCategories}
                    schema={{
                      labelId: matchingSetting.labelId,
                      descriptionId: matchingSetting.descriptionId,
                      fieldType: matchingSetting.displayType,
                    }}
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
              description={error}
            />
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
              if (splashVideoPostData)
                postSettingsAsset(splashVideoPostData);
              if (splashImagePostData)
                postSettingsAsset(splashImagePostData);
              if (customCardImagePostData)
                postSettingsAsset(customCardImagePostData);
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
