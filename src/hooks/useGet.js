import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

function refreshNoop() {
  console.warning(
    'refresh is not implemented for useGet - replace with react-query invalidation logic instead.',
  );
}

// to do: borrow some logic from error formatter in utils, then delete that function
function formatError(response) {
  try {
    return response?.error ? response.error.toJSON().message : null;
  } catch (e) {
    return 'Error could not be formatted as JSON';
  }
}

export default function useGet({
  queryKey,
  url,
  data,
  params,
  method = 'get',
  dataAccessor = result => result?.data?.data,
  onSuccess = Function.prototype,
  prependHoustonApiUrl = true,
  queryOptions = {},
}) {
  const [displayedError, setDisplayedError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  const apiUrl = prependHoustonApiUrl
    ? `${__houston_url__}/api/v1${url}`
    : url;
  const result = useQuery(
    queryKey,
    async () => {
      const response = await axios.request({
        url: apiUrl,
        method,
        data,
        params,
      });
      const status = response?.status;
      setStatusCode(status);
      if (status === 200) onSuccess(response);
      return response;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      ...queryOptions,
    },
  );

  const error = formatError(result);

  useEffect(
    () => {
      if (error) {
        setDisplayedError(error);
      }
    },
    [error],
  );

  return {
    ...result,
    statusCode,
    data: dataAccessor(result),
    loading: result?.isLoading,
    error: displayedError,
    clearError: () => {
      setDisplayedError(null);
    },
    refresh: refreshNoop,
  };
}
