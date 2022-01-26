import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetSiteInfo() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSiteInfo = async () => {
      try {
        const response = await axios.request({
          url: `${__houston_url__}/api/v1/site-settings/site-info/`,
          method: 'get',
        });
        setData(get(response, 'data'));
        setLoading(false);
      } catch (fetchError) {
        console.error('Error fetching site-info');
        console.error(fetchError);
        setError(fetchError);
        setLoading(false);
      }
    };

    getSiteInfo();
  }, []);

  return { data, loading, error };
}
