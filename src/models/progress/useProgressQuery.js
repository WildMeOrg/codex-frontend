import { useRef } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { get } from 'lodash-es';

import { getProgressQueryKey } from '../../constants/queryKeys';
import { isProgressSettled } from '../../utils/progressUtils';

const POLLING_INTERVAL = 2000; // milliseconds

function deriveRefetchInterval(queryData, query) {
  const data = queryData || {};
  const { error } = query.state;

  return isProgressSettled(data, error) ? false : POLLING_INTERVAL;
}

async function getProgress({ queryKey }) {
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

export default function useProgressQuery(progressGuid, queryOptions) {
  const isSettledRef = useRef(false);

  const result = useQuery(
    getProgressQueryKey(progressGuid),
    getProgress,
    {
      refetchInterval: deriveRefetchInterval,
      enabled: Boolean(progressGuid && !isSettledRef.current),
      ...queryOptions,
    },
  );

  const isSettled = isProgressSettled(result?.data, result?.error);
  if (isSettled && !isSettledRef.current) isSettledRef.current = true;

  return result;
}
