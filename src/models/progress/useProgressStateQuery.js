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

export default function useProgressStateQuery(progressGuid, enabled) {
  const [state, setState] = useState(defaultState);
  const queryClient = useQueryClient();
  const queryObserver = useMemo(
    () => {
      if (!progressGuid) return null;

      const observerOptions = {
        ...defaultQueryOptions,
        queryKey: getProgressQueryKey(progressGuid),
        queryFn: getProgress,
        notifyOnPropsChange: ['data', 'error', 'isFetched'],
      };

      if (enabled !== undefined) observerOptions.enabled = enabled;

      return new QueryObserver(queryClient, observerOptions);
    },
    [progressGuid, queryClient, enabled],
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
