import { get, omit } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { formatHoustonTime } from '../../../utils/formatters';
import parseAssetString from './parseAssetString';

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
  const sightingTimeSpecificityTracker = {};
  const simpleAssetReferences = assetReferences.map(a => a.path);
  encounters.forEach(encounter => {
    const newEncounter = updateTimes(encounter);

    const sightingId = get(newEncounter, 'sightingId', uuid());
    const sightingAssetInput = get(
      newEncounter,
      'assetReferences',
      '',
    );
    const sightingAssets = parseAssetString(sightingAssetInput);
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

    if (!sightingTimeSpecificityTracker[sightingId]) {
      assignIfPresent(
        newEncounter,
        sightings[sightingId],
        'timeSpecificity',
      );
      sightingTimeSpecificityTracker[sightingId] = true;
    }

    const time = get(sightings, [sightingId, 'time']);
    // const timeAfter = newEncounter.time < time; // removed for MVP, where we just take the first time and ignore the rest for the same sightingId
    if (!time) {
      // || timeAfter removed this condition for MVP, where we just take the first time and ignore the rest for the same sightingId
      assignIfPresent(
        newEncounter,
        sightings[sightingId],
        'time',
        'time',
      );
    }

    if (!get(sightings, [sightingId, 'encounters']))
      sightings[sightingId].encounters = [];

    const finalEncounter = omit(newEncounter, [
      'sightingId',
      'assetReferences',
      'timeYear',
      'timeMonth',
      'timeDay',
      'timeHour',
      'timeMinutes',
      'timeSeconds',
    ]);
    sightings[sightingId].encounters.push(finalEncounter);
  });

  return Object.values(sightings);
}
