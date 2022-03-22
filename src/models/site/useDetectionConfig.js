import { get } from 'lodash-es';
import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useDetectionConfig() {
  return useFetch({
    queryKey: queryKeys.detectionConfig,
    url: '/site-settings/detection',
    dataAccessor: response =>
      get(response, ['data', 'data', 'detection_config'], {}),
  });
}
