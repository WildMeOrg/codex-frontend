import { get } from 'lodash-es';

import useSiteSettings from '../models/site/useSiteSettings';

export default function useGoogleMapsApiKey() {
  return get(useSiteSettings(), [
    'data',
    'googleMapsApiKey',
    'value',
  ]);
}
