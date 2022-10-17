import { useMemo } from 'react';
import {
  get,
  map,
  uniqBy,
  flatMap,
  reduce,
  reverse,
} from 'lodash-es';
import { useIntl } from 'react-intl';

import useDetectionConfig from '../site/useDetectionConfig';
import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import { createFieldSchema } from '../../utils/fieldUtils';

export default function useIdConfigSchemas() {
  const intl = useIntl();
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
    const speciesMap = {};

    const allAlgorithms = reduce(
      Object.values(detectionConfig),
      (memo, model) => {
        const supportedSpecies = model?.supported_species;
        const idAlgos = flatMap(supportedSpecies, singleSpecies => {
          const commonName =
            singleSpecies?.common_name ||
            intl.formatMessage({ id: 'UNKNOWN_COMMON_NAME' });
          const speciesName =
            singleSpecies?.scientific_name ||
            intl.formatMessage({ id: 'UNKNOWN_SCIENTIFIC_NAME' });
          if (!siteItisIds.includes(singleSpecies?.itis_id))
            return [];
          const safeSingleSpeciesIdAlgos =
            singleSpecies?.id_algos || [];
          const algoChoices = map(
            safeSingleSpeciesIdAlgos,
            (idAlgo, key) => {
              // populate the species map with species name arrays keyed by algorithm key so that they can later be joined and added to the final label
              const currentSpecies = get(speciesMap, key, []);
              if (currentSpecies.length > 0) {
                speciesMap[key].push(
                  intl.formatMessage(
                    {
                      id: 'COMMON_NAME_PLUS_SCIENTIFIC_NAME',
                    },
                    { commonName, speciesName },
                  ),
                );
              } else {
                speciesMap[key] = [
                  intl.formatMessage(
                    {
                      id: 'COMMON_NAME_PLUS_SCIENTIFIC_NAME',
                    },
                    { commonName, speciesName },
                  ),
                ];
              }

              const algoDescription =
                idAlgo?.description ||
                intl.formatMessage({
                  id: 'UNKNOWN_ALGORITHM_DESCRIPTION',
                });
              return {
                value: key,
                label:
                  algoDescription +
                  intl.formatMessage({
                    id: 'FOR_COLON',
                  }),
              };
            },
          );

          return algoChoices;
        });

        const idAlgosWithImprovedLabels = map(idAlgos, idAlgo => {
          const baseLabel = get(idAlgo, 'label', '');
          const labelsToAdd = get(speciesMap, [idAlgo?.value], '');
          return {
            ...idAlgo,
            label: [
              baseLabel,
              ...intl.formatList(labelsToAdd, {
                type: 'conjunction',
              }),
            ].join(''),
          };
        });
        return [...memo, ...idAlgosWithImprovedLabels];
      },
      [],
    );

    /* Would be great to maintain the list of all possible taxonomies
     * for a given algorithm and modify choices contextually.
     * Just this for now though... */
    const uniqAlgorithms = uniqBy(reverse(allAlgorithms), 'value');

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
  }, [data, detectionConfig, loading, error, intl]);

  return sightingFieldSchemas;
}
