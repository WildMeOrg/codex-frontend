import { getAuditLogQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetAuditLogs(entity_guid) {
  return useFetch({
    queryKey: getAuditLogQueryKey(entity_guid),
    url: `/audit_logs/${entity_guid}`,
    queryOptions: {
      enabled: Boolean(entity_guid),
      retry: 1,
    },
  });
}
