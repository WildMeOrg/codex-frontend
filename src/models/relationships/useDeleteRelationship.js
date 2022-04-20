import { useDelete } from '../../hooks/useMutate';
import { getIndividualQueryKey } from '../../constants/queryKeys';

export default function useDeleteRelationship() {
  return useDelete({
    deriveUrl: ({ relationshipGuid }) => `/users/${relationshipGuid}`,
    deriveFetchKeys: ({ individualGuid }) => [
      getIndividualQueryKey(individualGuid),
    ],
  });
}
