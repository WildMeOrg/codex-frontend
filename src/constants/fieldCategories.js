export const defaultIndividualCategories = {
  general: {
    name: 'individualMetadata',
    labelId: 'INDIVIDUAL_METADATA',
  },
};

export const defaultSightingCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
    individualFields: false,
  },
  location: {
    name: 'location',
    labelId: 'LOCATION',
    required: true,
    individualFields: false,
  },
  details: {
    name: 'sightingDetails',
    labelId: 'SIGHTING_DETAILS',
    individualFields: false,
  },
};

export const defaultEncounterCategories = {
  animal: {
    name: 'individualInformation',
    labelId: 'INDIVIDUAL_INFORMATION',
    individualFields: true,
  },
};
