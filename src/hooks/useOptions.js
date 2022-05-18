import { useMemo } from 'react';
import { get } from 'lodash-es';

import { flattenTree } from '../utils/treeUtils';
import useSiteSettings from '../models/site/useSiteSettings';

export default function useOptions() {
  const {
    data,
    loading,
    error,
    siteSettingsVersion,
  } = useSiteSettings();

  console.log(
    'deleteMe data coming into useOptions is (look for something like sex):',
  );
  console.log(data);
  if (loading || error) return {};

  const options = useMemo(
    () => {
      const backendRegionOptions = get(
        data,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      );

      const regionOptions = flattenTree(backendRegionOptions).map(
        r => ({
          label: get(r, 'name'),
          value: get(r, 'id'),
        }),
      );

      const backendSpeciesOptions = get(
        data,
        ['site.species', 'value'],
        [],
      );

      const speciesOptions = backendSpeciesOptions
        .map(o => ({
          label: get(o, 'scientificName'),
          value: get(o, 'id'),
          alternates: [
            ...get(o, 'commonNames', []),
            get(o, 'itisTsn', '').toString(),
          ],
        }))
        .filter(o => o);

      console.log('deleteMe regionOptions are: ');
      console.log(regionOptions);
      console.log('deleteMe speciesOptions are: ');
      console.log(speciesOptions);

      return { regionOptions, speciesOptions };
    },
    [siteSettingsVersion],
  );

  return options;
}
