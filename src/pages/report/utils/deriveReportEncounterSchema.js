import fieldTypes from '../../../constants/fieldTypes';

const defaultCategories = {
  animal: {
    name: 'individual',
    labelId: 'INDIVIDUAL_INFORMATION',
    individualFields: true,
  },
};

export default function deriveReportEncounterSchema(siteSettings) {
  const categories = defaultCategories;
  return [
    {
      name: 'taxonomy',
      labelId: 'SPECIES',
      category: categories.general.name,
      fieldType: fieldTypes.select,
      choices: [
        {
          value: 'delphinae',
          label: 'Delphinidae',
        },
        {
          value: 'grampus-griseus',
          label: 'Grampus Griseus',
        },
        {
          value: 'kogia-sima',
          label: 'Kogia Sima',
        },
        {
          value: 'Unknown',
          label: 'Unknown',
        },
      ],
      required: true,
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
      name: 'sex',
      labelId: 'SEX',
      category: categories.animal.name,
      fieldType: fieldTypes.select,
      choices: [
        {
          value: 'male',
          labelId: 'MALE',
        },
        {
          value: 'female',
          labelId: 'FEMALE',
        },
        {
          value: 'non-binary',
          labelId: 'NON_BINARY',
        },
        {
          value: 'unknown',
          labelId: 'UNKNOWN',
        },
      ],
      defaultValue: '',
    },
    {
      name: 'behavior',
      labelId: 'BEHAVIOR',
      category: categories.animal.name,
      fieldType: fieldTypes.string,
      required: false,
      defaultValue: '',
    },
    {
      name: 'lifeStage',
      labelId: 'LIFE_STAGE',
      category: categories.animal.name,
      fieldType: fieldTypes.string,
      required: false,
      defaultValue: '',
    },
    // {
    //   name: 'status',
    //   labelId: 'STATUS',
    //   descriptionId: 'STATUS_SIGHTING_DESCRIPTION',
    //   category: categories.animal.name,
    //   fieldType: fieldTypes.select,
    //   choices: [
    //     {
    //       value: 'alive',
    //       labelId: 'ALIVE',
    //     },
    //     {
    //       value: 'dead',
    //       labelId: 'DEAD',
    //     },
    //     {
    //       value: 'unknown',
    //       labelId: 'UNKNOWN',
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
    //   name: 'additionalMedia',
    //   labelId: 'ADDITIONAL_MEDIA',
    //   category: categories.general.name,
    //   fieldType: fieldTypes.file,
    //   defaultValue: null,
    // },
    // {
    //   name: 'relationships',
    //   labelId: 'RELATIONSHIPS',
    //   descriptionId: 'RELATIONSHIPS_DESCRIPTION',
    //   category: categories.animal.name,
    //   fieldType: fieldTypes.relationships,
    //   choices: [
    //     {
    //       value: 'mother',
    //       labelId: 'MOTHER_OF',
    //     },
    //     {
    //       value: 'father',
    //       labelId: 'FATHER_OF',
    //     },
    //     {
    //       value: 'calf',
    //       labelId: 'CALF_OF',
    //     },
    //     {
    //       value: 'family',
    //       labelId: 'IN_A_FAMILY_WITH',
    //     },
    //     {
    //       value: 'group',
    //       labelId: 'IN_A_GROUP_WITH',
    //     },
    //   ],
    //   defaultValue: [],
    // },
  ];
}
