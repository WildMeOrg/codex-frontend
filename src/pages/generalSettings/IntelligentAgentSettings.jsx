import React from 'react';

import { get, reduce } from 'lodash-es';

import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
// import Text from '../../components/Text'; //TODO deleteMe
import SettingsTextInput from '../../components/settings/SettingsTextInput';

// const intelligentAgentSettingsFields = reduce(
//   intelligentAgentSchema,
//   (memo, intelligentAgent) => {
//     // const platformName = get(Object.keys(intelligentAgent), [0]);
//     const currentPlatformFields = get(
//       intelligentAgent,
//       ['data', 'fields'],
//       [],
//     );
//     const platformValues = Object.values(currentPlatformFields).map(
//       entry => get(entry, 'label'),
//     );
//     console.log('deleteMe platformValues are: ');
//     console.log(platformValues);

//     return [...memo, ...platformValues];
//   },
//   [],
// );

export default function IntelligentAgentSettings({
  intelligentAgentSettingsFields,
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
    console.log('deleteMe currentPlatformEnablingField is: ');
    console.log(currentPlatformEnablingField);

    console.log(
      'deleteMe get(currentValues, currentPlatformEnablingField) is: ',
    );
    console.log(get(currentValues, currentPlatformEnablingField));

    // TODO maybe change if this becomes boolean from the BE instead of string
    const isCurrentPlatformEnabled = get(
      currentValues,
      currentPlatformEnablingField,
      false,
    );

    const noCredsMissing =
      intelligentAgentSettingsFields.filter(
        currentField => get(currentValues, currentField) === '',
      ).length === 0;
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
        const settingKey = get(currentField, 'label');
        console.log('deleteMe settingKey is: ');
        console.log(settingKey);
        const skipDescription = get(
          currentField,
          'skipDescription',
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
    } else {
      console.log('deleteMe got here a2');
      console.log('deleteMe intelligentAgentSettingsFields are: ');
      console.log(intelligentAgentSettingsFields);

      // TODO set all other platformField values to "", but figure out a way to do this without making React mad
      const fieldsThatShouldBeEmptyAreNot =
        intelligentAgentSettingsFields.filter(
          currentField =>
            get(currentValues, currentField) !== '' &&
            currentField !== currentPlatformEnablingField,
        ).length > 0;
      console.log('deleteMe fieldsThatShouldBeEmptyAreNot is: ');
      console.log(fieldsThatShouldBeEmptyAreNot);
      if (fieldsThatShouldBeEmptyAreNot) {
        const emptyFieldValues = reduce(
          intelligentAgentSettingsFields,
          (memo, field) => {
            if (field !== currentPlatformEnablingField) {
              console.log('deleteMe field is: ');
              console.log(field);
              const newKeyValPair = {};
              newKeyValPair[field] = '';
              console.log('newKeyValPair is: ');
              console.log(newKeyValPair);
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

      const onlyEnabledPlatformField = currentPlatformFields.find(
        currentField => {
          const settingKey = get(currentField, 'label');
          return settingKey === currentPlatformEnablingField;
        },
      );
      console.log('deleteMe onlyEnabledPlatformField is: ');
      console.log(onlyEnabledPlatformField);
      const settingKey = get(onlyEnabledPlatformField, 'label');
      const skipDescription = get(
        onlyEnabledPlatformField,
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
    }
  });
}
