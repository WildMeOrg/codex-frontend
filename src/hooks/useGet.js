import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

function refreshNoop() {
  console.warning(
    'refresh is not implemented for useGet - replace with react-query invalidation logic instead.',
  );
}

export default function useGet({
  queryKey,
  url,
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
        method: 'get',
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

  const error = result?.error
    ? result?.error?.toJSON()?.message
    : null;

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
    data: result?.data?.data,
    loading: result?.isLoading,
    error: displayedError,
    onClearError: () => {
      setDisplayedError(null);
    },
    refresh: refreshNoop,
  };
}
