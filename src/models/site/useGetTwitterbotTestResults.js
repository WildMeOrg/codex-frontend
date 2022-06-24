import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetTwitterbotTestResults(enabled) {
  return useFetch({
    queryKey: queryKeys.twitterBotTestResults,
    url: '/site-settings/test/intelligent_agent_twitterbot',
    queryOptions: {
      enabled,
      retry: 1,
    },
  });
}
