import useFetch from '../../hooks/useFetch';

export default function useCheckHeatmap(
  url,  
) {
  return useFetch({
    queryKey: 'checkHeatmap',
    url: url,
  });
}
