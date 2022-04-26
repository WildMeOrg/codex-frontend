import useFetch from '../../hooks/useFetch';
import { getSightingMatchResultsQueryKey } from '../../constants/queryKeys';

export default function useMatchResults(sightingGuid) {
  return useFetch({
    url: `/sightings/${sightingGuid}/id_result`,
    queryKey: getSightingMatchResultsQueryKey(sightingGuid),
  });
}
