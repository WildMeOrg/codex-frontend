import useFetch from '../../hooks/useFetch';
import { getIndividualTermQueryKey } from '../../constants/queryKeys';

export default function useIndividualTermQuery(searchTerm) {
  const query = {
    query_string: {
      query: `*${searchTerm}*`,
      fields: ['adoptionName', 'firstName', 'guid'],
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
