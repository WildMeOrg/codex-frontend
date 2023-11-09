import useFetch from '../../hooks/useFetch';
import { getEncounterTermQueryKey } from '../../constants/queryKeys';

export default function useEncounterTermQuery(searchTerm) {
  const query = {
    bool: {
      minimum_should_match: 1,
      should: [
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
    url: '/encounters/search',
    queryKey: getEncounterTermQueryKey(searchTerm),
    data: query,
    queryOptions: {
      enabled: Boolean(searchTerm),
    },
  });
}
