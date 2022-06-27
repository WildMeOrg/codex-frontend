import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useKeywords() {
  return useFetch({
    queryKey: queryKeys.keywords,
    url: '/keywords/',
  });
}
