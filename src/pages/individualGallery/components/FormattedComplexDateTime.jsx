import React from 'react';
import { get } from 'lodash-es';

import { formatDateCustom } from '../../../utils/formatters';
import timePrecisionMap from '../../../constants/timePrecisionMap';
import Text from '../../../components/Text';

export default function FormattedComplexDateTime({
  time,
  timeSpecificity,
  ...textProps
}) {
  const formatSpecification = get(
    timePrecisionMap,
    [timeSpecificity, 'prettyFormat'],
    timePrecisionMap.year.prettyFormat,
  );

  const formattedDate = time
    ? formatDateCustom(time, formatSpecification)
    : '';

  const labelProps = {};
  if (formattedDate) labelProps.children = formattedDate;
  else labelProps.id = 'UNKNOWN_ENCOUNTER_DATE';

  return <Text variant="inherit" {...labelProps} {...textProps} />;
}
