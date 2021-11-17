import React, { useMemo } from 'react';
import { flatten, get } from 'lodash-es';
import Text from '../../Text';

function findLocationObject(searchId, locationList) {
  if (locationList === [] || !locationList || !searchId) return null;
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

export default function LocationIdViewer({ value, choices }) {
  let locationIdLabel = useMemo(
    () => {
      const locationObject = findLocationObject(value, choices);
      return get(locationObject, 'name', 'Region label not found');
    },
    [value, get(choices, 'length', 0)],
  );

  if (value === null || value === undefined) {
    locationIdLabel = 'Region not set';
  }

  return (
    <Text component="span" variant="body2">
      {locationIdLabel}
    </Text>
  );
}
