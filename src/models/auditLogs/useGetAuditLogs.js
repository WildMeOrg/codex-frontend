import { getAuditLogQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetAuditLogs(entity_guid) {
  return useFetch({
    queryKey: entity_guid ? getAuditLogQueryKey(entity_guid) : getAuditLogQueryKey(),
    url:  entity_guid ? `/audit_logs/${entity_guid}` : '/audit_logs',
    queryOptions: {
      enabled: Boolean(entity_guid),
      retry: 1,
    },
  });
}

export function useGetAllAuditLogs() {
  return useFetch({
    queryKey: getAuditLogQueryKey(),
    url: '/audit_logs',
    queryOptions: {
      enabled: true,
      retry: 1,
    },
  });
}
