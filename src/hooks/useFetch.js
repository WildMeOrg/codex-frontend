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

export default function useFetch({
  queryKey,
  url,
  data,
  params,
  method = 'get',
  dataAccessor = result => result?.data?.data,
  onSuccess = Function.prototype,
  prependHoustonApiUrl = true,
  queryOptions = {},
  responseType = 'json',
}) {
  // console.log('data',data);
  const [displayedError, setDisplayedError] = useState(null);
  const [displayedLoading, setDisplayedLoading] = useState(
    !queryOptions.disabled, // should this use enabled instead of disabled? I couldn't find anything in the react-query documentation about disabled.
                            //agreed, I think it should be enabled
    );
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
        responseType: responseType,
      });
      const status = response?.status;
      setStatusCode(status);
      if (status === 200) {
        onSuccess(response);
      }
      return response;
    },
    {          
      ...queryOptions,
      staleTime: Infinity,
      cacheTime: Infinity,  
      refetchOnMount: 'always',
    },
  );

  const error = formatError(result);
  const statusCodeFromError = result?.error?.response?.status;
  useEffect(() => {
    if (result?.status === 'loading') {
      setDisplayedLoading(true);
    } else {
      if (statusCode !== statusCodeFromError)
        setStatusCode(statusCodeFromError);
      if (displayedError !== error) setDisplayedError(error);
      setDisplayedLoading(false);
    }
  }, [
    error,
    result?.status,
    statusCodeFromError,
    statusCode,
    displayedError,
  ]);

  return {
    ...result,
    statusCode,
    data: dataAccessor(result),
    isLoading: displayedLoading,
    loading: displayedLoading,
    error: displayedError,
    clearError: () => {
      setDisplayedError(null);
    },
    refresh: refreshNoop,
  };
}
