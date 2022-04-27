import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { flatten, get } from 'lodash-es';
import Text from '../../Text';

function findLocationObject(searchId, locationList) {
  if (!locationList || !searchId || locationList.length === 0) {
    return null;
  }
  const match = locationList.find(
    location => location.id === searchId,
  );
  if (match) return match;
  const nextLevelLocations = locationList
    .map(location => location.locationID)
    .filter(a => a);
  const flatNextLevelLocations = flatten(nextLevelLocations);
  return findLocationObject(searchId, flatNextLevelLocations);
}

export default function LocationIdViewer({ value, choices, variant = "body2" })
{
  const intl = useIntl();
  let locationIdLabel = useMemo(
    () => {
      const locationObject = findLocationObject(value, choices);
      return get(
        locationObject,
        'name',
        intl.formatMessage({ id: 'REGION_LABEL_NOT_FOUND' }),
      );
    },
    [value, get(choices, 'length', 0)],
  );

  if (value === null || value === undefined) {
    locationIdLabel = intl.formatMessage({ id: 'REGION_NOT_SET' });
  }

  return (
    <Text component="span" variant={variant}>
      {locationIdLabel}
    </Text>
  );
}
