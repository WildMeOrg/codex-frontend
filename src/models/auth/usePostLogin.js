import { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context';

export default function usePostLogin() {
  const { dispatch } = useContext(AppContext);

  const postLogin = async (email, password) => {
    try {
      const loginFormData = new FormData();
      loginFormData.set('email', email);
      loginFormData.set('password', password);

      // const response = axios.request({
      //   url: 'https://houston.dyn.wildme.io/api/v1/auth/sessions',
      //   method: 'post',
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   data: loginFormData,
      // }, {
      //   credentials: 'include',
      // });
      // console.log(response);

      // setTimeout(() => {
      //   console.log(response);
      // }, 5000);
      setTimeout(() => {
        const me = axios.request({
          url: 'https://houston.dyn.wildme.io/api/v1/users/me',
          method: 'get',
        }, {
          withCredentials: true,
        });
        console.log(me);
      }, 5000);

      // need to dispatch auth credentials to context
    } catch (postError) {
      console.error('Error logging in');
      console.error(postError);
    }
  };

  return postLogin;
}
