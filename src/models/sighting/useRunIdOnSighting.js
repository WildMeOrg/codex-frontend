import { usePost } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';

export default function useRunIdOnSighting() {
  return usePost({
    deriveUrl: ({ sightingGuid }) =>
      `/sightings/${sightingGuid}/rerun_id`,
    deriveData: ({ data }) => data,
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
