import { useEffect, useMemo, useState } from 'react';
import { QueryObserver, useQueryClient } from 'react-query';
import { getProgressQueryKey } from '../../constants/queryKeys';
import {
  isProgressRejected,
  isProgressResolved,
} from '../../utils/progressUtils';
import {
  getProgress,
  queryOptions as defaultQueryOptions,
} from './progressQueryDefaults';

export const progressState = {
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const defaultState = {};

export default function useProgressStateQuery(progressGuid) {
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
      });
    },
    [progressGuid, queryClient],
  );

  useEffect(
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
