import useFetch from '../../hooks/useFetch';
import { getIndividualGuidSearchQueryKey } from '../../constants/queryKeys';

export default function useQueryIndividualsByGuid(
  individualGuids = [],
) {
  const query = {
    terms: { guid: individualGuids },
  };

  return useFetch({
    method: 'post',
    url: '/individuals/search',
    queryKey: getIndividualGuidSearchQueryKey(individualGuids),
    data: query,
    queryOptions: {
      enabled:
        Array.isArray(individualGuids) && individualGuids.length > 0,
    },
  });
}
