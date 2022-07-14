import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useAssetGroup(
  queryOptions = {},
)
{
  return useFetch({
    queryKey: queryKeys.socialGroups,
    url: `/social-groups`,
    queryOptions,
  });
}

