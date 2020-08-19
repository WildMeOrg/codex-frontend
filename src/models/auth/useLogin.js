import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useLogin(formId) {
  const [error, setError] = useState(null);
  const authenticate = async (email, password) => {
    try {
      console.log('attempting authentication', email, password);
      const response = await axios.request({
        url: 'http://localhost:5000/api/v1/auth/sessions',
        method: 'post',
        data: {
          email,
          password,
        },
      });

      const successful = get(response, 'data.success', false);
      console.log(response);

      if (successful) {
        setTimeout(() => {
          const form = document.getElementById(formId);
          console.log('Submitting form...');
          if (form) form.submit();
        }, 3000);
      } else {
        setError('Invalid username or password');
      }
    } catch (loginErorr) {
      console.error('Error logging in');
      console.error(loginErorr);
    }
  };

  return authenticate;
}
