import React from 'react';

import { get, reduce } from 'lodash-es';

import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
// import Text from '../../components/Text'; //TODO deleteMe
import SettingsTextInput from '../../components/settings/SettingsTextInput';

export default function IntelligentAgentSettings({
  currentValues,
  setCurrentValues,
  siteSettings,
  setAllValid,
}) {
  console.log('deleteMe siteSettings are: ');
  console.log(siteSettings);
  const intelligentAgentSettingsFields = reduce(
    intelligentAgentSchema,
    (memo, intelligentAgent) => {
      const platformName = get(Object.keys(intelligentAgent), [0]);
      const currentPlatformFields = get(
        intelligentAgent,
        [platformName, 'fields'],
        [],
      );
      return [...memo, ...Object.keys(currentPlatformFields)];
    },
    [],
  );

  //TODO deleteMe
  setAllValid(true);

  console.log('deleteMe intelligentAgentSettingsFields are: ');
  console.log(intelligentAgentSettingsFields);

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
  const allValid =
    twitterBotDisabled || twitterBotEnabledAndNoCredsMissing;

  //TODO deleteMe comment me back in
  //   setAllValid(allValid);

  return intelligentAgentSchema.map(intelligentAgent => {
    const platformName = get(Object.keys(intelligentAgent), [0]);
    const currentPlatformFields = get(
      intelligentAgent,
      [platformName, 'fields'],
      [],
    );
    const currentPlatformEnablingField = get(intelligentAgent, [
      platformName,
      'enablingField',
    ]);
    // return <Text>Test</Text>;
    //   if (currentPlatformEnablingField) {
    //     //TODO return a check whether it's true and then stuff
    //     return (
    //       {get(currentValues, currentPlatformEnablingField) === 'true' && (
    //         {currentPlatformFields.map(currentField =>{
    //           return (
    //             <SettingsTextInput
    //             key={get(Object.keys(currentField),[0])}
    //       settingKey={get(Object.keys(currentField),[0])}
    //       customFieldCategories={[]}
    //       currentValues={currentValues}
    //       setCurrentValues={setCurrentValues}
    //       siteSettings={siteSettings}
    //       skipDescription={get(Object.values(currentField),'skipDescription', false)}
    //     />
    //           );
    //         })}
    //       )}
    //     );
    //   } else {
    return currentPlatformFields.map(currentField => {
      return (
        <SettingsTextInput
          key={get(Object.keys(currentField), [0])}
          settingKey={get(Object.keys(currentField), [0])}
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
          skipDescription={get(
            Object.values(currentField),
            'skipDescription',
            false,
          )}
        />
      );
    });
    //   }
  });
}
