import { useMemo } from 'react';
import { get, map, uniqBy, flatMap } from 'lodash-es';

import useDetectionConfig from '../site/useDetectionConfig';
import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import { createFieldSchema } from '../../utils/fieldUtils';

export default function useIdConfigSchemas() {
  const {
    data,
    loading: siteSettingsLoading,
    error: siteSettingsError,
  } = useSiteSettings();

  const {
    data: detectionConfig,
    loading: detectionConfigLoading,
    error: detectionConfigError,
  } = useDetectionConfig();

  const loading = siteSettingsLoading || detectionConfigLoading;
  const error = siteSettingsError || detectionConfigError;

  const sightingFieldSchemas = useMemo(() => {
    if (loading || error) return [];

    const regionChoices = get(
      data,
      ['site.custom.regions', 'value', 'locationID'],
      [],
    );

    const siteSpecies = get(data, ['site.species', 'value'], []);
    const siteItisIds = siteSpecies.map(species => species.itisTsn);

    const allAlgorithms = flatMap(
      Object.values(detectionConfig),
      model =>
        flatMap(get(model, 'supported_species', []), species => {
          if (!siteItisIds.includes(species?.itis_id)) return [];
          const idAlgorithmObject = species?.id_algos || [];
          const idAlgorithms = map(
            idAlgorithmObject,
            (algorithmSchema, algorithmKey) => ({
              label: algorithmSchema?.description,
              value: algorithmKey,
              taxonomy: species?.scientific_name,
              itisId: species?.itis_id,
            }),
          );
          return idAlgorithms;
        }),
    );

    /* Would be great to maintain the list of all possible taxonomies
     * for a given algorithm and modify choices contextually.
     * Just this for now though... */
    const uniqAlgorithms = uniqBy(allAlgorithms, 'value');

    return [
      createFieldSchema(fieldTypes.multiselect, {
        name: 'algorithms',
        labelId: 'ALGORITHMS',
        descriptionId: 'ALGORITHMS_DESCRIPTION',
        choices: uniqAlgorithms,
        required: true,
      }),
      createFieldSchema(fieldTypes.locationId, {
        name: 'locationId',
        labelId: 'REGION',
        descriptionId: 'REGION_MATCHING_SET_DESCRIPTION',
        choices: regionChoices,
        required: false,
        editComponentProps: {
          multiple: false,
        },
      }),
    ];
  }, [data, detectionConfig, loading, error]);

  return sightingFieldSchemas;
}
