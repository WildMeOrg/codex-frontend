import useFetch from '../../hooks/useFetch';
import { getIndividualGuidQueryKey } from '../../constants/queryKeys';

export default function useQueryIndividualsByGuid(
  individualGuids = [],
) {
  const query = {
    bool: {
      minimum_should_match: 1,
      should: individualGuids.map(guid => ({ term: { guid } })),
    },
  };

  return useFetch({
    method: 'post',
    url: '/individuals/search',
    queryKey: getIndividualGuidQueryKey(individualGuids),
    data: query,
    queryOptions: {
      enabled:
        Array.isArray(individualGuids) && individualGuids.length > 0,
    },
  });
}
