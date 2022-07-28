import { usePatch } from '../../hooks/useMutate';
import queryKeys, {
  getSocialGroupQueryKey,
  getIndividualQueryKey,
} from '../../constants/queryKeys';

export default function usePatchSocialGroup() {
  return usePatch({
    deriveUrl: ({ guid }) => `/social-groups/${guid}`,
    deriveData: ({ name, members }) => {
      const patchData = [
        {
          op: 'replace',
          path: '/name',
          value: name,
        },
        {
          op: 'replace',
          path: '/members',
          value: members,
        },
      ];
      return patchData.filter(o => o.value);
    },
    invalidateKeys: [queryKeys.socialGroups],
    deriveFetchKeys: ({ guid, affectedIndividualGuids = [] }) => {
      const individualQueries = affectedIndividualGuids.map(i =>
        getIndividualQueryKey(i),
      );
      return [getSocialGroupQueryKey(guid), ...individualQueries];
    },
  });
}
