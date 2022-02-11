import React from 'react';

import Text from '../../Text';
import { formatDate } from '../../../utils/formatters';

export default function DateRenderer({ datum }) {
  console.log('deleteMe got here c1 and datum is: ');
  console.log(datum);
  return <Text variant="body2">{formatDate('test')}</Text>;
}

// import React from 'react';

// import { capitalize } from 'lodash-es';

// import Text from '../../Text';

// export default function CapitalizedStringRenderer({ value }) {
//   return <Text variant="body2">{capitalize(value)}</Text>;
// }
