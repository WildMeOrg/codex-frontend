import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useQueryIndividuals() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(null);
  const [response, setResponse] = useState(null);

  const queryIndividuals = async queryString => {
    try {
      const rawResponse = await axios.request({
        url: `${__houston_url__}/api/v1/search/individuals`,
        method: 'post',
        data: {
          _source: ['alias', 'name', 'id', 'last_sighting'],
          query: {
            query_string: {
              query: `*${queryString}*`,
              fields: ['alias', 'name', 'id'],
            },
          },
        },
      });

      const responseStatusCode = get(response, ['status']);
      setStatusCode(responseStatusCode);
      const successful = responseStatusCode === 200;
      if (!successful) setError(formatError(response));
      setLoading(false);

      const hits = get(rawResponse, ['data', 'hits', 'hits'], []);
      const hitSources = hits.map(hit => get(hit, '_source'));
      setResponse(hitSources);
    } catch (fetchError) {
      const responseStatusCode = get(fetchError, [
        'response',
        'status',
      ]);
      setStatusCode(responseStatusCode);
      console.error('Error querying individuals');
      console.error(fetchError);
      setError(formatError(fetchError));
      setLoading(false);
    }
  };

  return {
    data: response,
    queryIndividuals,
    statusCode,
    loading,
    error,
  };
}
