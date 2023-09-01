import { get, partition } from 'lodash-es';

import useFetch from '../../hooks/useFetch';
import { getAuditLogQueryKey } from '../../constants/queryKeys';

export default function useFilterAuditLogs({ queries, params = {} }) {

  return useFetch({
    method: 'post',
    queryKey: getAuditLogQueryKey(queries, params),
    url: '/audit_logs/search',
    data: queries,
    params: {
      limit: 20,
      offset: 0,
      sort: 'created',
      reverse: false,
      ...params,
    },
    dataAccessor: result => {
        console.log('result', result);
      const resultCountString = get(result, [
        'data',
        'headers',
        'x-total-count',
      ]);
      return {
        resultCount: parseInt(resultCountString, 10),
        results: get(result, ['data', 'data']),
        statusCode: get(result, ['error', 'response', 'data', 'status']),
      };
    },
    queryOptions: {
      retry: 2,
    },
  });
}
