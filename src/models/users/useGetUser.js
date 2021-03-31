import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetMe(userId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.request({
          url: `${__houston_url__}/api/v1/users/${userId}`,
          method: 'get',
        });
        console.log(response);
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

    getMe();
  }, []);

  return { data, loading, error, setError };
}
