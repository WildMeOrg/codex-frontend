import { getIndividualMergeRequestQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useIndividualMergeRequest(mergeRequestGuid) {
  return useFetch({
    queryKey: getIndividualMergeRequestQueryKey(mergeRequestGuid),
    url: `/individuals/merge_request/${mergeRequestGuid}`,
    queryOptions: {
      enabled: Boolean(mergeRequestGuid),
    },
  });
}
