import { useIntl } from 'react-intl';

function getHoustonErrorMessage(error) {
  return error?.response?.data?.message;
}

function getAxiosErrorMessage(error) {
  return error?.toJSON ? error.toJSON().message : null;
}

function getJsErrorMessage(error) {
  return error?.message;
}

export default function useHandleRequestError() {
  const intl = useIntl();

  return function handleRequestError(error) {
    const defaultErrorMessage = intl.formatMessage({
      id: 'UNKNOWN_ERROR',
    });

    const errorMessage =
      getHoustonErrorMessage(error) ||
      getAxiosErrorMessage(error) ||
      getJsErrorMessage(error) ||
      defaultErrorMessage;

    return Promise.reject(errorMessage);
  };
}
