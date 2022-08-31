import { useMemo } from 'react';
import { get } from 'lodash-es';

import { flattenTree } from '../utils/treeUtils';
import useSiteSettings from '../models/site/useSiteSettings';

export default function useOptions() {
  const { data, loading, error } = useSiteSettings();

  return useMemo(() => {
    if (loading || error)
      return { regionOptions: [], speciesOptions: [] };

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

    return { regionOptions, speciesOptions };
  }, [loading, error, data]);
}
