import { get } from 'lodash';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { formatDate } from '../../utils/formatters';
import ManyPoints from '../maps/ManyPoints';
import Card from './Card';

export default function SightingMapViewCard({
  title,
  titleId = 'LOCATION',
  data,
}) {
  const intl = useIntl();
  const transformedData = data
    .filter(entry => get(entry, 'decimalLatitude', null) !== null)
    .map(entry => {
      return {
        guid: get(entry, 'id'),
        text: intl.formatMessage(
          { id: 'ENTITY_HEADER_SIGHTING_DATE' },
          {
            date: formatDate(get(entry, 'startTime'), true),
          },
        ),
        lat: get(entry, 'decimalLatitude', null),
        long: get(entry, 'decimalLongitude', null),
      };
    });
  return (
    <Card title={title} titleId={titleId}>
      <div style={{ height: 280, marginTop: 4 }}>
        <ManyPoints latLongLabelArr={transformedData} />
      </div>
    </Card>
  );
}
