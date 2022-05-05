import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import Text from '../Text';
import LabeledInput from '../LabeledInput';

const SettingInput = function({
  customFieldCategories,
  schema,
  ...rest
}) {
  return <LabeledInput schema={schema} {...rest} />;
};

export default function SettingsTextInput({
  siteSettings,
  currentValues,
  setCurrentValues,
  customFieldCategories,
  settingKey,
  descriptionId = null,
}) {
  const matchingSetting = get(siteSettings, ['data', settingKey]);
  const matchingSettingSchema = get(matchingSetting, 'schema', {});
  const valueIsDefined =
    get(currentValues, settingKey, undefined) !== undefined;
  console.log('deleteMe matchingSetting.descriptionId is: ');
  console.log(matchingSetting?.descriptionId);
  console.log('deleteMe descriptionId is: ');
  console.log(descriptionId);
  const hasDescription =
    descriptionId || matchingSetting?.descriptionId;
  console.log('deleteMe hasDescription is: ');
  console.log(hasDescription);

  return (
    <Grid
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
            <Text style={{ marginTop: 20 }} variant="subtitle1">
              <FormattedMessage id={matchingSetting.labelId} />
              {matchingSetting.required && ' *'}
            </Text>
            {hasDescription && (
              <Text
                style={{ marginTop: 4 }}
                variant="body2"
                id={descriptionId || matchingSetting.descriptionId}
              />
            )}
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
              ...matchingSettingSchema,
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
}
