const projectSchema = [
  {
    name: 'name',
    labelId: 'PROJECT_NAME',
    defaultValue: '',
    required: true,
    fieldType: 'string',
  },
  {
    name: 'project_id',
    labelId: 'PROJECT_ID',
    defaultValue: '',
    required: true,
    fieldType: 'projectId',
  },
  {
    name: 'description',
    labelId: 'DESCRIPTION',
    defaultValue: '',
    fieldType: 'longstring',
  },
];

export default projectSchema;
