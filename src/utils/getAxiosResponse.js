import { get } from 'lodash-es';

export default function getAxiosResponse(packet) {
  return get(packet, 'data.response.children', null);
}
