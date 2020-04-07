import logoForBlackBackground from '../../assets/logo-for-black-bg.png';
import logoForWhiteBackground from '../../assets/logo-for-white-bg.png';

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

export const selectLogos = state => ({
  white: logoForWhiteBackground,
  black: logoForBlackBackground,
});
