import useFetch from '../../hooks/useFetch';
import { getIndividualTermQueryKey } from '../../constants/queryKeys';

export default function useIndividualTermQuery(searchTerm) {
  const query = {
    bool: {
      minimum_should_match: 1,
      should: [
        { term: { guid: searchTerm } },
        {
          query_string: {
            query: `*${searchTerm}*`,
            fields: ['adoptionName', 'firstName'],
          },
        },
      ],
    },
  };

  return useFetch({
    method: 'post',
    url: '/individuals/search',
    queryKey: getIndividualTermQueryKey(searchTerm),
    data: query,
    queryOptions: {
      enabled: Boolean(searchTerm),
    },
  });
}
