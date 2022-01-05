import { get, keyBy, mapValues } from 'lodash-es';

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
    time: get(sightingData, 'startTime'),
    timeSpecificity: 'time', // TODO I plan on moving this into sightingData upstream as part of DEX-645. Eventually, this value will come from a form.
    speciesDetectionModel: [
      get(sightingData, 'speciesDetectionModel', 'None'),
    ],
    assetReferences: simpleAssets
      ? assetReferences.map(a => get(a, 'path'))
      : assetReferences,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
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
  // TODO delete startTime
  console.log('deleteMe report in prepareBasicReport is: ');
  console.log(report);
  // debugger;

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
  console.log(
    'deleteMe sightingData in prepareReportWithEncounter is: ',
  );
  console.log(sightingData);
  const safeEncounterData = encounterData || {};

  const encounter = {
    ...safeEncounterData,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    locationId: sightingData.locationId,
    verbatimLocality: sightingData.verbatimLocality,
  };

  if (!sightingData.endTime) encounter.time = sightingData.startTime;

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
