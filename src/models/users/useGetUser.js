import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetUser(userId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setRefreshCount(refreshCount + 1);
  }

  useEffect(
    () => {
      const getUser = async () => {
        try {
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/users/${userId}`,
            method: 'get',
          });
          const responseData = get(response, 'data');
          setData(responseData);
          setLoading(false);
        } catch (fetchError) {
          console.error(`Error fetching /user/${userId}`);
          console.error(fetchError);
          setError(fetchError);
          setLoading(false);
        }
      };

      getUser();
    },
    [refreshCount],
  );

  return { data, loading, error, setError, refresh };
}
