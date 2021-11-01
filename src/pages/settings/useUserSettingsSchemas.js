import { createFieldSchema } from '../../utils/fieldUtils';

import fieldTypes from '../../constants/fieldTypesNew';

const notificationSettings = [
  createFieldSchema(fieldTypes.boolean, {
    name: 'notification_preferences.all.email',
    labelId: 'ALL_NOTIFICATION_EMAILS',
    descriptionId: 'ALL_NOTIFICATION_EMAILS_DESCRIPTION',
  }),
  createFieldSchema(fieldTypes.boolean, {
    name: 'notification_preferences.collaboration_request.email',
    labelId: 'COLLABORATION_REQUESTS',
    descriptionId: 'COLLABORATION_REQUESTS_DESCRIPTION',
  }),
  createFieldSchema(fieldTypes.boolean, {
    name: 'notification_preferences.collaboration_edit_request.email',
    labelId: 'COLLABORATION_EDIT_REQUESTS',
    descriptionId: 'COLLABORATION_EDIT_REQUESTS_DESCRIPTION',
  }),
  createFieldSchema(fieldTypes.boolean, {
    name: 'notification_preferences.individual_merge_request.email',
    labelId: 'INDIVIDUAL_MERGE_REQUESTS',
    descriptionId: 'INDIVIDUAL_MERGE_REQUESTS_DESCRIPTION',
  }),
  // createFieldSchema(fieldTypes.boolean, {
  //   name: 'notification_preferences.merge_request.email',
  //   labelId: 'INDIVIDUAL_MERGE_REQUESTS',
  //   descriptionId: 'INDIVIDUAL_MERGE_REQUESTS_DESCRIPTION',
  // }),
];

export function useNotificationSettingsSchemas() {
  return notificationSettings;
}
