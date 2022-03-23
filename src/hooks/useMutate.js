import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQueryClient, useMutation } from 'react-query';

const methods = {
  put: 'put',
  post: 'post',
  patch: 'patch',
  delete: 'delete',
};

function formatError(response) {
  try {
    return response?.error ? response.error.toJSON().message : null;
  } catch (e) {
    return 'Error could not be formatted as JSON';
  }
}

export default function useMutate({
  method,
  url,
  deriveUrl = Function.prototype,
  data,
  deriveData = Function.prototype,
  params,
  deriveParams = Function.prototype,
  queryKeys = [],
  deriveQueryKeys = () => [],
  dataAccessor = result => result?.data?.data,
  onSuccess = Function.prototype,
  prependHoustonApiUrl = true,
}) {
  const queryClient = useQueryClient();
  const [displayedError, setDisplayedError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  const mutation = useMutation(async mutationArgs => {
    const urlSuffix = url || deriveUrl(mutationArgs);
    const completeUrl = prependHoustonApiUrl
      ? `${__houston_url__}/api/v1${urlSuffix}`
      : urlSuffix;

    const response = await axios.request({
      url: completeUrl,
      // withCredentials: true,
      method,
      data: data || deriveData(mutationArgs),
      params: params || deriveParams(mutationArgs),
    });
    const status = response?.status;
    setStatusCode(status);
    if (status === 200 || status === 204) {
      const queryKeysFromArgs = deriveQueryKeys(mutationArgs);
      const invalidationKeys = [...queryKeys, ...queryKeysFromArgs];
      invalidationKeys.forEach(queryKey => {
        queryClient.invalidateQueries(queryKey);
      });
      if (displayedError) setDisplayedError(null);
      setSuccess(true);
      onSuccess(response);
    }
    return response;
  });

  const error = formatError(mutation);

  useEffect(
    () => {
      if (error) {
        setDisplayedError(error);
        if (success) setSuccess(null);
      }
    },
    [error],
  );

  const mutate = mutationArgs => mutation.mutateAsync(mutationArgs);

  return {
    ...mutation,
    mutate,
    statusCode,
    data: dataAccessor(mutation),
    loading: mutation?.isLoading,
    error: displayedError,
    clearError: () => setDisplayedError(null),
    success,
    clearSuccess: () => setSuccess(null),
  };
}

export function usePut(args) {
  return useMutate({
    method: methods.put,
    ...args,
  });
}

export function usePost(args) {
  return useMutate({
    method: methods.post,
    ...args,
  });
}

export function usePatch(args) {
  return useMutate({
    method: methods.patch,
    ...args,
  });
}

export function useDelete(args) {
  return useMutate({
    method: methods.delete,
    ...args,
  });
}
