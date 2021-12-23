import axios from 'axios';
import { useQuery } from 'react-query';

import { getAGSQueryKey } from '../../constants/queryKeys';

export default function useAssetGroupSighting(assetGroupSightingId) {
  const result = useQuery(
    getAGSQueryKey(assetGroupSightingId),
    async () => {
      return axios.request({
        url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
        method: 'get',
      });
    },
    {
      refetchInterval: 5000,
      enabled: Boolean(assetGroupSightingId),
    },
  );

  const { data, isLoading, error } = result;

  return {
    ...result,
    data: data?.data,
    loading: isLoading,
    error: error ? error.toJSON().message : null,
  };
}
