import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

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
    const sightingId = get(encounter, 'sightingId', uuid());
    const sightingAssetInput = get(encounter, 'assets', '');
    const sightingAssets = sightingAssetInput
      .split(',')
      .map(a => a.trim());
    const matchingAssets = simpleAssetReferences.filter(path =>
      sightingAssets.includes(path),
    );

    if (!sightings[sightingId]) sightings[sightingId] = {};
    sightings[sightingId].assets = matchingAssets;
    assignIfPresent(encounter, sightings[sightingId], 'locationId');
    assignIfPresent(
      encounter,
      sightings[sightingId],
      'decimalLongitude',
    );
    assignIfPresent(
      encounter,
      sightings[sightingId],
      'decimalLatitude',
    );
    assignIfPresent(
      encounter,
      sightings[sightingId],
      'verbatimLocality',
    );

    const startTime = get(sightings, [sightingId, 'startTime']);
    const startTimeAfter = encounter.time < startTime;
    if (!startTime || startTimeAfter) {
      assignIfPresent(
        encounter,
        sightings[sightingId],
        'time',
        'startTime',
      );
    }

    const endTime = get(sightings, [sightingId, 'startTime']);
    const endTimeBefore = encounter.time > startTime;
    if (!endTime || endTimeBefore) {
      assignIfPresent(
        encounter,
        sightings[sightingId],
        'time',
        'endTime',
      );
    }

    if (!get(sightings, [sightingId, 'encounters']))
      sightings[sightingId].encounters = [];
    sightings[sightingId].encounters.push(encounter);
  });

  console.log(Object.values(sightings));
  return Object.values(sightings);
}
