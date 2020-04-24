import defaultProfile from '../../assets/defaultProfile.jpg';
import encounterSearchSchema, {
  encounterSearchCategories,
} from '../../constants/encounterSearchSchema';
import encounterSchema, {
  encounterCategories,
} from '../../constants/encounterSchema';
import fieldTypes from '../../constants/fieldTypes';

export const selectEncounters = state => [
  {
    id: 'lkfjaoiwejflkajasd',
    individualId: 'WB-133',
    profile: defaultProfile,
    user: 'Joe Smith',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'ready-for-review',
    photoCount: 14,
    submissionDate: Date.now(),
    encounterDate: Date.now(),
  },
  {
    id: 'csljlkdjafljsdlfjs',
    individualId: 'WB-106',
    profile: defaultProfile,
    user: 'Betty Spinoza',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'identification-complete',
    photoCount: 6,
    submissionDate: Date.now(),
    encounterDate: Date.now(),
  },
  {
    id: 'lekfjwljefoiajlfew',
    individualId: 'WB-101',
    profile: defaultProfile,
    user: 'Joe Spinoza',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'identification-complete',
    photoCount: 12,
    submissionDate: Date.now(),
    encounterDate: Date.now(),
  },
  {
    id: 'lekfjwljefoiajlfew',
    individualId: 'WB-142',
    profile: defaultProfile,
    user: 'Betty Smith',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'identification-complete',
    photoCount: 50,
    submissionDate: Date.now(),
    encounterDate: Date.now(),
  },
];

export const selectSearchResults = state => selectEncounters(state);

export const selectEncounterSearchCategories = state => ({
  ...encounterSearchCategories,
});

export const selectEncounterSearchSchema = state => {
  const categories = selectEncounterSearchCategories(state);

  return [
    {
      name: 'species',
      labelId: 'SPECIES',
      category: categories.attributes.name,
      fieldType: fieldTypes.select,
      choices: [
        'Delphinidae',
        'Grampus Griseus',
        'Kogia Sima',
        'Unknown',
      ],
      defaultValue: '',
    },
    ...encounterSearchSchema,
  ];
};

export const selectEncounterCategories = state => ({
  ...encounterCategories,
});

export const selectEncounterSchema = state => {
  const categories = selectEncounterCategories(state);

  return [
    {
      name: 'species',
      labelId: 'SPECIES',
      category: categories.general.name,
      fieldType: fieldTypes.select,
      choices: [
        'Delphinidae',
        'Grampus Griseus',
        'Kogia Sima',
        'Unknown',
      ],
      required: true,
      defaultValue: '',
    },
    ...encounterSchema,
    {
      name: 'additionalMedia',
      labelId: 'ADDITIONAL_MEDIA',
      category: categories.general.name,
      fieldType: fieldTypes.file,
      defaultValue: null,
    },
  ];
};
