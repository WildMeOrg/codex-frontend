import { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context';

export default function usePostLogin() {
  const { dispatch } = useContext(AppContext);

  const postLogin = async (email, password) => {
    try {
      const response = axios.request({
        // url: 'https://houston.dyn.wildme.io/api/v1/auth/sessions',
        url: 'https://wildme.ngrok.io/api/v1/auth/sessions', // temporary url
        method: 'post',
        data: {
          email,
          password,
        },
      });
      console.log(response);

      setTimeout(() => {
        console.log(response);
      }, 5000);
      // setTimeout(() => {
      //   const me = axios.request({
      //     // url: 'https://houston.dyn.wildme.io/api/v1/users/me',
      //     url: 'https://wildme.ngrok.io/api/v1/users/me', // temporary url
      //     method: 'get',
      //   });
      //   console.log(me);
      // }, 5000);

      // need to dispatch auth credentials to context
    } catch (postError) {
      console.error('Error logging in');
      console.error(postError);
    }
  };

  return postLogin;
}
