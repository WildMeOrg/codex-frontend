export const defaultIndividualCategories = {
  general: {
    name: 'general',
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
    name: 'individual',
    labelId: 'INDIVIDUAL_INFORMATION',
    individualFields: true,
  },
};
