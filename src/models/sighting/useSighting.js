import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { jonUrl } from '../../constants/urls';
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
            url: `${jonUrl}/api/v0/org.ecocean.Occurrence/${sightingId}?detail-org.ecocean.Occurrence=max`,
            method: 'get',
          });

          const successful = get(
            response,
            ['data', 'success'],
            false,
          );
          if (!successful) setError(formatError(response));

          setLoading(false);
          setSightingData(get(response, ['data', 'result']));
        } catch (fetchError) {
          console.error('Error fetching /me');
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
