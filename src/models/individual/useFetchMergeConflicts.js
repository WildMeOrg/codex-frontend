import { getMergeConflictsQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useFetchMergeConflicts(individualIds) {
  return useFetch({
    queryKey: getMergeConflictsQueryKey(individualIds),
    method: 'post',
    url: `/individuals/merge_conflict_check`,
    data: individualIds,
    queryOptions: {
      enabled: Boolean(individualIds),
    },
  });
}
