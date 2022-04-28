import { usePost } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';

export default function useReviewSighting() {
  return usePost({
    deriveUrl: ({ sightingGuid }) =>
      `/sightings/${sightingGuid}/reviewed`,
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
