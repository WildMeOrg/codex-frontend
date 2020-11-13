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

  const authenticate = async (email, password, redirect = '/') => {
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
        window.location.href = redirect;
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
