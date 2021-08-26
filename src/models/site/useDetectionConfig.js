import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useDetectionConfig() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetectionConfig = async () => {
      try {
        const response = await axios.request({
          url: `${__houston_url__}/api/v1/config/detection/`,
          method: 'get',
        });
        setData(get(response, ['data', 'detection_config']));
        setLoading(false);
      } catch (fetchError) {
        console.error('Error fetching detection config');
        console.error(fetchError);
        setError(fetchError);
        setLoading(false);
      }
    };

    getDetectionConfig();
  }, []);

  return { data, loading, error };
}
