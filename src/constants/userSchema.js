export const userSchemaCategories = {
  profile: {
    name: 'profile',
    labelId: 'PROFILE',
  },
  settings: {
    name: 'settings',
    labelId: 'SETTINGS',
  },
};

const userSchema = [
  {
    name: 'affiliation',
    labelId: 'AFFILIATION',
    defaultValue: '',
    fieldType: 'string',
    category: userSchemaCategories.profile.name,
  },
  {
    name: 'location',
    labelId: 'LOCATION',
    defaultValue: '',
    fieldType: 'string',
    category: userSchemaCategories.profile.name,
  },
  {
    name: 'website',
    labelId: 'WEBSITE',
    defaultValue: '',
    fieldType: 'string',
    category: userSchemaCategories.profile.name,
  },
  {
    name: 'forum_id',
    labelId: 'FORUM_USERNAME',
    defaultValue: '',
    fieldType: 'string',
    category: userSchemaCategories.profile.name,
  },
  {
    name: 'receive_newsletter_emails',
    labelId: 'RECEIVE_NEWSLETTER_EMAILS',
    descriptionId: 'RECEIVE_NEWSLETTER_EMAILS_DESCRIPTION',
    defaultValue: false,
    fieldType: 'boolean',
    category: userSchemaCategories.settings.name,
  },
  {
    name: 'receive_notification_emails',
    labelId: 'RECEIVE_NOTIFICATION_EMAILS',
    descriptionId: 'RECEIVE_NOTIFICATION_EMAILS_DESCRIPTION',
    defaultValue: false,
    fieldType: 'boolean',
    category: userSchemaCategories.settings.name,
  },
  {
    name: 'show_email_in_profile',
    labelId: 'SHOW_EMAIL_IN_PROFILE',
    descriptionId: 'SHOW_EMAIL_IN_PROFILE_DESCRIPTION',
    defaultValue: false,
    fieldType: 'boolean',
    category: userSchemaCategories.settings.name,
  },
  {
    name: 'use_usa_dates',
    labelId: 'PREFERRED_DATE_FORMAT',
    defaultValue: true,
    fieldType: 'select',
    choices: [
      {
        value: true,
        label: 'MM-DD-YYYY',
      },
      {
        value: false,
        label: 'DD-MM-YYYY',
      },
    ],
    category: userSchemaCategories.settings.name,
  },
  {
    name: 'locale',
    labelId: 'LOCALE',
    defaultValue: 'en',
    fieldType: 'select',
    choices: [
      {
        value: 'en',
        label: 'English',
      },
      {
        value: 'es',
        label: 'Spanish',
      },
    ],
    category: userSchemaCategories.settings.name,
  },
  {
    name: 'footer_logo',
    labelId: 'FOOTER_LOGO',
    descriptionId: 'FOOTER_LOGO_DESCRIPTION',
    fieldType: 'file',
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    defaultValue: null,
    category: userSchemaCategories.settings.name,
  },
  {
    name: 'email',
    labelId: 'EMAIL_ADDRESS',
    defaultValue: '',
    fieldType: 'string',
    requiredForUserCreation: true,
  },
  {
    name: 'password',
    labelId: 'PASSWORD',
    defaultValue: '',
    fieldType: 'password',
    category: userSchemaCategories.settings.name,
    requiredForUserCreation: true,
  },
  {
    name: 'role',
    labelId: 'ROLE',
    defaultValue: ['user'],
    fieldType: 'multiselect',
    choices: [
      {
        value: 'user',
        label: 'User',
      },
      {
        value: 'admin',
        label: 'Administrator',
      },
      {
        value: 'machinelearning',
        label: 'Machine Learning',
      },
    ],
    requiredForUserCreation: true,
  },
];

export default userSchema;
