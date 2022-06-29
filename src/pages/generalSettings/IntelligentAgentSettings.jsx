import React, { useEffect } from 'react';

import { FormattedMessage } from 'react-intl';
import { get, reduce, filter, every } from 'lodash-es';

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
  setIntelligentAgentFieldsValid,
}) {
  useEffect(() => {
    const agentSettingsValid = intelligentAgentSchema.map(
      intelligentAgent => {
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
        return (
          !isCurrentPlatformEnabled ||
          (isCurrentPlatformEnabled && noCredsMissing)
        );
      },
    );
    const allSettingsValid = every(agentSettingsValid, Boolean);
    setIntelligentAgentFieldsValid(allSettingsValid);
  }, [currentValues, intelligentAgentSettingsFields]);

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
    const enablingPlatformField = currentPlatformFields.find(
      currentField => {
        const settingKey = get(currentField, 'label');
        return settingKey === currentPlatformEnablingField;
      },
    );
    const enabledSettingKey = get(enablingPlatformField, 'label');
    const enabledSkipDescription = get(
      enablingPlatformField,
      'skipDescription',
      false,
    );

    if (isCurrentPlatformEnabled) {
      const nonEnablingFields = filter(
        currentPlatformFields,
        field => get(field, 'label') !== currentPlatformEnablingField,
        [],
      );
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
            key={get(intelligentAgent, 'dividerLabel')}
            titleId={get(intelligentAgent, 'dividerLabel')}
            style={{ marginTop: 32 }}
          />
          <Text
            key={get(intelligentAgent, 'platformInformationLabel')}
            style={{ marginTop: 20 }}
            variant="subtitle1"
            id={get(intelligentAgent, 'platformInformationLabel')}
          />
          <Text
            key={get(
              intelligentAgent,
              'platformInformationDescription',
            )}
            style={{ marginTop: 4 }}
            variant="body2"
            id={get(
              intelligentAgent,
              'platformInformationDescription',
            )}
            values={{
              documentationLink: (
                <Link
                  key={get(intelligentAgent, 'apiDocumentationUrl')}
                  newTab
                  external
                  href={get(intelligentAgent, 'apiDocumentationUrl')}
                >
                  <FormattedMessage
                    key={get(
                      intelligentAgent,
                      'apiDocumentationUrlLabel',
                    )}
                    id={get(
                      intelligentAgent,
                      'apiDocumentationUrlLabel',
                    )}
                  />
                </Link>
              ),
            }}
          />
          {nonEnablingFields.map(currentField => {
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
