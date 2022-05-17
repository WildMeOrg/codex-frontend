import { useRef } from 'react';
import { useQuery } from 'react-query';

import { getProgressQueryKey } from '../../constants/queryKeys';
import { isProgressSettled } from '../../utils/progressUtils';
import {
  getProgress,
  queryOptions as defaultQueryOptions,
} from './progressQueryDefaults';

export default function useProgressQuery(progressGuid, queryOptions) {
  const isSettledRef = useRef(false);

  const result = useQuery(
    getProgressQueryKey(progressGuid),
    getProgress,
    {
      ...defaultQueryOptions,
      enabled: Boolean(progressGuid && !isSettledRef.current),
      ...queryOptions,
    },
  );

  const isSettled = isProgressSettled(result?.data, result?.error);
  if (isSettled && !isSettledRef.current) isSettledRef.current = true;

  return result;
}
