import useFetch from '../../hooks/useFetch';
import { getSightingTermQueryKey } from '../../constants/queryKeys';

export default function useSightingTermQuery(searchTerm) {
  const query = {
    bool: {
      minimum_should_match: 1,
      should: [
        { match_phrase_prefix: { guid: { query: searchTerm } } },
        {
          query_string: {
            query: `*${searchTerm}*`,
            fields: [
              'verbatimLocality',
              'owners.full_name',
              'locationId_value',
            ],
          },
        },
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
