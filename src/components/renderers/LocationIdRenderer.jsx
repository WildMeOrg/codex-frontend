import React from 'react';
import { get } from 'lodash-es';
import Text from '../Text';
import useSiteSettings from '../../models/site/useSiteSettings';

export default function LocationIdRenderer({ value }) {
  const { data: siteSettings } = useSiteSettings();
  const regionChoices = get(
    siteSettings,
    ['site.custom.regions', 'value', 'locationID'],
    [],
  );

  const location = regionChoices.find(r => r.id === value);
  const locationLabel = get(location, 'name', value);

  return (
    <Text component="span" variant="body2">
      {locationLabel}
    </Text>
  );
}
