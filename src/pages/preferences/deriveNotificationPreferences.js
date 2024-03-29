import { get, has } from 'lodash-es';

export function deriveNotificationPreferences(backendData, formData) {
  function deriveValue(path, defaultValue) {
    const formValue = get(formData, path);
    if (has(formData, path)) return formValue;
    return get(backendData, path, defaultValue);
  }

  return {
    all: {
      restAPI: deriveValue(
        'notification_preferences.all.restAPI',
        true,
      ),
      email: deriveValue('notification_preferences.all.email', false),
    },
    collaboration_edit_request: {
      restAPI: deriveValue(
        'notification_preferences.collaboration_edit_request.restAPI',
        true,
      ),
      email: deriveValue(
        'notification_preferences.collaboration_edit_request.email',
        false,
      ),
    },
    collaboration_request: {
      restAPI: deriveValue(
        'notification_preferences.collaboration_request.restAPI',
        true,
      ),
      email: deriveValue(
        'notification_preferences.collaboration_request.email',
        false,
      ),
    },
    individual_merge_all: {
      restAPI: deriveValue(
        'notification_preferences.individual_merge_all.restAPI',
        true,
      ),
      email: deriveValue(
        'notification_preferences.individual_merge_all.email',
        false,
      ),
    },
    // raw: {
    //   restAPI: deriveValue(
    //     'notification_preferences.raw.restAPI',
    //     true,
    //   ),
    //   email: deriveValue('notification_preferences.raw.email', false),
    // },
  };
}
