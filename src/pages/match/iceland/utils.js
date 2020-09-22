import { get } from 'lodash-es';

export function getFeature(annotation, feature) {
  return get(annotation, ['asset', 'features', '0', feature]);
}
