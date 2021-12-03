import { get } from 'lodash';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { formatDate } from '../../utils/formatters';
import MultiplePoints from '../maps/MultiplePoints';

export default function SightingMapView({ data }) {
  const intl = useIntl();
  const transformedData = data
    .filter(entry => get(entry, 'decimalLatitude'))
    .map(entry => {
      return {
        guid: get(entry, 'id'),
        text: intl.formatMessage(
          { id: 'ENTITY_HEADER_SIGHTING_DATE' },
          {
            date: formatDate(get(entry, 'startTime'), true),
          },
        ),
        lat: get(entry, 'decimalLatitude'),
        long: get(entry, 'decimalLongitude'),
      };
    });
  return (
    <div style={{ height: 280, marginTop: 4 }}>
      <MultiplePoints latLongLabelArr={transformedData} />
    </div>
  );
}
