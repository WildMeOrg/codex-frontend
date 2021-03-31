import { get } from 'lodash-es';
import fieldTypes from '../../../constants/fieldTypes';

const defaultSightingCategories = {
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
  const sightingCategories = defaultSightingCategories;

  const regionChoices = get(
    siteSettings,
    ['data', 'site.custom.regions', 'value', 'locationID'],
    [],
  );

  const sightingSchema = [
    {
      name: 'speciesDetectionModel',
      labelId: 'SPECIES_DETECTION_MODEL',
      descriptionId: 'SPECIES_DETECTION_MODEL_DESCRIPTION',
      category: sightingCategories.general.name,
      fieldType: fieldTypes.select,
      choices: [{ value: 'None', label: 'None' }],
      required: true,
      defaultValue: '',
    },
    {
      name: 'context',
      labelId: 'SIGHTING_CONTEXT',
      category: sightingCategories.general.name,
      fieldType: fieldTypes.select,
      required: true,
      choices: [
        {
          value: 'research-effort',
          labelId: 'RESEARCH_EFFORT',
        },
        {
          value: 'wildlife-tour',
          labelId: 'WILDLIFE_TOUR',
        },
        {
          value: 'opportunistic-sighting',
          labelId: 'OPPORTUNISTIC_SIGHTING',
        },
      ],
      defaultValue: '',
    },
    {
      name: 'startTime',
      labelId: 'SIGHTING_START_TIME',
      descriptionId: 'SIGHTING_START_TIME_DESCRIPTION',
      category: sightingCategories.general.name,
      fieldType: fieldTypes.date,
      required: true,
      defaultValue: null,
    },
    {
      name: 'endTime',
      labelId: 'SIGHTING_END_TIME',
      descriptionId: 'SIGHTING_END_TIME_DESCRIPTION',
      category: sightingCategories.general.name,
      fieldType: fieldTypes.date,
      required: false,
      defaultValue: null,
    },
    {
      name: 'verbatimEventDate',
      labelId: 'SIGHTING_VERBATIM_TIME',
      descriptionId: 'SIGHTING_VERBATIM_TIME_DESCRIPTION',
      category: sightingCategories.general.name,
      fieldType: fieldTypes.string,
      required: false,
      defaultValue: '',
    },
    {
      name: 'locationId',
      labelId: 'REGION',
      category: sightingCategories.location.name,
      fieldType: fieldTypes.treeview,
      multiselect: false,
      choices: regionChoices,
      defaultValue: '',
    },
    {
      name: 'gps',
      labelId: 'EXACT_LOCATION',
      descriptionId: 'LOCATION_DESCRIPTION',
      category: sightingCategories.location.name,
      fieldType: fieldTypes.latlong,
      defaultValue: [null, null],
    },
    {
      name: 'verbatimLocality',
      labelId: 'LOCATION_FREEFORM',
      descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
      category: sightingCategories.location.name,
      fieldType: fieldTypes.string,
      defaultValue: '',
    },
    {
      name: 'behavior',
      labelId: 'BEHAVIOR',
      category: sightingCategories.sightingDetails.name,
      fieldType: fieldTypes.string,
      required: false,
      defaultValue: '',
    },
    {
      name: 'comments',
      labelId: 'NOTES',
      category: sightingCategories.sightingDetails.name,
      fieldType: fieldTypes.longstring,
      required: false,
      defaultValue: '',
    },
    // {
    //   name: 'autoMatch',
    //   labelId: 'AUTO_MATCH',
    //   descriptionId: 'AUTO_MATCH_DESCRIPTION',
    //   category: sightingCategories.animal.name,
    //   fieldType: fieldTypes.individual,
    //   defaultValue: null,
    // },
    // {
    //   name: 'photographer',
    //   labelId: 'PHOTOGRAPHER',
    //   descriptionId: 'PHOTOGRAPHER_DESCRIPTION',
    //   category: sightingCategories.sightingDetails.name,
    //   fieldType: fieldTypes.string,
    //   defaultValue: '',
    // },
    // {
    //   name: 'photographerEmail',
    //   labelId: 'PHOTOGRAPHER_EMAIL',
    //   category: sightingCategories.sightingDetails.name,
    //   fieldType: fieldTypes.string,
    //   defaultValue: '',
    // },
    // {
    //   name: 'additionalMedia',
    //   labelId: 'ADDITIONAL_MEDIA',
    //   category: sightingCategories.general.name,
    //   fieldType: fieldTypes.file,
    //   defaultValue: null,
    // },
  ];

  return { sightingSchema, sightingCategories };
}
