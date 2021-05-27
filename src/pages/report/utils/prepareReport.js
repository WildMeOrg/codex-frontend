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
) {
  const customSightingDictionary = transformCustomFields(
    customSightingData,
    customSightingSchemas,
  );

  const report = {
    ...sightingData,
    assetReferences,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    encounters: [],
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
) {
  const safeEncounterData = encounterData || {};

  const encounter = {
    ...safeEncounterData,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    locationId: sightingData.locationId,
    verbatimLocality: sightingData.verbatimLocality,
  };

  if (!sightingData.endTime) encounter.time = sightingData.startTime;

  if (safeEncounterData.taxonomy) {
    encounter.taxonomy = {
      id: encounterData.taxonomy,
    };
  }

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
  );
  return {
    ...report,
    encounters: [encounter],
  };
}
