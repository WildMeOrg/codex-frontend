import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

export default function useLogin() {
  const intl = useIntl();

  const errorMessage = intl.formatMessage({
    id: 'INVALID_EMAIL_OR_PASSWORD',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const authenticate = async (email, password, nextLocation) => {
    try {
      setLoading(true);
      const response = await axios.request({
        url: `${__houston_url__}/api/v1/auth/sessions`,
        method: 'post',
        data: {
          email,
          password,
        },
      });

      const successful = get(response, 'data.success', false);

      if (successful) {
        let url = '/';
        if (nextLocation) {
          url = nextLocation?.pathname;
          url = nextLocation?.search
            ? url + nextLocation.search
            : url;
          url = nextLocation?.hash ? url + nextLocation.hash : url;
        }
        window.location.href = url;
        // Fun quirk - a reload is required if there is a hash in the URL.
        // https://stackoverflow.com/questions/10612438/javascript-reload-the-page-with-hash-value
        if (nextLocation?.hash) window.location.reload();
      } else {
        setError(errorMessage);
      }
    } catch (loginError) {
      setLoading(false);
      setError(errorMessage);
      console.error('Error logging in');
      console.error(loginError);
    }
  };

  return { authenticate, error, setError, loading };
}
