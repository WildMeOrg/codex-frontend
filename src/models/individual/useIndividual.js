import { getIndividualQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useIndividual(individualId) {
  return useFetch({
    queryKey: getIndividualQueryKey(individualId),
    url: `/individuals/${individualId}`,
    queryOptions: {
      enabled: Boolean(individualId),
    },
  });
}
