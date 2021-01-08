import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

export default function useLogin() {
  const intl = useIntl();
  const invalidError = intl.formatMessage({
    id: 'INVALID_EMAIL_OR_PASSWORD',
  });

  const serverError = intl.formatMessage({ id: 'SERVER_ERROR' });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const authenticate = async (email, password, redirect = '/') => {
    try {
      setLoading(true);
      const createResponse = await axios.request({
        url: `${__houston_url__}/api/v1/users/admin_user_initialized`,
        method: 'post',
        data: {
          email,
          password,
        },
      });

      const createSuccessful = get(
        createResponse,
        'data.success',
        false,
      );

      if (createSuccessful) {
        const loginResponse = await axios.request({
          url: `${__houston_url__}/api/v1/auth/sessions`,
          method: 'post',
          data: {
            email,
            password,
          },
        });

        const loginSuccessful = get(
          loginResponse,
          'data.success',
          false,
        );

        if (loginSuccessful) {
          window.location.href = redirect;
        } else {
          setError(serverError);
        }
      } else {
        setError(invalidError);
      }
    } catch (createAdminUserError) {
      setLoading(false);
      setError(serverError);
      console.error('Error creating admin user');
      console.error(createAdminUserError);
    }
  };

  return { authenticate, error, setError, loading };
}
