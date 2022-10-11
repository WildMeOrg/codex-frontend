import { useMemo } from 'react';
import {
  get,
  map,
  uniqBy,
  flatMap,
  reduce,
  forEach,
} from 'lodash-es';
import { useIntl } from 'react-intl';

import useDetectionConfig from '../site/useDetectionConfig';
import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import { createFieldSchema } from '../../utils/fieldUtils';

export default function useIdConfigSchemas() {
  // const onlyUnique = (value, index, self) =>
  //   self.indexOf(value) === index;
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

    // const siteSpecies = get(data, ['site.species', 'value'], []);
    // const siteItisIds = siteSpecies.map(species => species.itisTsn);

    const allAlgorithms = reduce(
      Object.values(detectionConfig),
      (memo, model) => {
        const supportedSpecies = model?.supported_species;
        // const algos = [];
        const speciesMap = {};
        const idAlgos = flatMap(supportedSpecies, singleSpecies => {
          const commonName =
            singleSpecies?.common_name ||
            intl.formatMessage({ id: 'UNKNOWN_COMMON_NAME' });
          const speciesName =
            singleSpecies?.scientific_name ||
            intl.formatMessage({ id: 'UNKNOWN_SCIENTIFIC_NAME' });
          const algoChoices = map(
            singleSpecies?.id_algos,
            (idAlgo, key) => {
              const algoDescription =
                idAlgo?.description ||
                intl.formatMessage({
                  id: 'UNKNOWN_ALGORITHM_DESCRIPTION',
                });
              return {
                value: key,
                label: algoDescription + ' for: ',
              };
            },
          );
          forEach(Object.keys(singleSpecies?.id_algos), algoKey => {
            const currentSpecies = get(speciesMap, algoKey, []);
            if (currentSpecies.length > 0) {
              speciesMap[algoKey].push(
                commonName + '(' + speciesName + ')',
              );
            } else {
              speciesMap[algoKey] = [
                commonName + '(' + speciesName + ')',
              ];
            }
          });
          // const idAlgoKeys = uniq(
          //   Object.keys(singleSpecies?.id_algos),
          // );

          // const idAlgoDescriptions = uniq(
          //   map(singleSpecies?.id_algos, algo => algo?.description),
          // );

          return uniqBy(algoChoices, 'value');
        });
        console.log('deleteMe idAlgos are: ');
        console.log(idAlgos);
        const idAlgosWithImprovedLabels = map(idAlgos, idAlgo => {
          const baseLabel = get(idAlgo, 'label', '');
          const labelsToAdd = get(speciesMap, [idAlgo?.value], '');
          return {
            ...idAlgo,
            label: baseLabel + labelsToAdd.join(', '),
          };
        });
        return [...memo, ...idAlgosWithImprovedLabels];
      },
      [],
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
