export default function prepareReport(
  sightingData,
  customSightingData,
  assetReferences,
  encounterData,
  customEncounterData,
) {
  const safeEncounterData = encounterData || {};

  const encounter = {
    ...safeEncounterData,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    locationId: sightingData.locationId,
    verbatimLocality: sightingData.verbatimLocality,
    customFields: customEncounterData,
    assetReferences,
  };

  if (!sightingData.endTime) encounter.time = sightingData.startTime;

  if (safeEncounterData.taxonomy) {
    encounter.taxonomy = {
      id: encounterData.taxonomy,
    };
  }

  if (customEncounterData)
    encounter.customFields = customEncounterData;

  const report = {
    ...sightingData,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    encounters: [encounter],
    customFields: customSightingData,
  };

  delete report.gps;

  return report;
}
