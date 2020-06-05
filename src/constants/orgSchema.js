export const orgSchemaCategories = {
  profile: {
    name: 'profile',
    labelId: 'PROFILE',
  },
  settings: {
    name: 'settings',
    labelId: 'SETTINGS',
  },
};

const orgSchema = [
  {
    name: 'description',
    labelId: 'DESCRIPTION',
    defaultValue: '',
    fieldType: 'longstring',
    category: orgSchemaCategories.profile.name,
  },
  {
    name: 'website',
    labelId: 'WEBSITE',
    defaultValue: '',
    fieldType: 'string',
    category: orgSchemaCategories.profile.name,
  },
  {
    name: 'collaboration_mode',
    labelId: 'COLLABORATION_MODE',
    descriptionId: 'COLLABORATION_MODE_DESCRIPTION',
    defaultValue: 'none',
    fieldType: 'select',
    choices: [
      {
        value: 'none',
        label: 'None',
      },
      {
        value: 'read',
        label: 'View',
      },
      {
        value: 'write',
        label: 'Edit',
      },
    ],
    category: orgSchemaCategories.settings.name,
  },
  {
    name: 'control_member_settings',
    labelId: 'CONTROL_MEMBER_SETTINGS',
    descriptionId: 'CONTROL_MEMBER_SETTINGS_DESCRIPTION',
    defaultValue: false,
    fieldType: 'boolean',
    category: orgSchemaCategories.settings.name,
  },
  {
    id: 'footer_logo',
    name: 'footer_logo',
    labelId: 'FOOTER_LOGO',
    descriptionId: 'FOOTER_LOGO_DESCRIPTION',
    fieldType: 'file',
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    defaultValue: null,
    category: orgSchemaCategories.settings.name,
  },
];

export default orgSchema;
