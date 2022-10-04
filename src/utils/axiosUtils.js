export function handleAxiosError(axiosError) {
  let error = 'Error could not be formatted as JSON';

  if (axiosError.response.data?.message) {
    error = axiosError.response.data.message;
  } else if (axiosError.toJSON) {
    error = axiosError.toJSON().message;
  } else if (axiosError.message) {
    error = axiosError.message;
  }

  return Promise.reject(error);
}

export function prefixApiURL(url) {
  return `/api/v1${url}`;
}
