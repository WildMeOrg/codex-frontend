export const selectSpeciesFields = state => ({
  bear: [
    {
      name: 'age',
      translationId: 'AGE',
      defaultValue: null,
      type: 'number',
    },
    {
      name: 'sex',
      translationId: 'SEX',
      defaultValue: 'Unknown',
      type: 'enum',
      values: [
        'Unknown',
        'Male',
        'Female',
        'Probable Male',
        'Probable Female',
      ],
    },
    {
      name: 'status',
      translationId: 'STATUS',
      defaultValue: '',
      type: 'string',
    },
  ],
});

export const selectSiteName = state => 'Flukebook';

export const selectSiteSettings = state => ({
  name: 'Flukebook',
});