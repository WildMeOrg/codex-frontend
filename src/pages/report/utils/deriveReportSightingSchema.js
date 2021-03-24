import { get } from 'lodash-es';
import fieldTypes from '../../../constants/fieldTypes';

const defaultCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
    individualFields: false,
  },
  location: {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_CATEGORY_DESCRIPTION',
    required: true,
    individualFields: false,
  },
  sightingDetails: {
    name: 'sightingDetails',
    labelId: 'SIGHTING_DETAILS',
    individualFields: false,
  },
};

export default function deriveReportSightingSchema(siteSettings) {
  const categories = defaultCategories;
  const regionChoices = get(siteSettings, ['data', 'site.custom.regions', 'value', 'locationID'], []);

  const backendSpecies = get(siteSettings, ['data', 'site.species', 'suggestedValues'], []);
  const speciesOptions = backendSpecies.map(s => ({ label: s.scientificName, value: s.itisTsn }));
  const speciesOptionsWithNone = [...speciesOptions, { label: 'None', value: null }];

  return [
    {
      name: 'species',
      labelId: 'SPECIES_DETECTION_MODEL',
      descriptionId: 'SPECIES_DETECTION_MODEL_DESCRIPTION',
      category: categories.general.name,
      fieldType: fieldTypes.multiselect,
      choices: speciesOptionsWithNone,
      required: true,
      defaultValue: [],
    },
    {
      name: 'locationId',
      labelId: 'REGION',
      category: categories.location.name,
      fieldType: fieldTypes.treeview,
      multiselect: false,
      choices: regionChoices,
      defaultValue: [],
    },
    {
      name: 'gps',
      labelId: 'EXACT_LOCATION',
      descriptionId: 'LOCATION_DESCRIPTION',
      category: categories.location.name,
      fieldType: fieldTypes.latlong,
      defaultValue: [null, null],
    },
    {
      name: 'verbatimLocality',
      labelId: 'LOCATION_FREEFORM',
      descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
      category: categories.location.name,
      fieldType: fieldTypes.string,
      defaultValue: '',
    },
    {
      name: 'startTime',
      labelId: 'SIGHTING_START_TIME',
      category: categories.general.name,
      fieldType: fieldTypes.date,
      required: true,
      defaultValue: null,
    },
    {
      name: 'endTime',
      labelId: 'SIGHTING_END_TIME',
      descriptionId: 'SIGHTING_END_TIME_DESCRIPTION',
      category: categories.general.name,
      fieldType: fieldTypes.date,
      required: false,
      defaultValue: null,
    },
    {
      name: 'behavior',
      labelId: 'BEHAVIOR',
      category: categories.sightingDetails.name,
      fieldType: fieldTypes.string,
      required: false,
      defaultValue: '',
    },
    {
      name: 'notes',
      labelId: 'NOTES',
      category: categories.sightingDetails.name,
      fieldType: fieldTypes.longstring,
      required: false,
      defaultValue: '',
    },
    // {
    //   name: 'sightingContext',
    //   labelId: 'SIGHTING_CONTEXT',
    //   category: categories.general.name,
    //   fieldType: fieldTypes.select,
    //   required: true,
    //   choices: [
    //     {
    //       value: 'research-effort',
    //       labelId: 'RESEARCH_EFFORT',
    //     },
    //     {
    //       value: 'wildlife-tour',
    //       labelId: 'WILDLIFE_TOUR',
    //     },
    //     {
    //       value: 'opportunistic-sighting',
    //       labelId: 'OPPORTUNISTIC_SIGHTING',
    //     },
    //   ],
    //   defaultValue: '',
    // },
    // {
    //   name: 'autoMatch',
    //   labelId: 'AUTO_MATCH',
    //   descriptionId: 'AUTO_MATCH_DESCRIPTION',
    //   category: categories.animal.name,
    //   fieldType: fieldTypes.individual,
    //   defaultValue: null,
    // },
    // {
    //   name: 'photographer',
    //   labelId: 'PHOTOGRAPHER',
    //   descriptionId: 'PHOTOGRAPHER_DESCRIPTION',
    //   category: categories.sightingDetails.name,
    //   fieldType: fieldTypes.string,
    //   defaultValue: '',
    // },
    // {
    //   name: 'photographerEmail',
    //   labelId: 'PHOTOGRAPHER_EMAIL',
    //   category: categories.sightingDetails.name,
    //   fieldType: fieldTypes.string,
    //   defaultValue: '',
    // },
    // {
    //   name: 'additionalMedia',
    //   labelId: 'ADDITIONAL_MEDIA',
    //   category: categories.general.name,
    //   fieldType: fieldTypes.file,
    //   defaultValue: null,
    // },
  ];
}
