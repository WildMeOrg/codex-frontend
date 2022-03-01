import { getAuditLogQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useGetAuditLogs(entity_guid) {
  return useGet({
    queryKey: getAuditLogQueryKey(entity_guid),
    url: `/audit_logs/${entity_guid}`,
    queryOptions: {
      enabled: Boolean(entity_guid),
      retry: 1,
    },
  });
}
