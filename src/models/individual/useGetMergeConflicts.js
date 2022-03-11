import { getMergeConflictsQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useGetMergeConflicts(individualIds) {
  return useGet({
    queryKey: getMergeConflictsQueryKey(individualIds),
    method: 'post',
    url: `/individuals/merge_conflict_check`,
    data: individualIds,
    queryOptions: {
      enabled: Boolean(individualIds),
    },
  });
}
