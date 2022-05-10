import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetTwitterbotTestResults(disabled) {
  return useFetch({
    queryKey: queryKeys.twitterBotTestResults,
    url: '/site-settings/test/intelligent_agent_twitterbot',
    queryOptions: {
      retry: 1,
      disabled,
    },
  });
}
