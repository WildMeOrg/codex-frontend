import logoForBlackBackground from '../../assets/logo-for-black-bg.png';
import logoForWhiteBackground from '../../assets/logo-for-white-bg.png';

export const selectSpeciesFields = state => ({
  bear: [
    {
      name: 'age',
      labelId: 'AGE',
      defaultValue: null,
      type: 'integer',
    },
    {
      name: 'sex',
      labelId: 'SEX',
      defaultValue: 'Unknown',
      type: 'select',
      choices: [
        'Unknown',
        'Male',
        'Female',
        'Probable Male',
        'Probable Female',
      ],
    },
    {
      name: 'status',
      labelId: 'STATUS',
      defaultValue: '',
      type: 'string',
    },
  ],
});

export const selectSiteName = state => 'Flukebook';

export const selectSiteSettings = state => ({
  name: 'Flukebook',
});

export const selectLogos = state => ({
  white: logoForWhiteBackground,
  black: logoForBlackBackground,
});
