import axios from 'axios';
import { useQuery } from 'react-query';
import { getAuditLogQueryKey } from '../../constants/queryKeys';

export default function useGetAuditLogs(entity_guid) {
  const result = useQuery(
    getAuditLogQueryKey(entity_guid),
    async () => {
      const response = await axios.request({
        url: `${__houston_url__}/api/v1/audit_logs/${entity_guid}`,
        method: 'get',
      });
      return response;
    },
    {
      staleTime: Infinity,
      enabled: Boolean(entity_guid),
      retry: 1,
    },
  );

  const { data, isLoading, error } = result;

  return {
    data: data?.data,
    isLoading,
    error: error ? error.toJSON().message : null,
  };
}
