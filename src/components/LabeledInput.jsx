import React from 'react';
import { get } from 'lodash-es';
import inputMap from './inputs/inputMap';

export default function LabeledInput(props) {
  const { schema } = props;
  console.log('deleteMe props in LabeledInput are: ');
  console.log(props);

  const InputComponent =
    get(inputMap, schema.fieldType) ||
    get(inputMap, schema.displayType);
  if (InputComponent) return <InputComponent {...props} />;

  return <span>Unidentified flying input</span>;
}
