import { get } from 'lodash-es';

import { usePatch } from '../../hooks/useMutate';
import queryKeys, {
  getUserQueryKey,
} from '../../constants/queryKeys';

function getPasswordTest(password) {
  return password
    ? [
        {
          op: 'test',
          path: '/current_password',
          value: password,
        },
      ]
    : [];
}

export function useReplaceUserProperty() {
  return usePatch({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ path, value }) => [{ op: 'replace', path, value }],
    deriveQueryKeys: ({ userGuid }) => [
      getUserQueryKey(userGuid),
      queryKeys.me,
      queryKeys.users,
    ],
  });
}

export function useReplaceUserProperties() {
  return usePatch({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ properties, password }) => {
      const propertyData = properties.map(p => ({
        op: 'replace',
        path: get(p, 'path'),
        value: get(p, 'value'),
      }));
      const passwordTest = getPasswordTest(password);
      return [...passwordTest, ...propertyData];
    },
    deriveQueryKeys: ({ userGuid }) => [
      getUserQueryKey(userGuid),
      queryKeys.me,
      queryKeys.users,
    ],
  });
}

export function useRemoveUserProperty() {
  return usePatch({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ path, password }) => {
      const propertyPatch = [{ op: 'remove', path }];
      const passwordTest = getPasswordTest(password);
      return [...passwordTest, ...propertyPatch];
    },
    deriveQueryKeys: ({ userGuid }) => [
      getUserQueryKey(userGuid),
      queryKeys.me,
      queryKeys.users,
    ],
  });
}
