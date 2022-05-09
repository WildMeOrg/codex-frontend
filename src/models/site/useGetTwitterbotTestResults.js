import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetTwitterbotTestResults() {
  console.log('deleteMe useGetTwitterbotTestResults is being called');
  return useFetch({
    queryKey: queryKeys.settingsConfig,
    url: '/site-settings/test/intelligent_agent_twitterbot',
    dataAccessor: result => result,
  });
}
