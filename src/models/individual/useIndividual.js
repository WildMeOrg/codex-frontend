import { getIndividualQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useIndividual(individualId) {
  return useGet({
    queryKey: getIndividualQueryKey(individualId),
    url: `/individuals/${individualId}`,
    queryOptions: {
      enabled: Boolean(individualId),
    },
  });
}
