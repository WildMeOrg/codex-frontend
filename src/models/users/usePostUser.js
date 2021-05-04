import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePostUser() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postUser = async (email, password) => {
    try {
      const response = await axios({
        url: `${__houston_url__}/api/v1/users/`,
        withCredentials: true,
        method: 'post',
        data: {
          email,
          password,
        },
      });
      const successful = get(response, 'status') === 200;
      if (successful) {
        setSuccess(`User ${email} created succesfully.`);
        setError(null);
        return true;
      }

      setError(formatError(response));
      setSuccess(false);
      return false;
    } catch (postError) {
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    postUser,
    error,
    setError,
    success,
    setSuccess,
  };
}
