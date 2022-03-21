import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useQueryIndividuals() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const [response, setResponse] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  const queryIndividuals = async queryString => {
    try {
      setLoading(true);
      setSearchTerm(queryString);
      const rawResponse = await axios.request({
        url: `${__houston_url__}/api/v1/search/proxy/individuals`,
        method: 'post',
        data: {
          _source: ['alias', 'name', 'id', 'genus', 'species'],
          query: {
            query_string: {
              query: `*${queryString.toLowerCase()}*`,
              fields: ['alias', 'name', 'id'],
            },
          },
        },
      });

      setLoading(false);
      const responseStatusCode = get(rawResponse, ['status']);
      setStatusCode(responseStatusCode);
      const successful = responseStatusCode === 200;
      if (!successful) setError(formatError(response));

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
    searchTerm,
    queryIndividuals,
    statusCode,
    loading,
    error,
  };
}
