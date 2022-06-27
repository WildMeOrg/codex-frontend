import { usePatch } from '../../hooks/useMutate';
import queryKeys, { getAGSQueryKey } from '../../constants/queryKeys';
import formatPropertiesForPatch from '../../utils/formatPropertiesForPatch';

export default function usePatchAGS() {
  return usePatch({
    deriveUrl: ({ agsGuid }) =>
      `/asset_groups/sighting/as_sighting/${agsGuid}`,
    deriveData: ({ properties, data }) => {
      if (data) return data;
      return formatPropertiesForPatch(properties);
    },
    deriveFetchKeys: ({ agsGuid }) => [
      getAGSQueryKey(agsGuid),
      queryKeys.assetGroupSightings,
    ],
  });
}
