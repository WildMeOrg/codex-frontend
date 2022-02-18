import queryKeys from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useKeywords() {
  return useGet({
    queryKey: queryKeys.keywords,
    url: '/keywords/',
  });
}
