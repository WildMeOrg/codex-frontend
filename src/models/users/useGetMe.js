import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import * as Sentry from '@sentry/react';
import { AppContext, setMe } from '../../context';
import { houstonUrl } from '../../constants/urls';

export default function useGetMe() {
  const { state, dispatch } = useContext(AppContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { me } = state;

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.request({
          url: `${houstonUrl}/api/v1/users/me`,
          method: 'get',
        });
        const meData = get(response, 'data');
        dispatch(setMe(meData));
        setLoading(false);

        if (!__DEV__) {
          Sentry.setUser({
            email: get(meData, 'email'),
            id: get(meData, 'guid'),
            username: get(meData, 'full_name'),
          });
        }
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
