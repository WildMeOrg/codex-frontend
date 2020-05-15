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

export const selectSiteSettings = state => ({
  siteName: 'Flukebook',
  private: true,
  googleApiKey: '',
  lightBackgroundLogo: logoForWhiteBackground,
  darkBackgroundLogo: logoForBlackBackground,
  sightingFields: [],
  individualFields: [],
});

export const selectSiteName = state => {
  const settings = selectSiteSettings(state);
  return settings.siteName;
};

export const selectLogos = state => ({
  white: logoForWhiteBackground,
  black: logoForBlackBackground,
});

export const selectTermsAndConditions = state => {
  return `The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.
  
  The rights to images on Wildbook are held by the contributors of those images. Wild Me reserves only the right to use these images as training data for new computer vision algorithms.`;
};
