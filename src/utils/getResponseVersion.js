import { get } from 'lodash-es';

export default function getResponseVersion(packet) {
  return get(packet, 'data.response.version');
}
