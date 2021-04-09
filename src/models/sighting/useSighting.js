import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useSighting(sightingId) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sightingData, setSightingData] = useState(null);

  useEffect(
    () => {
      const fetchSightingData = async () => {
        try {
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/sightings/${sightingId}`,
            method: 'get',
          });

          const successful = get(response, ['status']) === 200;
          if (!successful) setError(formatError(response));

          setLoading(false);
          setSightingData(get(response, ['data']));
        } catch (fetchError) {
          console.error(`Error fetching sighting ${sightingId}`);
          console.error(fetchError);
          setError(formatError(fetchError));
          setLoading(false);
        }
      };

      fetchSightingData();
    },
    [sightingId],
  );

  return { data: sightingData, loading, error };
}
