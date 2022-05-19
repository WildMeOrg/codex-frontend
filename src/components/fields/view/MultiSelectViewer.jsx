import React from 'react';
import { get } from 'lodash-es';
import Text from '../../Text';

export default function MultiSelectViewer({
  value,
  schema,
  lookupKey = 'value',
  labelKey = 'label',
  defaultLabel = 'Option label not found',
}) {
  const { choices } = schema;
  const splitValues =
    typeof value === 'string' ? value.split(',') : value;
  // console.log('deleteMe choices in MultiSelectViewer are:');
  // console.log(choices);
  // console.log('deleteMe value in MultiSelectViewer is: ');
  // console.log(value);

  const selectedOptions = choices?.filter(choice =>
    splitValues?.find(v => choice[lookupKey] === v),
  );

  const selectedOptionLabels = selectedOptions.map(o =>
    get(o, labelKey, defaultLabel),
  );

  return (
    <Text component="span" variant="body2">
      {selectedOptionLabels.join(', ')}
    </Text>
  );
}
