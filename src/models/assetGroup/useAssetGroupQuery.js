import axios from 'axios';
import { useQuery } from 'react-query';
import { get } from 'lodash-es';

import { getAssetGroupQueryKey } from '../../constants/queryKeys';

export async function getAssetGroup({ queryKey }) {
  const assetGroupGuid = get(queryKey, 1);
  const apiUrl = `${__houston_url__}/api/v1/asset_groups/${assetGroupGuid}`;
  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    const status = get(error, 'response.status');
    throw { message: error?.message, statusCode: status };
  }
}

export default function useAssetGroupQuery(assetGroupGuid) {
  return useQuery(
    getAssetGroupQueryKey(assetGroupGuid),
    getAssetGroup,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: Boolean(assetGroupGuid),
    },
  );
}
