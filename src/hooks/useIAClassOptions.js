import { useMemo } from 'react';
import { get, filter, flatten, uniq } from 'lodash-es';

import useDetectionConfig from '../models/site/useDetectionConfig';

export default function useIAClassOptions(sightingData) {
  const { data: detectionConfig } = useDetectionConfig();

  return useMemo(
    () => {
      if (!sightingData || !detectionConfig) return [];
      const speciesDetectionModels =
        sightingData?.speciesDetectionModel;

      const relevantModels = filter(detectionConfig, (_, modelName) =>
        speciesDetectionModels.includes(modelName),
      );

      const modelChoices =
        relevantModels.length === 0
          ? Object.values(detectionConfig)
          : relevantModels;
      const species = modelChoices.map(model =>
        get(model, 'supported_species', []),
      );
      const flatSpecies = flatten(species);
      const iaClasses = flatSpecies.map(s =>
        get(s, 'ia_classes', []),
      );
      const flatIAClasses = uniq(flatten(iaClasses));
      return flatIAClasses.map(IAClass => ({
        label: IAClass,
        value: IAClass,
      }));
    },
    [sightingData, detectionConfig],
  );
}
