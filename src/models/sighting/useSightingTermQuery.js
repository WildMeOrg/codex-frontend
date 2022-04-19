import useFetch from '../../hooks/useFetch';
import { getSightingTermQueryKey } from '../../constants/queryKeys';

export default function useSightingTermQuery(searchTerm) {
  const query = {
    query_string: {
      query: `*${searchTerm}*`,
      fields: [
        'guid',
        'verbatimLocality',
        'owners.full_name',
        'comments',
        'locationId_value',
      ],
    },
  };

  return useFetch({
    method: 'post',
    url: '/sightings/search',
    queryKey: getSightingTermQueryKey(searchTerm),
    data: query,
    queryOptions: {
      enabled: Boolean(searchTerm),
    },
  });
}
