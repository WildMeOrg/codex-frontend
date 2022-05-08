import React from 'react';

import { get, reduce } from 'lodash-es';

import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
// import Text from '../../components/Text'; //TODO deleteMe
import SettingsTextInput from '../../components/settings/SettingsTextInput';

const intelligentAgentSettingsFields = reduce(
  intelligentAgentSchema,
  (memo, intelligentAgent) => {
    const platformName = get(Object.keys(intelligentAgent), [0]);
    const currentPlatformFields = get(
      intelligentAgent,
      [platformName, 'fields'],
      [],
    );
    const platformValues = Object.values(currentPlatformFields).map(
      entry => get(Object.keys(entry), [0]),
    );
    console.log('deleteMe platformValues are: ');
    console.log(platformValues);

    return [...memo, ...platformValues];
  },
  [],
);

export default function IntelligentAgentSettings({
  // intelligentAgentSettingsFields,
  currentValues,
  setCurrentValues,
  siteSettings,
  setAllValid,
}) {
  console.log('deleteMe siteSettings are: ');
  console.log(siteSettings);
  console.log(
    'deleteMe intelligentAgentSettingsFields in IntelligentAgentSettings are: ',
  );
  console.log(intelligentAgentSettingsFields);

  //TODO deleteMe
  setAllValid(true);

  // TODO generalize
  const twitterBotDisabled =
    get(currentValues, 'intelligent_agent_twitterbot_enabled') ===
    'false';
  // TODO generalize
  const twitterBotEnabledAndNoCredsMissing =
    get(currentValues, 'intelligent_agent_twitterbot_enabled') ===
      'true' &&
    get(
      currentValues,
      'intelligent_agent_twitterbot_access_token',
    ) !== '' &&
    get(
      currentValues,
      'intelligent_agent_twitterbot_access_token_secret',
    ) !== '' &&
    get(
      currentValues,
      'intelligent_agent_twitterbot_bearer_token',
    ) !== '' &&
    get(
      currentValues,
      'intelligent_agent_twitterbot_consumer_key',
    ) !== '' &&
    get(
      currentValues,
      'intelligent_agent_twitterbot_consumer_secret',
    ) !== '';

  //TODO deleteMe comment me back in
  //   setAllValid(allValid);

  return intelligentAgentSchema.map(intelligentAgent => {
    // const platformName = get(Object.keys(intelligentAgent), [0]);
    const currentPlatformFields = get(
      intelligentAgent,
      ['data', 'fields'],
      [],
    );
    const currentPlatformEnablingField = get(intelligentAgent, [
      'data',
      'enablingField',
    ]);

    console.log(
      'deleteMe get(currentValues, currentPlatformEnablingField) is: ',
    );
    console.log(get(currentValues, currentPlatformEnablingField));

    //TODO maybe change if this becomes boolean from the BE instead of string
    const isCurrentPlatformEnabled = get(
      currentValues,
      currentPlatformEnablingField,
      false,
    );

    const noCredsMissing =
      intelligentAgentSettingsFields.filter(currentField => {
        return get(currentValues, currentField) === '';
      }).length === 0;
    console.log('deleteMe noCredsMissing is: ');
    console.log(noCredsMissing);

    const allValid =
      !isCurrentPlatformEnabled ||
      (isCurrentPlatformEnabled && noCredsMissing);
    console.log('deleteMe allValid is: ');
    console.log(allValid);
    setAllValid(allValid);

    console.log('deleteMe isCurrentPlatformEnabled is: ');
    console.log(isCurrentPlatformEnabled);
    if (isCurrentPlatformEnabled) {
      console.log('deleteMe got here a1');
      return currentPlatformFields.map(currentField => {
        const settingKey = get(Object.keys(currentField), [0]);
        const skipDescription = get(
          currentField,
          [settingKey, 'skipDescription'],
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
      });
    } else {
      console.log('deleteMe got here a2');

      //TODO set all other platformField values to "", but figure out a way to do this without making React mad
      // const emptyFieldValues = reduce(
      //   intelligentAgentSettingsFields,
      //   (memo, field) => {
      //     let newKeyValPair = {};
      //     newKeyValPair[field] = '';
      //     return { ...memo, ...newKeyValPair };
      //   },
      // );
      // console.log('deleteMe emptyFieldValues are: ');
      // console.log(emptyFieldValues);
      // setCurrentValues({
      //   ...currentValues,
      //   ...emptyFieldValues,
      // });

      const onlyEnabledPlatformField = currentPlatformFields.find(
        currentField => {
          const settingKey = get(Object.keys(currentField), [0]);
          return settingKey === currentPlatformEnablingField;
        },
      );
      console.log('deleteMe onlyEnabledPlatformField is: ');
      console.log(onlyEnabledPlatformField);
      const settingKey = get(Object.keys(onlyEnabledPlatformField), [
        0,
      ]);
      const skipDescription = get(
        onlyEnabledPlatformField,
        [settingKey, 'skipDescription'],
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
    }
  });
}
