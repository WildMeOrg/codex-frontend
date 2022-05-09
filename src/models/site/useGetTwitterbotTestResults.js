import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetTwitterbotTestResults() {
  return useFetch({
    queryKey: queryKeys.settingsConfig,
    url: '/site-settings/test/intelligent_agent_twitterbot',
    dataAccessor: result => result,
  });
}
