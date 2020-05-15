import fieldTypes from './fieldTypes';

export default [
  {
    name: 'siteName',
    labelId: 'SITE_NAME',
    descriptionId: 'SITE_NAME_DESCRIPTION',
    fieldType: fieldTypes.string,
    required: true,
    defaultValue: '',
  },
  {
    name: 'needsSetup',
    fieldType: fieldTypes.bool,
    hidden: true,
    defaultValue: true,
  },
  {
    name: 'private',
    labelId: 'PRIVATE_SITE',
    descriptionId: 'PRIVATE_SITE_DESCRIPTION',
    fieldType: fieldTypes.boolean,
    required: true,
    defaultValue: false,
  },
  {
    name: 'googleApiKey',
    labelId: 'GOOGLE_API_KEY',
    descriptionId: 'GOOGLE_API_KEY_DESCRIPTION',
    fieldType: fieldTypes.string,
    required: false,
    defaultValue: '',
  },
  {
    name: 'lightBackgroundLogo',
    labelId: 'WHITE_BG_LOGO',
    descriptionId: 'WHITE_BG_LOGO_DESCRIPTION',
    fieldType: fieldTypes.file,
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    defaultValue: null,
  },
  {
    name: 'darkBackgroundLogo',
    labelId: 'DARK_BG_LOGO',
    descriptionId: 'DARK_BG_LOGO_DESCRIPTION',
    fieldType: fieldTypes.file,
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    defaultValue: null,
  },
  {
    name: 'footerLogo',
    labelId: 'FOOTER_LOGO',
    descriptionId: 'FOOTER_LOGO_DESCRIPTION',
    fieldType: fieldTypes.file,
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    defaultValue: null,
  },
];
