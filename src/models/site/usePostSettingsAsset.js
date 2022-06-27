import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePostSettingsAsset() {
  return usePost({
    url: '/site-settings/file/',
    deriveData: ({ data }) => data,
    fetchKeys: [queryKeys.settingsConfig],
  });
}
