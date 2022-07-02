import useFetch from '../../hooks/useFetch';
import queryKeys from '../../constants/queryKeys';

export default function useSageJobs() {
  return useFetch({
    queryKey: queryKeys.sageJobs,
    url: '/sage/jobs',
    queryOptions: {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}
