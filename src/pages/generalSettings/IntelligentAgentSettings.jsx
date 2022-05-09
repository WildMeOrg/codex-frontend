import React from 'react';

import { FormattedMessage } from 'react-intl';
import { get, reduce } from 'lodash-es';

import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
import SettingsTextInput from '../../components/settings/SettingsTextInput';
import Text from '../../components/Text';
import DividerTitle from '../../components/DividerTitle';
import Link from '../../components/Link';

export default function IntelligentAgentSettings({
  intelligentAgentSettingsFields,
  currentValues,
  setCurrentValues,
  siteSettings,
  setAllValid,
}) {
  return intelligentAgentSchema.map(intelligentAgent => {
    const currentPlatformFields = get(
      intelligentAgent,
      ['data', 'fields'],
      [],
    );
    const currentPlatformEnablingField = get(intelligentAgent, [
      'data',
      'enablingField',
    ]);

    const isCurrentPlatformEnabled = get(
      currentValues,
      currentPlatformEnablingField,
      false,
    );

    const noCredsMissing =
      intelligentAgentSettingsFields.filter(
        currentField => get(currentValues, currentField) === '',
      ).length === 0;

    const allValid =
      !isCurrentPlatformEnabled ||
      (isCurrentPlatformEnabled && noCredsMissing);
    setAllValid(allValid);
    const onlyEnabledPlatformField = currentPlatformFields.find(
      currentField => {
        const settingKey = get(currentField, 'label');
        return settingKey === currentPlatformEnablingField;
      },
    );
    const enabledSettingKey = get(onlyEnabledPlatformField, 'label');
    const enabledSkipDescription = get(
      onlyEnabledPlatformField,
      'skipDescription',
      false,
    );

    if (isCurrentPlatformEnabled) {
      return (
        <>
          <SettingsTextInput
            key={enabledSettingKey}
            settingKey={enabledSettingKey}
            customFieldCategories={[]}
            currentValues={currentValues}
            setCurrentValues={setCurrentValues}
            siteSettings={siteSettings}
            skipDescription={enabledSkipDescription}
          />
          <DividerTitle
            titleId={get(intelligentAgent, 'dividerLabel')}
            style={{ marginTop: 32 }}
          />
          <Text
            style={{ marginTop: 20 }}
            variant="subtitle1"
            id={get(intelligentAgent, 'platformInformationLabel')}
          />
          <Text
            style={{ marginTop: 4 }}
            variant="body2"
            id={get(
              intelligentAgent,
              'platformInformationDescription',
            )}
            values={{
              documentationLink: (
                <Link
                  newTab
                  external
                  href={get(intelligentAgent, 'apiDocumentationUrl')}
                >
                  <FormattedMessage
                    id={get(
                      intelligentAgent,
                      'apiDocumentationUrlLabel',
                    )}
                  />
                </Link>
              ),
            }}
          >
            Description for stuff
          </Text>
          {currentPlatformFields
            .filter(
              field =>
                get(field, 'label') !== currentPlatformEnablingField,
            )
            .map(currentField => {
              const settingKey = get(currentField, 'label');
              const skipDescription = get(
                currentField,
                'skipDescription',
                false,
              );
              return (
                <SettingsTextInput
                  key={settingKey}
                  settingKey={settingKey}
                  customFieldCategories={[]}
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                  skipDescription={skipDescription}
                />
              );
            })}
        </>
      );
    } else {
      const fieldsThatShouldBeEmptyAreNot =
        intelligentAgentSettingsFields.filter(
          currentField =>
            get(currentValues, currentField) !== '' &&
            currentField !== currentPlatformEnablingField,
        ).length > 0;
      if (fieldsThatShouldBeEmptyAreNot) {
        const emptyFieldValues = reduce(
          intelligentAgentSettingsFields,
          (memo, field) => {
            if (field !== currentPlatformEnablingField) {
              const newKeyValPair = {};
              newKeyValPair[field] = '';
              return { ...memo, ...newKeyValPair };
            } else {
              return memo;
            }
          },
          {},
        );
        setCurrentValues({
          ...currentValues,
          ...emptyFieldValues,
        });
      }

      return (
        <SettingsTextInput
          key={enabledSettingKey}
          settingKey={enabledSettingKey}
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
          skipDescription={enabledSkipDescription}
        />
      );
    }
  });
}
