import { get } from 'lodash-es';

export default function prepareReport(oneEncounter, sightingData, encounterData) {
  let encounter = {
    ...encounterData,
  };
  
  if (oneEncounter) {
    encounter = {
      ...encounterData,
      decimalLatitude: sightingData.gps[0],
      decimalLongitude: sightingData.gps[1],

    };
    if (!get(sightingData, 'endTime')) {
      encounter.time = sightingData.startTime;
    }
  }

  const report = {
    ...sightingData,
    decimalLatitude: sightingData.gps[0],
    decimalLongitude: sightingData.gps[1],
    encounters: [encounter],
  };

  delete report.gps;

  return report;
}
