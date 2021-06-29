import { get } from 'lodash-es';

const keywordColors = [
  '#977602',
  '#023697',
  '#970292',
  '#6A0297',
  '#970202',
  '#976002',
  '#5A5A5A',
  '#02978B',
  '#02972F',
];

export function getKeywordColor(uuid) {
  const x = get(uuid, '0', 'a').charCodeAt();
  const y = get(uuid, '1', 'z').charCodeAt();
  const z = x * y;
  const i = z % (keywordColors.length - 1);
  return keywordColors[i];
}
