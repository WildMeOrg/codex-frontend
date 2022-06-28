import axios from 'axios';
import { useMutation } from 'react-query';
import { useState, useEffect } from 'react';

export default function useDeleteAssetGroupSighting() {
  const [displayedError, setDisplayedError] = useState(null);
  const mutation = useMutation(async assetGroupSightingId =>
    axios.request({
      url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
      withCredentials: true,
      method: 'delete',
    }),
  );

  const deleteAssetGroupSighting = assetGroupSightingId =>
    mutation.mutateAsync(assetGroupSightingId);

  const error = mutation?.error
    ? mutation?.error.toJSON().message
    : null;

  useEffect(() => {
    if (error) setDisplayedError(error);
  }, [error]);

  return {
    ...mutation,
    deleteAssetGroupSighting,
    onClearError: () => setDisplayedError(null),
    error: displayedError,
  };
}
