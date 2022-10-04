import { useIntl } from 'react-intl';

export default function useHandleAxiosError() {
  const intl = useIntl();
  const defaultError = intl.formatMessage({
    id: 'ERROR_FORMATTING_JSON',
  });

  return function handleAxiosError(axiosError) {
    let error = defaultError;

    if (axiosError.response.data?.message) {
      error = axiosError.response.data.message;
    } else if (axiosError.toJSON) {
      error = axiosError.toJSON().message;
    } else if (axiosError.message) {
      error = axiosError.message;
    }
    return Promise.reject(error);
  };
}
