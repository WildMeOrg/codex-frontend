import { useDelete } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useDeleteSiteSetting() {
  return useDelete({
    deriveUrl: ({ property }) => `/site-settings/data/${property}`,
    fetchKeys: [queryKeys.settingsSchema],
  });
}
