import { get, keyBy, mapValues } from 'lodash-es';
import { formatHoustonTime } from '../../../utils/formatters';

function transformCustomFields(formData, schemas) {
  const schemaDict = keyBy(schemas, s => s.id);
  return mapValues(schemaDict, s => get(formData, s.name));
}

export function prepareBasicReport(
  sightingData,
  customSightingData,
  customSightingSchemas,
  assetReferences,
  simpleAssets = false,
) {
  const customSightingDictionary = transformCustomFields(
    customSightingData,
    customSightingSchemas,
  );

  const report = {
    ...sightingData,
    speciesDetectionModel: [
      get(sightingData, 'speciesDetectionModel', 'None'),
    ],
    assetReferences: simpleAssets
      ? assetReferences.map(a => get(a, 'path'))
      : assetReferences,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    time: formatHoustonTime(get(sightingData, 'time')),
    encounters: [
      {
        decimalLatitude: sightingData.gps[0],
        decimalLongitude: sightingData.gps[1],
        locationId: sightingData.locationId,
        verbatimLocality: sightingData.verbatimLocality,
      },
    ],
    customFields: customSightingDictionary,
  };

  delete report.gps;

  return report;
}

export function prepareReportWithEncounter(
  sightingData,
  customSightingData,
  customSightingSchemas,
  assetReferences,
  encounterData,
  customEncounterData,
  customEncounterSchemas,
  simpleAssets = false,
) {
  const safeEncounterData = encounterData || {};

  const encounter = {
    ...safeEncounterData,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    locationId: sightingData.locationId,
    verbatimLocality: sightingData.verbatimLocality,
    time: formatHoustonTime(get(sightingData, 'time')),
  };

  if (encounter.taxonomy === '') encounter.taxonomy = null;

  if (customEncounterData) {
    const customEncounterDictonary = transformCustomFields(
      customEncounterData,
      customEncounterSchemas,
    );
    encounter.customFields = customEncounterDictonary;
  }

  const report = prepareBasicReport(
    sightingData,
    customSightingData,
    customSightingSchemas,
    assetReferences,
    simpleAssets,
  );
  return { ...report, encounters: [encounter] };
}
