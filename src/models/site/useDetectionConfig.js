import { get } from 'lodash-es';
import queryKeys from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useDetectionConfig() {
  return useGet({
    queryKey: queryKeys.detectionConfig,
    url: '/site-settings/detection',
    dataAccessor: response =>
      get(response, ['data', 'data', 'detection_config'], {}),
  });
}
