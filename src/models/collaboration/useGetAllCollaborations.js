import axios from 'axios';
import { useQuery } from 'react-query';
import queryKeys from '../../constants/queryKeys';

export default function useGetAllCollaborations() {
  const result = useQuery(
    queryKeys.collaborations,
    async () => {
      const response = await axios.request({
        url: `${__houston_url__}/api/v1/collaborations`,
        method: 'get',
      });
      return response;
    },
    {
      staleTime: Infinity,
    },
  );

  const { data, isLoading, error } = result;
  return {
    allCollaborationData: data?.data,
    allCollaborationsLoading: isLoading,
    allCollaborationsError: error ? error.toJSON().message : null,
  };
}
