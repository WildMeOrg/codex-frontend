import { useDelete } from '../../hooks/useMutate';
import { getIndividualQueryKey } from '../../constants/queryKeys';

export default function useDeleteRelationship() {
  return useDelete({
    deriveUrl: ({ relationshipGuid }) =>
      `/relationships/${relationshipGuid}`,
    deriveFetchKeys: ({ individualGuid }) => [
      getIndividualQueryKey(individualGuid),
    ],
  });
}
