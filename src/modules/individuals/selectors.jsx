import defaultProfile from '../../assets/defaultProfile.jpg';
import individualSearchSchema, {
  individualSearchCategories,
} from '../../constants/individualSearchSchema';
import fieldTypes from '../../constants/fieldTypes';

export const selectIndividuals = state => ({
  teddy: {
    name: 'Teddy',
    profile: defaultProfile,
    species: 'bear',
    editable: true,
    fields: [
      {
        name: 'age',
        value: 55,
      },
      {
        name: 'sex',
        value: 'Unknown',
      },
      {
        name: 'status',
        value: 'Alive',
      },
    ],
    data: {
      followedBy: [
        { id: 'jsmith42', name: 'Joe Smith' },
        { id: 'kiki66', name: 'Khai Kinkade' },
        { id: 'jjoop', name: 'Jjoop Loops' },
      ],
      lastSeen: Date.now(),
    },
    encounters: [
      {
        id: 'lkfjaoiwejflkajasd',
        individualId: 'WB-133',
        profile: defaultProfile,
        user: 'Joe Smith',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'ready-for-review',
        photoCount: 14,
        matchCount: 4,
        submissionDate: Date.now(),
      },
      {
        id: 'csljlkdjafljsdlfjs',
        individualId: 'WB-106',
        profile: defaultProfile,
        user: 'Betty Spinoza',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 6,
        matchCount: 2,
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
        individualId: 'WB-101',
        profile: defaultProfile,
        user: 'Joe Spinoza',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 12,
        matchCount: 6,
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
        individualId: 'WB-142',
        profile: defaultProfile,
        user: 'Betty Smith',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 50,
        matchCount: 1,
        submissionDate: Date.now(),
      },
    ],
  },
});

export const selectSearchResults = state => [
  {
    id: 'Teddy',
    alias: 'Teddy',
    encounterCount: 7,
    locationsSighted: 3,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
  {
    id: 'WB-104',
    alias: 'Zeeb',
    encounterCount: 5,
    locationsSighted: 2,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
  {
    id: 'WB-132',
    alias: 'Dobbles',
    encounterCount: 22,
    locationsSighted: 13,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
  {
    id: 'WB-420',
    alias: 'Bollod',
    encounterCount: 47,
    locationsSighted: 3,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
  {
    id: 'WB-88',
    alias: 'Norgub',
    encounterCount: 20,
    locationsSighted: 1,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
  {
    id: 'WB-61',
    alias: 'Friggles',
    encounterCount: 42,
    locationsSighted: 4,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
  {
    id: 'WB-42',
    alias: 'Jeff',
    encounterCount: 88,
    locationsSighted: 1,
    lastSeen: Date.now(),
    profile: defaultProfile,
  },
];

export const selectIndividualSearchCategories = state => ({
  ...individualSearchCategories,
  samples: {
    name: 'samples',
    label: 'Biological samples',
  },
});

export const selectIndividualSearchSchema = state => {
  const categories = selectIndividualSearchCategories(state);

  return [
    ...individualSearchSchema,
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
      defaultValue: null,
    },
    {
      name: 'hasBiologicalSamples',
      label: 'Has biological samples',
      category: categories.samples.name,
      fieldType: fieldTypes.boolean,
      defaultValue: null,
    },
    {
      name: 'haplotype',
      label: 'Haplotype',
      category: categories.samples.name,
      fieldType: fieldTypes.multiselect,
      choices: ['A', 'A+', 'A-', 'A3', 'A4'],
      defaultValue: [],
    },
  ];
};
