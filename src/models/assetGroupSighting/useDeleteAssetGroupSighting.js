import axios from 'axios';
import { useMutation } from 'react-query';

export default function useDeleteAssetGroupSighting() {
  const mutation = useMutation(async assetGroupSightingId => {
    return axios.request({
      url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
      withCredentials: true,
      method: 'delete',
    });
  });

  const deleteAssetGroupSighting = assetGroupSightingId =>
    mutation.mutateAsync(assetGroupSightingId);

  const error = mutation?.error
    ? mutation?.error.toJSON().message
    : null;

  return {
    ...mutation,
    deleteAssetGroupSighting,
    error,
  };
}
