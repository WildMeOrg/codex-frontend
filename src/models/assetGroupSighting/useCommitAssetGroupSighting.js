import axios from 'axios';
import { useMutation } from 'react-query';

export default function useCommitAssetGroupSighting() {
  const mutation = useMutation(async agsId =>
    axios.request({
      url: `${__houston_url__}/api/v1/asset_groups/sighting/${agsId}/commit`,
      method: 'post',
    }),
  );

  const commitAgs = agsId => mutation.mutate(agsId);

  return {
    commitAgs,
    ...mutation,
  };
}
