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
  const [displayedError, setDisplayedError] = useState(null);
  const [displayedLoading, setDisplayedLoading] = useState(
    !queryOptions.disabled, // should this use enabled instead of disabled? I couldn't find anything in the react-query documentation about disabled.
    // agreed, I think it should be enabled
  );

  const apiUrl = prependHoustonApiUrl
    ? `${__houston_url__}/api/v1${url}1`
    : url;
  const result = useQuery(
    queryKey,
    async () => {
      const response = await axios.request({
        url: apiUrl,
        method,
        data,
        params,
        responseType,
      });
      const status = response?.status;      
      if (status === 200) onSuccess(response);
      return response;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: 'always',
      ...queryOptions,
    },
  );

  const error = formatError(result);
  console.log("error", error);
  console.log("statusCode", result?.data?.status || result?.error?.response?.status);
  const statusCodeFromError = result?.error?.response?.status;
  useEffect(() => {
    if (result?.status === 'loading') {
      setDisplayedLoading(true);
    } else {
      if (displayedError !== error) setDisplayedError(error);
      setDisplayedLoading(false);
    }
  }, [
    error,
    result?.status,
    statusCodeFromError,
    displayedError,
  ]);

  return {
    ...result,
    statusCode: result?.data?.status || result?.error?.response?.status,
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



// import { useState } from 'react';
// import axios from 'axios';
// import { useQuery } from 'react-query';

// function refreshNoop() {
//   console.warning(
//     'refresh is not implemented for useGet - replace with react-query invalidation logic instead.',
//   );
// }

// function formatError(response) {
//   try {
//     return response?.error ? response.error.toJSON().message : null;
//   } catch (e) {
//     return 'Error could not be formatted as JSON';
//   }
// }

// export default function useFetch({
//   queryKey,
//   url,
//   data,
//   params,
//   method = 'get',
//   dataAccessor = result => result?.data?.data,
//   onSuccess = Function.prototype,
//   prependHoustonApiUrl = true,
//   queryOptions = {},
//   responseType = 'json',
// }) {
//   const [displayedError, setDisplayedError] = useState(null);
//   const [displayedLoading, setDisplayedLoading] = useState(
//     !queryOptions.enabled, // should this use enabled instead of disabled? I couldn't find anything in the react-query documentation about disabled.
//     // agreed, I think it should be enabled
//     );
//   let statusCode = null;

//   const apiUrl = prependHoustonApiUrl
//     ? `${__houston_url__}/api/v1${url}`
//     : url;
//   const result = useQuery(
//     queryKey,
//     async () => {
//       try {
//         const response = await axios.request({
//           url: apiUrl,
//           method,
//           data,
//           params,
//           responseType,
//         });
//         const status = response?.status;
//         statusCode = status;
//         console.log("statusCode1",statusCode);
//         // setStatusCode(status);
//         setDisplayedLoading(false);
//         if (status === 200) onSuccess(response);
//         return response;
//       } catch (error) {
//         console.log("error", error);
//         throw error;
//       }
//     },
//     {
//       staleTime: Infinity,
//       cacheTime: Infinity,
//       refetchOnMount: 'always',
//       onError: error => {
//         const formattedError = formatError(error);
//         statusCode = error?.response?.status;
//         console.log("statusCode2",statusCode);
//         setDisplayedError(formattedError);
//         // setStatusCode(status);
//         setDisplayedLoading(false);
//         // displayedLoading = false;
//       },
//       ...queryOptions,
//     },
//   );

//   return {
//     ...result,
//     statusCode: result?.data?.status || result?.error?.response?.status,
//     data: dataAccessor(result),
//     isLoading: result.isLoading,
//     loading: result.isLoading,
//     error: displayedError || formatError(result),
//     clearError: () => {
//       setDisplayedError(null);
//     },
//     refresh: refreshNoop,
//   };
// }
