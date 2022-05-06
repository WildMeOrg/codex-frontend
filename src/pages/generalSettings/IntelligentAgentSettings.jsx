import React from 'react';

import { get } from 'lodash-es';

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
  // const intelligentAgentSettingsFields = reduce(
  //   intelligentAgentSchema,
  //   (memo, intelligentAgent) => {
  //     const platformName = get(Object.keys(intelligentAgent), [0]);
  //     const currentPlatformFields = get(
  //       intelligentAgent,
  //       [platformName, 'fields'],
  //       [],
  //     );
  //     const platformValues = Object.values(currentPlatformFields);
  //     console.log('deleteMe platformValues are: ');
  //     console.log(platformValues);

  //     return [...memo, ...Object.keys(platformValues)];
  //   },
  //   [],
  // );
  // console.log('deleteMe intelligentAgentSettingsFields are: ');
  // console.log(intelligentAgentSettingsFields);

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
  const allValid =
    twitterBotDisabled || twitterBotEnabledAndNoCredsMissing;

  //TODO deleteMe comment me back in
  //   setAllValid(allValid);

  return intelligentAgentSchema.map(intelligentAgent => {
    // console.log('deleteMe intelligentAgent is: ');
    // console.log(intelligentAgent);
    const platformName = get(Object.keys(intelligentAgent), [0]);
    // console.log('deleteMe platformName is: ');
    // console.log(platformName);
    const currentPlatformFields = get(
      intelligentAgent,
      [platformName, 'fields'],
      [],
    );
    console.log('deleteMe currentPlatformFields are: ');
    console.log(currentPlatformFields);
    const currentPlatformEnablingField = get(intelligentAgent, [
      platformName,
      'enablingField',
    ]);
    // console.log('deleteMe currentPlatformEnablingField is: ');
    // console.log(currentPlatformEnablingField);
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
      console.log('deleteMe currentField is: ');
      console.log(currentField);
      const settingKey = get(Object.keys(currentField), [0]);
      const skipDescription = get(
        currentField,
        [settingKey, 'skipDescription'],
        false,
      );
      console.log('deleteMe skipDescription is: ');
      console.log(skipDescription);
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
    //   }
  });
}
