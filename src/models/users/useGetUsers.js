import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetUsers() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setRefreshCount(refreshCount + 1);
  }

  useEffect(
    () => {
      const getUsers = async (limit = 20, offset = 0) => {
        try {
          setLoading(true);
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/users/`,
            method: 'get',
            data: {
              limit,
              offset,
            },
          });
          const responseData = get(response, 'data');
          setData(responseData);
          setLoading(false);
        } catch (fetchError) {
          console.error('Error fetching users');
          console.error(fetchError);
          setError(fetchError);
          setLoading(false);
        }
      };

      getUsers();
    },
    [refreshCount],
  );

  return { data, loading, error, setError, refresh };
}
