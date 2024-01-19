import { get } from 'lodash-es';

export function getHighestRoleLabelId(userData) {
  if (get(userData, 'is_staff')) return 'STAFF';
  if (get(userData, 'is_admin')) return 'ADMINISTRATOR';
  if (get(userData, 'is_user_manager')) return 'USER_MANAGER';
  if (get(userData, 'is_researcher')) return 'RESEARCHER';
  if (get(userData, 'is_contributor')) return 'CONTRIBUTOR';
  return 'USER';
}
