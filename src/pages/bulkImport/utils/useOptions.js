import { useMemo } from 'react';
import { get } from 'lodash-es';

import useSiteSettings from '../../../models/site/useSiteSettings';

export default function useOptions() {
  const {
    data,
    loading,
    error,
    siteSettingsVersion,
  } = useSiteSettings();
  if (loading || error) return null;

  const options = useMemo(
    () => {
      const regionOptions = get(
        data,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      );

      const backendSpeciesOptions = get(
        data,
        ['site.species', 'value'],
        [],
      );

      const speciesOptions = backendSpeciesOptions.map(o => ({
        label: get(o, 'scientificName'),
        value: get(o, 'id'),
        alternates: [...get(o, 'commonNames', []), get(o, 'itisTsn')],
      })).filter(o => o);

      return { regionOptions, speciesOptions };
    },
    [siteSettingsVersion],
  );

  console.log(options);
  return options;
}
