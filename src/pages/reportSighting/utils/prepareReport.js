import { get, keyBy, mapValues } from 'lodash-es';
import { formatHoustonTime } from '../../../utils/formatters';

function transformCustomFields(formData, schemas) {
  const schemaDict = keyBy(schemas, s => s.id);
  return mapValues(schemaDict, s => get(formData, s.name));
}

export function prepareBasicReport(
  sightingType,
  sightingData,
  customSightingData,
  customSightingSchemas,
  assetReferences,
  simpleAssets = false,
) {
  console.log('deleteMe sightingData in prepareBasicReport is: ');
  console.log(sightingData);
  const customSightingDictionary = transformCustomFields(
    customSightingData,
    customSightingSchemas,
  );

  const sightingTime = formatHoustonTime(
    get(sightingData, ['specifiedTime', 'time']),
  );
  const sightingTimeSpecifity = get(sightingData, [
    'specifiedTime',
    'timeSpecificity',
  ]);

  const report = {
    ...sightingData,
    sightingType,
    speciesDetectionModel: [
      get(sightingData, 'speciesDetectionModel', 'None'),
    ],
    assetReferences: simpleAssets
      ? assetReferences.map(a => get(a, 'path'))
      : assetReferences,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    time: sightingTime,
    timeSpecificity: sightingTimeSpecifity,
    encounters: [
      {
        decimalLatitude: sightingData.gps[0],
        decimalLongitude: sightingData.gps[1],
        locationId: sightingData.locationId,
        verbatimLocality: sightingData.verbatimLocality,
        time: sightingTime,
        timeSpecificity: sightingTimeSpecifity,
      },
    ],
    customFields: customSightingDictionary,
  };
  delete report.gps;
  delete report.specifiedTime;

  return report;
}

export function prepareReportWithEncounter(
  sightingType,
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
    time: formatHoustonTime(
      get(sightingData, ['specifiedTime', 'time']),
    ),
    timeSpecificity: get(sightingData, [
      'specifiedTime',
      'timeSpecificity',
    ]),
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
    sightingType,
    sightingData,
    customSightingData,
    customSightingSchemas,
    assetReferences,
    simpleAssets,
  );
  return { ...report, encounters: [encounter] };
}
