import { usePost } from '../../hooks/useMutate';
import { getIndividualQueryKey } from '../../constants/queryKeys';

export default function usePostRelationship() {
  return usePost({
    url: '/relationships/',
    deriveData: ({
      individual_1_guid,
      individual_2_guid,
      individual_1_role_guid,
      individual_2_role_guid,
      type_guid,
    }) => ({
      individual_1_guid,
      individual_2_guid,
      individual_1_role_guid,
      individual_2_role_guid,
      type_guid,
    }),
    deriveFetchKeys: ({ individual_1_guid, individual_2_guid }) => [
      getIndividualQueryKey(individual_1_guid),
      getIndividualQueryKey(individual_2_guid),
    ],
  });
}
