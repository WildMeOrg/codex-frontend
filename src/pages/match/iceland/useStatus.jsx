import { useEffect, useState } from 'react';
import { get } from 'lodash-es';
import axios from 'axios';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function useAcmImageData(key) {
  /* Optional key causes re-fetch when the key is updated */
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          await sleep(400);
          const response = await axios(
            'https://nextgen.dev-wildbook.org/api/v0/UserValue/iceland',
          );
          setData(get(response, ['data', 'response'], {}));
          setLoading(false);
          setError(false);
        } catch (fetchError) {
          setError(fetchError);
          setLoading(false);
          console.error('Error fetching Iceland status data');
          console.error(fetchError);
        }
      };

      fetchData();
    },
    [key],
  );

  return { data, loading, error, setError, setLoading };
}
