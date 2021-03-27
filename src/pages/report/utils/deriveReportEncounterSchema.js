import { get } from 'lodash-es';
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

  const species = get(
    siteSettings,
    ['data', 'site.species', 'value'],
    [],
  );
  const speciesOptions = species.map(s => ({
    label: s.scientificName,
    value: s.id,
  }));

  const encounterSchema = [
    {
      name: 'taxonomy',
      labelId: 'SPECIES',
      category: categories.animal.name,
      fieldType: fieldTypes.select,
      choices: speciesOptions,
      required: false,
      defaultValue: '',
    },
    {
      name: 'sex',
      labelId: 'SEX',
      category: categories.animal.name,
      fieldType: fieldTypes.select,
      required: false,
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
      name: 'lifeStage',
      labelId: 'LIFE_STAGE',
      category: categories.animal.name,
      fieldType: fieldTypes.string,
      required: false,
      defaultValue: '',
    },
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

  return { encounterSchema, encounterCategories: categories };
}
