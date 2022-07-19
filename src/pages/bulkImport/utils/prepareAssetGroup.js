import {
  get,
  isEmpty,
  mapKeys,
  omit,
  pickBy,
  startsWith,
} from 'lodash-es';
import { v4 as uuid } from 'uuid';

import { formatHoustonTime } from '../../../utils/formatters';
import categoryTypes from '../../../constants/categoryTypes';
import { deriveCustomFieldPrefix } from '../constants/bulkReportConstants';
import parseBulkImportString from './parseBulkImportString';

function updateTimes(encounter) {
  const year = get(encounter, 'timeYear', 0);
  const month = get(encounter, 'timeMonth', 1) - 1;
  const day = get(encounter, 'timeDay', 1);
  const hours = get(encounter, 'timeHour', 1);
  const minutes = get(encounter, 'timeMinutes', 0);
  const seconds = get(encounter, 'timeSeconds', 0);
  const time = formatHoustonTime(
    new Date(year, month, day, hours, minutes, seconds),
  );
  return {
    ...encounter,
    time,
  };
}

function deriveCustomFields(encounter, categoryType) {
  const prefix = deriveCustomFieldPrefix(categoryType);

  const customSightingFields = pickBy(
    encounter,
    (value, key) => value && startsWith(key, prefix),
  );

  return mapKeys(
    customSightingFields,
    (_, key) => key.split(prefix)[1],
  );
}

function deriveCustomFieldKeys(encounter) {
  const sightingsPrefixCustom = deriveCustomFieldPrefix(
    categoryTypes.sighting,
  );
  const encountersPrefixCustom = deriveCustomFieldPrefix(
    categoryTypes.encounter,
  );
  return Object.keys(encounter).filter(
    key =>
      startsWith(key, sightingsPrefixCustom) ||
      startsWith(key, encountersPrefixCustom),
  );
}

function assignIfPresent(
  sourceObject,
  destinationObject,
  sourcePath,
  destinationPath,
) {
  if (!destinationPath) destinationPath = sourcePath;
  if (get(sourceObject, sourcePath, undefined) !== undefined) {
    destinationObject[destinationPath] = sourceObject[sourcePath];
  }
}

export default function prepareAssetGroup(
  encounters,
  assetReferences,
) {
  const sightings = {};
  const simpleAssetReferences = assetReferences.map(a => a.path);
  encounters.forEach(encounter => {
    const newEncounter = updateTimes(encounter);

    const sightingId = get(newEncounter, 'sightingId', uuid());
    const sightingAssetInput = get(
      newEncounter,
      'assetReferences',
      '',
    );
    const sightingAssets = parseBulkImportString(sightingAssetInput);
    const matchingAssets = simpleAssetReferences.filter(path =>
      sightingAssets.includes(path),
    );
    if (!sightings[sightingId]) sightings[sightingId] = {};
    const assetReferencesAlreadyExist = Boolean(
      sightings[sightingId]?.assetReferences,
    );
    if (assetReferencesAlreadyExist) {
      sightings[sightingId].assetReferences.push(...matchingAssets);
    } else {
      sightings[sightingId].assetReferences = matchingAssets;
    }

    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'locationId',
    );
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'decimalLongitude',
    );
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'decimalLatitude',
    );
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'verbatimLocality',
    );

    if (get(newEncounter, 'comments')) {
      assignIfPresent(
        newEncounter,
        sightings[sightingId],
        'comments',
      );
    }

    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'timeSpecificity',
    );

    assignIfPresent(newEncounter, sightings[sightingId], 'time');

    const customSightingFields = deriveCustomFields(
      newEncounter,
      categoryTypes.sighting,
    );
    if (!isEmpty(customSightingFields)) {
      sightings[sightingId].customFields = customSightingFields;
    }

    if (!get(sightings, [sightingId, 'encounters']))
      sightings[sightingId].encounters = [];

    const customEncounterFields = deriveCustomFields(
      newEncounter,
      categoryTypes.encounter,
    );
    if (!isEmpty(customEncounterFields)) {
      newEncounter.customFields = customEncounterFields;
    }

    const finalEncounter = omit(newEncounter, [
      'sightingId',
      'assetReferences',
      'timeYear',
      'timeMonth',
      'timeDay',
      'timeHour',
      'timeMinutes',
      'timeSeconds',
      'comments',
      ...deriveCustomFieldKeys(newEncounter),
    ]);
    sightings[sightingId].encounters.push(finalEncounter);
  });

  return Object.values(sightings);
}
