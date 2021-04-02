import fieldTypes from './fieldTypes';

const categoryIds = {
  individualprofile: 'individual-profile',
};

export const defaultIndividualCategories = [
  {
    id: categoryIds.individualprofile,
    label: 'Individual Profile',
  },
];

export const defaultIndividualFields = [
  {
    name: 'sex',
    labelId: 'SEX',
    category: categoryIds.individualprofile,
    fieldType: fieldTypes.select,
    requiredForIndividualCreation: true,
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
    name: 'status',
    labelId: 'STATUS',
    descriptionId: 'STATUS_SIGHTING_DESCRIPTION',
    category: categoryIds.individualprofile,
    fieldType: fieldTypes.select,
    requiredForIndividualCreation: true,
    choices: [
      {
        value: 'alive',
        labelId: 'ALIVE',
      },
      {
        value: 'dead',
        labelId: 'DEAD',
      },
      {
        value: 'unknown',
        labelId: 'UNKNOWN',
      },
    ],
    defaultValue: '',
  },
  {
    name: 'individual',
    labelId: 'AUTO_MATCH',
    descriptionId: 'AUTO_MATCH_DESCRIPTION',
    requiredForIndividualCreation: false,
    category: categoryIds.individualprofile,
    fieldType: fieldTypes.individual,
    defaultValue: null,
  },
];
