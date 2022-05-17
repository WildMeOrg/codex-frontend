import axios from 'axios';
import { get } from 'lodash-es';

import { isProgressSettled } from '../../utils/progressUtils';

const POLLING_INTERVAL = 2000; // milliseconds

function deriveRefetchInterval(queryData, query) {
  const data = queryData || {};
  const { error } = query.state;

  return isProgressSettled(data, error) ? false : POLLING_INTERVAL;
}

export const queryOptions = {
  refetchInterval: deriveRefetchInterval,
};

export async function getProgress({ queryKey }) {
  const progressGuid = get(queryKey, 1);
  const apiUrl = `${__houston_url__}/api/v1/progress/${progressGuid}`;
  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    const status = get(error, 'response.status');
    throw { message: error?.message, statusCode: status };
  }
}
