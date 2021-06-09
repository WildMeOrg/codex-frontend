import { useMemo } from 'react';
import { cloneDeep, get } from 'lodash-es';

import useSiteSettings from '../../../models/site/useSiteSettings';

function flattenTree(regions) {
  const flatTree = cloneDeep(regions);

  function addLevel(leaves) {
    leaves.forEach(leaf => {
      flatTree.push(leaf);
      if (leaf.locationID) addLevel(leaf.locationID);
    });
  }

  addLevel(regions);
  return flatTree;
}

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
    },
    [siteSettingsVersion],
  );

  return options;
}
