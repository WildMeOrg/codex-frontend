import axios from 'axios';
import { get } from 'lodash-es';

export function getFeature(annotation, feature) {
  return get(annotation, ['asset', 'features', '0', feature]);
}

export async function setStatus(id, status) {
  const response = await axios(
    `${__nexgen_url__}/api/v0/UserValue/iceland`,
  );

  const currentValue = get(response, ['data', 'response'], {});

  axios({
    url: `${__nexgen_url__}/api/v0/UserValue/iceland`,
    method: 'post',
    data: {
      ...currentValue,
      [id]: status,
    },
  });
}

export async function setNotes(id, note) {
  const response = await axios(
    `${__nexgen_url__}/api/v0/UserValue/notes`,
  );

  const currentValue = get(response, ['data', 'response'], {});

  axios({
    url: `${__nexgen_url__}/api/v0/UserValue/notes`,
    method: 'post',
    data: {
      ...currentValue,
      [id]: note,
    },
  });
}
