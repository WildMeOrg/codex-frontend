import { useEffect, useMemo, useState } from 'react';
import { QueryObserver, useQueryClient } from 'react-query';
import { getProgressQueryKey } from '../../constants/queryKeys';
import { progressState } from '../../constants/progress';
import {
  isProgressRejected,
  isProgressResolved,
} from '../../utils/progressUtils';
import {
  getProgress,
  queryOptions as defaultQueryOptions,
} from './progressQueryDefaults';

const defaultState = {};

export default function useProgressStateQuery(
  progressGuid,
  queryOptions,
) {
  const [state, setState] = useState(defaultState);
  const queryClient = useQueryClient();
  const queryObserver = useMemo(
    () => {
      if (!progressGuid) return null;

      return new QueryObserver(queryClient, {
        queryKey: getProgressQueryKey(progressGuid),
        queryFn: getProgress,
        ...defaultQueryOptions,
        notifyOnChangeProps: ['isFetched', 'data', 'error'],
        ...queryOptions,
      });
    },
    [progressGuid, queryClient, queryOptions],
  );

  useEffect(
    /* eslint-disable consistent-return */
    () => {
      if (queryObserver) {
        const unsubscribe = queryObserver.subscribe(
          ({ data, error, isFetched }) => {
            const isResolved = isProgressResolved(data, error);
            if (isResolved) {
              setState(prev =>
                prev?.state === progressState.resolved
                  ? prev
                  : { state: progressState.resolved },
              );
              unsubscribe();
              return;
            }

            const isRejected = isProgressRejected(data, error);
            if (isRejected) {
              setState(prev =>
                prev?.state === progressState.rejected
                  ? prev
                  : { state: progressState.rejected, error },
              );
              unsubscribe();
              return;
            }

            if (isFetched) {
              setState(prev =>
                prev?.state === progressState.pending
                  ? prev
                  : { state: progressState.pending },
              );
              return;
            }

            setState(defaultState);
          },
        );

        return function cleanup() {
          unsubscribe();
        };
      }
    },
    [queryObserver],
  );

  return state;
}
