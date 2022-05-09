import React from 'react';

import viewpointChoices from '../../../constants/viewpoints';
import Text from '../../Text';

export default function ViewpointRenderer({ value }) {
  const matchingViewpoint = viewpointChoices.find(
    choice => choice.value === value,
  );
  const viewpointLabelId = matchingViewpoint?.labelId;
  return (
    <Text variant="body2" id={viewpointLabelId}>
      {value}
    </Text>
  );
}
