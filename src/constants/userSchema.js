const userSchema = [
  {
    name: 'affiliation',
    labelId: 'AFFILIATION',
    defaultValue: '',
    fieldType: 'string',
  },
  {
    name: 'location',
    labelId: 'LOCATION',
    defaultValue: '',
    fieldType: 'string',
  },
  {
    name: 'website',
    labelId: 'WEBSITE',
    defaultValue: '',
    fieldType: 'string',
  },
  {
    name: 'forum_id',
    labelId: 'FORUM_USERNAME',
    defaultValue: '',
    fieldType: 'string',
  },
  {
    name: 'email',
    labelId: 'EMAIL_ADDRESS',
    defaultValue: '',
    fieldType: 'string',
    adminOnly: true,
  },
  {
    name: 'password',
    labelId: 'PASSWORD',
    defaultValue: '',
    fieldType: 'string',
    adminOnly: true,
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
    adminOnly: true,
  },
];

export default userSchema;
