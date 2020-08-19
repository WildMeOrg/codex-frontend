import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setMe } from '../../context';

export default function useGetMe() {
  const { state, dispatch } = useContext(AppContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { me } = state;

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.request({
          url: 'http://localhost:5000/api/v1/users/me',
          method: 'get',
        });
        dispatch(setMe(get(response, 'data')));
        setLoading(false);
      } catch (fetchError) {
        console.error('Error fetching /me');
        console.error(fetchError);
        setError(fetchError);
        setLoading(false);
      }
    };

    getMe();
  }, []);

  return { data: me, loading, error };
}
